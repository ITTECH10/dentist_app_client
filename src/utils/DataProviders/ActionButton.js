import AddPacientModal from '../../components/PACIENTS/AddPacientDialog';
import AddAppointmentModal from '../../components/APPOINTMENTS/AddAppointmentDialog';
import AddDiagnosisDialog from '../../components/DIAGNOSIS/AddDiagnosisDialog';
import AddEmployeeModal from '../../components/EMPLOYEES/AddEmployeeDialog';
import AddOrdinationModal from '../../components/ORDINATIONS/AddOrdinationModal';

export const actions = [
    { icon: <AddPacientModal onlyIcon />, name: 'Novi Pacijent' },
    { icon: <AddAppointmentModal onlyIcon />, name: 'Novi Termin' },
    { icon: <AddDiagnosisDialog onlyIcon />, name: 'Nova Diagnoza' },
    { icon: <AddEmployeeModal onlyIcon />, name: 'Novi Zaposlenik' },
    { icon: <AddOrdinationModal />, name: 'Nova Ordinacija' },
];

export const nonAdminActions = [
    { icon: <AddPacientModal />, name: 'Novi Pacijent' },
    { icon: <AddAppointmentModal />, name: 'Novi Termin' }
];

