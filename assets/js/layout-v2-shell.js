(function () {
  const path = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const entries = [
    { href: 'index.html', label: 'Contrato' },
    { href: 'client.html', label: 'Cliente' },
    { href: 'admin.html', label: 'Admin' },
    { href: 'dashboard.html', label: 'Dashboard' },
  ];

  const shell = document.createElement('div');
  shell.className = 'pp-v2-shell';

  const brand = document.createElement('div');
  brand.className = 'pp-v2-brand';
  brand.innerHTML = 'Prime <span>Pet</span> v2';

  const nav = document.createElement('nav');
  nav.className = 'pp-v2-nav';
  entries.forEach((entry) => {
    const link = document.createElement('a');
    link.href = entry.href;
    link.textContent = entry.label;
    if (path === entry.href.toLowerCase()) link.classList.add('active');
    nav.appendChild(link);
  });

  shell.appendChild(brand);
  shell.appendChild(nav);
  document.body.classList.add('pp-v2-layout');
  document.body.prepend(shell);
})();
