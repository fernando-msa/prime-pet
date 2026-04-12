(function () {
  const path = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const entries = [
    { href: 'index.html', label: 'Contrato', icon: '📄' },
    { href: 'client.html', label: 'Cliente', icon: '👤' },
    { href: 'admin.html', label: 'Admin', icon: '🛠️' },
    { href: 'dashboard.html', label: 'Dashboard', icon: '📊' },
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

  const sidebar = document.createElement('aside');
  sidebar.className = 'pp-v2-sidebar';

  const sideTitle = document.createElement('div');
  sideTitle.className = 'pp-v2-side-title';
  sideTitle.textContent = 'Navegação PrimePet';
  sidebar.appendChild(sideTitle);

  entries.forEach((entry) => {
    const link = document.createElement('a');
    link.className = 'pp-v2-side-link';
    link.href = entry.href;
    link.innerHTML = `<span>${entry.icon}</span><span>${entry.label}</span>`;
    if (path === entry.href.toLowerCase()) link.classList.add('active');
    sidebar.appendChild(link);
  });

  document.body.classList.add('pp-v2-layout');
  document.body.prepend(sidebar);
  document.body.prepend(shell);
})();
