import { filter } from 'lodash';
import { useState } from 'react';
import AddEmployeeDialog from './../components/EMPLOYEES/AddEmployeeDialog'
import { useEmployeeContext } from './../context/EmployeeContext';
// material
import {
    Card,
    Table,
    Stack,
    Avatar,
    Button,
    Checkbox,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination
} from '@mui/material';

// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar } from '../components/_dashboard/user';
import TableMoreMenu from './../components/_dashboard/user/TableMoreMenu'
import EditEmployeeDialog from './../components/EMPLOYEES/EditEmployeeDialog'
import DeleteEmployeeDialog from './../components/EMPLOYEES/DeleteEmployeeDialog'

//
import USERLIST from '../_mocks_/user';
import { hasPermission, actions } from './../utils/DataProviders/ROLES/permissions'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'name', label: 'Ime', alignRight: false },
    { id: 'role', label: 'Uloga', alignRight: false },
    { id: 'email', label: 'Email', alignRight: false },
    { id: 'phone', label: 'Telefon', alignRight: false },
    { id: 'ordination', label: 'Ordinacija', alignRight: false },
    { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_user) => `${_user.firstName} ${_user.lastName}`.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function User() {
    const { employees, logedInEmployee } = useEmployeeContext()
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const allowed = hasPermission(logedInEmployee, actions.ADD_EMPLOYEE)

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = employees.map((n) => `${n.firstName} ${n.lastName}`);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterByName = (event) => {
        setFilterName(event.target.value);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - employees.length) : 0;

    const filteredUsers = applySortFilter(employees, getComparator(order, orderBy), filterName);

    const isUserNotFound = filteredUsers.length === 0;

    return (
        <Page title="Zaposlenici">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Zaposlenici
                    </Typography>
                    {allowed &&
                        <AddEmployeeDialog />
                    }
                </Stack>

                <Card>
                    <UserListToolbar
                        numSelected={selected.length}
                        filterName={filterName}
                        onFilterName={handleFilterByName}
                        placeholderRole="Pronađite zaposlenika..."
                    />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={USERLIST.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredUsers
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => {
                                            const name = row.firstName + ' ' + row.lastName
                                            const { _id, birthDate, role, phone, gender, employeeImage, checked, email, ordination } = row;
                                            const status = checked ? 'Pregledan' : 'Nepregledan'
                                            const formatedGender = gender === 'male' ? 'Muško' : 'Žensko'
                                            const avatarUrl = gender === 'female' ? '/static/mock-images/avatars/pacient_female_default.png' : '/static/mock-images/avatars/pacient_male_default.png'
                                            const isItemSelected = selected.indexOf(name) !== -1;

                                            return (
                                                <TableRow
                                                    hover
                                                    sx={{ cursor: 'pointer' }}
                                                    key={_id}
                                                    tabIndex={-1}
                                                    role="checkbox"
                                                    selected={isItemSelected}
                                                    aria-checked={isItemSelected}
                                                >
                                                    <TableCell
                                                        padding="checkbox"
                                                    >
                                                        <Checkbox
                                                            checked={isItemSelected}
                                                            onChange={(event) => handleClick(event, name)}
                                                        />
                                                    </TableCell>
                                                    {/* <TableCell component="th" scope="row" padding="none" onClick={() => handlePacientNavigation(_id)}> */}
                                                    <TableCell component="th" scope="row" padding="none">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            <Avatar alt={name} src={!employeeImage ? avatarUrl : employeeImage} />
                                                            <Typography variant="subtitle2" noWrap>
                                                                {name}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell align="left">{role}</TableCell>
                                                    <TableCell align="left">{email}</TableCell>
                                                    <TableCell align="left">{phone}</TableCell>
                                                    <TableCell align="left">
                                                        Živinice
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        <TableMoreMenu>
                                                            <EditEmployeeDialog employeeId={_id} />
                                                            <DeleteEmployeeDialog employeeId={_id} />
                                                        </TableMoreMenu>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                                {isUserNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                <SearchNotFound searchQuery={filterName} />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={employees.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>
        </Page>
    );
}
