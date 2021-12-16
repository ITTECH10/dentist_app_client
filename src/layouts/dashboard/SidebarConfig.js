import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/briefcase-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import employeesFill from '@iconify/icons-clarity/employee-group-solid';
// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

export const mainRolesSidebarConfig = [
  {
    title: 'Radna Površina',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'Pacijenti',
    path: '/dashboard/pacients',
    icon: getIcon(peopleFill)
  },
  {
    title: 'Zaposleni',
    path: '/dashboard/employees',
    icon: getIcon(employeesFill)
  }
];

export const subRolesSidebarConfig = [
  {
    title: 'Radna Površina',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'Pacijenti',
    path: '/dashboard/pacients',
    icon: getIcon(peopleFill)
  }
]
