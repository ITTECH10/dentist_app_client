import AddPacientModal from '../../components/PACIENTS/AddPacientDialog';
import AddAppointmentModal from '../../components/APPOINTMENTS/AddAppointmentDialog';
import AddDiagnosisDialog from '../../components/DIAGNOSIS/AddDiagnosisDialog';
import AddEmployeeModal from '../../components/EMPLOYEES/AddEmployeeDialog';
import AddOrdinationDialog from '../../components/ORDINATIONS/AddOrdinationDialog';

export const actions = [
    { icon: <AddPacientModal onlyIcon />, name: 'Novi Pacijent' },
    { icon: <AddAppointmentModal onlyIcon />, name: 'Novi Termin' },
    { icon: <AddDiagnosisDialog onlyIcon />, name: 'Nova Diagnoza' },
    { icon: <AddEmployeeModal onlyIcon />, name: 'Novi Zaposlenik' },
    { icon: <AddOrdinationDialog onlyIcon />, name: 'Nova Ordinacija' },
];

export const nonAdminActions = [
    { icon: <AddPacientModal onlyIcon />, name: 'Novi Pacijent' },
    { icon: <AddAppointmentModal onlyIcon />, name: 'Novi Termin' }
];

