import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  onSnapshot,
  query as fsQuery,
  where,
  orderBy,
  limit
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const ROOT_COLLECTIONS = new Set([
  'agendamentos',
  'historico_clientes',
  'historico_acoes',
  'logs_erros',
  'clientes_perfis',
  'assistente_faq',
  'assistente_duvidas',
  'public_config'
]);

class CompatSnapshot {
  constructor(value) { this._value = value; }
  exists() {
    if (this._value === null || this._value === undefined) return false;
    if (typeof this._value === 'object') return Object.keys(this._value).length > 0;
    return true;
  }
  val() { return this._value; }
}

export function getDatabase(app) {
  return getFirestore(app);
}

export function ref(_db, path) {
  return { db: _db, path: String(path || '').replace(/^\/+|\/+$/g, '') };
}

export function push(refObj) {
  return { db: refObj.db, path: `${refObj.path}/__push__/${crypto.randomUUID()}` };
}

export function orderByChild(field) {
  return { type: 'orderByChild', field };
}

export function equalTo(value) {
  return { type: 'equalTo', value };
}

export function query(refObj, ...constraints) {
  return { db: refObj.db, path: refObj.path, constraints };
}

function parsePath(path) {
  const segs = String(path || '').split('/').filter(Boolean);
  return { segs, root: segs[0] || '', len: segs.length };
}

function isRootCollection(root) {
  return ROOT_COLLECTIONS.has(root);
}

function agendamentoDocId(date, hour) {
  return `${date}__${hour}`;
}

function toNestedObject(pathParts, value) {
  return pathParts.reduceRight((acc, key) => ({ [key]: acc }), value);
}

async function getCollectionAsObject(db, root, qConstraints = []) {
  let qRef = collection(db, root);
  const order = qConstraints.find(c => c?.type === 'orderByChild');
  const eq = qConstraints.find(c => c?.type === 'equalTo');
  const constraints = [];
  if (eq && order) constraints.push(where(order.field, '==', eq.value));
  if (order && order.field !== '__name__') constraints.push(orderBy(order.field));
  constraints.push(limit(500));
  const snap = await getDocs(constraints.length ? fsQuery(qRef, ...constraints) : qRef);
  const out = {};
  snap.forEach((d) => { out[d.id] = d.data(); });
  return out;
}

async function getAgendamentosTree(db) {
  const snap = await getDocs(collection(db, 'agendamentos'));
  const out = {};
  snap.forEach((d) => {
    const data = d.data() || {};
    const date = data.date;
    const hour = data.hour;
    if (!date || !hour) return;
    if (!out[date]) out[date] = {};
    out[date][hour] = data.status || 'pending';
  });
  return out;
}

export async function get(refOrQuery) {
  const db = refOrQuery.db || getFirestore();
  const { path, constraints = [] } = refOrQuery;
  const { segs, root, len } = parsePath(path);

  if (refOrQuery.constraints) {
    const data = await getCollectionAsObject(db, root, constraints);
    return new CompatSnapshot(data);
  }

  if (!isRootCollection(root)) return new CompatSnapshot(null);

  if (root === 'agendamentos') {
    if (len === 1) return new CompatSnapshot(await getAgendamentosTree(db));
    if (len === 3) {
      const [_, date, hour] = segs;
      const d = await getDoc(doc(db, 'agendamentos', agendamentoDocId(date, hour)));
      return new CompatSnapshot(d.exists() ? (d.data().status || null) : null);
    }
  }

  if (len === 1) return new CompatSnapshot(await getCollectionAsObject(db, root));

  if (len === 2) {
    const d = await getDoc(doc(db, root, segs[1]));
    return new CompatSnapshot(d.exists() ? d.data() : null);
  }

  const d = await getDoc(doc(db, root, segs[1]));
  if (!d.exists()) return new CompatSnapshot(null);
  const value = segs.slice(2).reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), d.data());
  return new CompatSnapshot(value);
}

export async function set(refObj, value) {
  const db = refObj.db || getFirestore();
  const { segs, root, len } = parsePath(refObj.path);
  if (!isRootCollection(root)) return;

  if (refObj.path.includes('/__push__/')) {
    const colPath = refObj.path.split('/__push__/')[0];
    await addDoc(collection(db, colPath), value);
    return;
  }

  if (root === 'agendamentos' && len === 3) {
    const [_, date, hour] = segs;
    await setDoc(doc(db, 'agendamentos', agendamentoDocId(date, hour)), { date, hour, status: value }, { merge: true });
    return;
  }

  if (len === 1) {
    if (value && typeof value === 'object' && Object.keys(value).length === 0) {
      const snap = await getDocs(collection(db, root));
      await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
      return;
    }
    const id = 'default';
    await setDoc(doc(db, root, id), value || {}, { merge: false });
    return;
  }

  if (len === 2) {
    await setDoc(doc(db, root, segs[1]), value, { merge: false });
    return;
  }

  const fieldPath = segs.slice(2).join('.');
  try {
    await updateDoc(doc(db, root, segs[1]), { [fieldPath]: value });
  } catch (_) {
    await setDoc(doc(db, root, segs[1]), toNestedObject(segs.slice(2), value), { merge: true });
  }
}

export async function remove(refObj) {
  const db = refObj.db || getFirestore();
  const { segs, root, len } = parsePath(refObj.path);
  if (!isRootCollection(root)) return;

  if (root === 'agendamentos' && len === 3) {
    const [_, date, hour] = segs;
    await deleteDoc(doc(db, 'agendamentos', agendamentoDocId(date, hour)));
    return;
  }

  if (len >= 2) {
    await deleteDoc(doc(db, root, segs[1]));
  }
}

export function onValue(refObj, callback) {
  const db = refObj.db || getFirestore();
  const { segs, root, len } = parsePath(refObj.path);

  if (root === 'agendamentos' && len === 1) {
    return onSnapshot(collection(db, 'agendamentos'), (snap) => {
      const out = {};
      snap.forEach((d) => {
        const data = d.data() || {};
        if (!data.date || !data.hour) return;
        if (!out[data.date]) out[data.date] = {};
        out[data.date][data.hour] = data.status || 'pending';
      });
      callback(new CompatSnapshot(out));
    });
  }

  if (len === 1) {
    return onSnapshot(collection(db, root), (snap) => {
      const out = {};
      snap.forEach((d) => { out[d.id] = d.data(); });
      callback(new CompatSnapshot(out));
    });
  }

  return onSnapshot(doc(db, root, segs[1]), (snap) => {
    callback(new CompatSnapshot(snap.exists() ? snap.data() : null));
  });
}
