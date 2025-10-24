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
  // Add future modules here
];

export const modulePermissions = {
  admin: ['/', '/inspection'],
  user: ['/inspection'],
};
