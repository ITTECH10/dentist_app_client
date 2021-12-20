import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/briefcase-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import employeesFill from '@iconify/icons-clarity/employee-group-solid';
import appointmentsIcon from '@iconify/icons-bi/calendar-week';
import ordinationsIcon from '@iconify/icons-bi/building';
import diagnosisIcon from '@iconify/icons-bi/clipboard-check';

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
    path: '/pacients',
    icon: getIcon(peopleFill)
  },
  {
    title: 'Zaposleni',
    path: '/employees',
    icon: getIcon(employeesFill)
  },
  {
    title: 'Termini',
    path: '/appointments',
    icon: getIcon(appointmentsIcon)
  },
  {
    title: 'Dijagnoze',
    path: '/diagnosis',
    icon: getIcon(diagnosisIcon)
  },
  {
    title: 'Ordinacije',
    path: '/ordinations',
    icon: getIcon(ordinationsIcon)
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
    path: '/pacients',
    icon: getIcon(peopleFill)
  },
  {
    title: 'Termini',
    path: '/appointments',
    icon: getIcon(appointmentsIcon)
  },
  {
    title: 'Dijagnoze',
    path: '/diagnosis',
    icon: getIcon(diagnosisIcon)
  },
]
