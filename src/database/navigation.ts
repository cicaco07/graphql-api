export const Navigation = [
  {
    name: 'Dashboard',
    icon: 'ti ti-home',
    link: '/dashboard',
    order: 1,
    is_header: true,
    is_active: true,
  },
  {
    name: 'Navigation',
    icon: 'ti ti-layout-navbar',
    link: '/navigation',
    order: 2,
    is_header: true,
    is_active: true,
  },
  {
    name: 'Data Hero',
    icon: 'ti ti-hero',
    order: 3,
    is_header: true,
    is_active: true,
  },
  {
    parent: 'Data Hero',
    name: 'Hero',
    order: 1,
    is_header: true,
    is_active: true,
  },
];
