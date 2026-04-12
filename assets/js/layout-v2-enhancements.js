(function () {
  const btn = document.createElement('button');
  btn.className = 'pp-v2-fab';
  btn.type = 'button';
  btn.title = 'Ações rápidas';
  btn.textContent = '⚡';

  const panel = document.createElement('div');
  panel.className = 'pp-v2-quick-panel';
  panel.innerHTML = [
    '<a href="index.html">🏠 Ir para Contrato</a>',
    '<a href="client.html">👤 Ir para Cliente</a>',
    '<a href="admin.html">🛠️ Ir para Admin</a>',
    '<a href="dashboard.html">📊 Ir para Dashboard</a>',
    '<button type="button" data-action="theme">🌓 Alternar tema</button>',
  ].join('');

  btn.addEventListener('click', () => panel.classList.toggle('open'));

  panel.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.dataset.action === 'theme') {
      const current = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      if (next === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
      } else {
        document.body.removeAttribute('data-theme');
      }
      localStorage.setItem('primepet-theme', next);
      panel.classList.remove('open');
    }
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (!panel.contains(target) && target !== btn) {
      panel.classList.remove('open');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      panel.classList.remove('open');
    }
  });

  const savedTheme = localStorage.getItem('primepet-theme');
  if (savedTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
  }

  document.body.appendChild(panel);
  document.body.appendChild(btn);
})();
