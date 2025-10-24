export const navLinks = [
  {
    path: '/',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
  },
  {
    path: '/inspection',
    label: 'Inspeção',
    icon: 'Wrench',
  },
  // Add future modules here
];

export const modulePermissions = {
  admin: ['/', '/inspection'],
  user: ['/inspection'],
};
