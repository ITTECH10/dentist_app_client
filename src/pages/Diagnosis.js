import { filter } from 'lodash';
import { useState } from 'react';
import AddDiagnosisDialog from './../components/DIAGNOSIS/AddDiagnosisDialog'
import { usePacientContext } from './../context/PacientContext';
// material
import {
    Card,
    Table,
    Stack,
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
import DeleteDiagnosisDialog from './../components/DIAGNOSIS/DeleteDiagnosisDialog'
import EditDiagnosisDialog from './../components/DIAGNOSIS/EditDiagnosisDialog'
//
import USERLIST from '../_mocks_/user';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'pacientName', label: 'Pacijent', alignRight: false },
    { id: 'employeeName', label: 'Stomatolog', alignRight: false },
    { id: 'date', label: 'Datum i vrijeme', alignRight: false },
    { id: 'kind', label: 'Vrsta', alignRight: false },
    { id: 'tooth', label: 'Zub', alignRight: false },
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
        return filter(array, (_user) => {
            const localeDate = new Date(_user.date).toLocaleDateString('bs-BA')
            return `${_user.pacientId.firstName} ${_user.pacientId.lastName}`.toLowerCase().indexOf(query.toLowerCase()) !== -1 || localeDate.toLowerCase().indexOf(query.toLowerCase()) !== -1
        });
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function User() {
    const { diagnosis } = usePacientContext()
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('pacientName');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = diagnosis.map((n) => n._id);
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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - diagnosis.length) : 0;

    const filteredUsers = applySortFilter(diagnosis, getComparator(order, orderBy), filterName);

    const isUserNotFound = filteredUsers.length === 0;

    return (
        <Page title="Dijagnoze">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Dijagnoze
                    </Typography>
                    <AddDiagnosisDialog title="Nova dijagnoza" />
                </Stack>

                <Card>
                    <UserListToolbar
                        numSelected={selected.length}
                        filterName={filterName}
                        onFilterName={handleFilterByName}
                        placeholderRole="Pronađite dijagnozu..."
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
                                            const { _id, date, employeeId, pacientId, pacientName: generatedPacientName, employeeName: generatedEmployeeName, tooth, ordination, kind } = row;

                                            const employeeName = generatedEmployeeName || `${employeeId.firstName} ${employeeId.lastName}`
                                            const pacientName = generatedPacientName || `${pacientId.firstName} ${pacientId.lastName}`

                                            const localeFormatedDate = new Date(date).toLocaleString('bs-BA')
                                            const isItemSelected = selected.indexOf(_id) !== -1;

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
                                                            onChange={(event) => handleClick(event, _id)}
                                                        />
                                                    </TableCell>
                                                    <TableCell component="th" scope="row" padding="none">
                                                        <Typography variant="subtitle2" noWrap>
                                                            {pacientName}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell component="th" scope="row" padding="none">
                                                        <Typography variant="subtitle2" noWrap>
                                                            {employeeName}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="left">{localeFormatedDate}</TableCell>
                                                    <TableCell align="left">{kind}</TableCell>
                                                    <TableCell align="left">{tooth}</TableCell>
                                                    <TableCell align="left">
                                                        {ordination}
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        <TableMoreMenu>
                                                            <DeleteDiagnosisDialog diagnosisId={_id} />
                                                            <EditDiagnosisDialog diagnosisId={_id} />
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
                        count={filteredUsers.length}
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
