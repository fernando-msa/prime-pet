(function () {
  const STORAGE_KEY = 'primepet_api_mode';
  const VALID_MODES = new Set(['legacy', 'v2']);

  function detectMode() {
    const urlMode = new URLSearchParams(window.location.search).get('apiMode');
    if (urlMode && VALID_MODES.has(urlMode)) {
      localStorage.setItem(STORAGE_KEY, urlMode);
      return urlMode;
    }

    const storedMode = localStorage.getItem(STORAGE_KEY);
    if (storedMode && VALID_MODES.has(storedMode)) return storedMode;

    return 'legacy';
  }

  function getTenantId() {
    return localStorage.getItem('primepet_tenant_id') || 'tenant_legacy_clinica_01';
  }

  function getAuthToken() {
    return localStorage.getItem('primepet_v2_access_token') || '';
  }

  function buildHeaders(extraHeaders) {
    const headers = {
      'Content-Type': 'application/json',
      'x-tenant-id': getTenantId(),
      ...extraHeaders,
    };

    const token = getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    return headers;
  }

  async function request(path, options = {}) {
    const mode = detectMode();
    const endpointBase = mode === 'v2' ? '/api/v2' : '';
    const response = await fetch(`${endpointBase}${path}`, {
      ...options,
      headers: buildHeaders(options.headers || {}),
    });

    return response;
  }

  function setMode(mode) {
    if (!VALID_MODES.has(mode)) throw new Error('Modo inválido. Use legacy ou v2.');
    localStorage.setItem(STORAGE_KEY, mode);
    return mode;
  }

  window.PrimePetApiBridge = {
    getMode: detectMode,
    setMode,
    request,
    getTenantId,
  };
})();
