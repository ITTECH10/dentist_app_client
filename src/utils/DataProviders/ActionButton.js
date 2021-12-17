import AddPacientModal from '../../components/PACIENTS/AddPacientModal';
import AddAppointmentModal from '../../components/APPOINTMENTS/AddAppointmentDialog';
import AddEmployeeModal from '../../components/EMPLOYEES/AddEmployeeModal';
import AddOrdinationModal from '../../components/ORDINATIONS/AddOrdinationModal';

export const actions = [
    { icon: <AddPacientModal />, name: 'Novi Pacijent' },
    { icon: <AddAppointmentModal />, name: 'Novi Termin' },
    { icon: <AddEmployeeModal />, name: 'Novi Zaposlenik' },
    { icon: <AddOrdinationModal />, name: 'Nova Ordinacija' },
];

export const nonAdminActions = [
    { icon: <AddPacientModal />, name: 'Novi Pacijent' },
    { icon: <AddAppointmentModal />, name: 'Novi Termin' }
];

