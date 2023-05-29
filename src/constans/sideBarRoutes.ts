import {
  dashboard,
  experiences,
  users,
  places,
  cities,
  products,
  checkIns
} from 'assets/svg/sidebar';

export type RouteType = {
  path: string;
  label: string;
  icon?: string;
  sublinks?: RouteType[];
};

export type SideBarProps = {
  displayText: string;
  icon?: string;
};

const sideBarRoutes: RouteType[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: dashboard,
  },
  {
    label: 'Users',
    path: '/membership',
    icon: users,
    sublinks: [{ path: '/membership/all-members', label: 'All members' }],
  },
  {
    label: 'Experiences',
    path: '/experiences',
    icon: experiences,
    sublinks: [
      { path: '/experiences/upcoming', label: 'Upcoming' },
      { path: '/experiences/new', label: 'New' },
      { path: '/experiences/history', label: 'History' },
    ],
  },
  {
    label: 'Check-ins',
    path: '/checkins',
    icon: checkIns,
  },
  {
    label: 'Cities',
    path: '/cities',
    icon: cities,
  },
  {
    label: 'Places',
    path: '/places',
    icon: places,
  },
  {
    label: 'Products',
    path: '/products',
    icon: products,
  },
  {
    label: 'Rooms',
    path: '/rooms',
    icon: products,
  },
];

export default sideBarRoutes;
