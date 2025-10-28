export const navLinks = [
  {
    path: '/',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
  },
  {
    path: '/inspection',
    label: 'Inspeção',
    icon: 'SearchCheck',
  },
  {
    path: '/inspected',
    label: 'Inspecionados',
    icon: 'ShieldCheck',
  },
  // Add future modules here
];

export const modulePermissions = {
  admin: ['/', '/inspection', '/inspected'],
  user: ['/inspection', '/inspected'],
};
