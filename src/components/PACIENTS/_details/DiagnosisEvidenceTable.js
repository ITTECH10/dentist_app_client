import { filter } from 'lodash';
import { useState } from 'react';
import { usePacientContext } from './../../../context/PacientContext';
// material
import {
    Table,
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
import Scrollbar from '../../Scrollbar';
import SearchNotFound from '../../SearchNotFound';
import { UserListHead } from '../../../components/_dashboard/user';
import TableMoreMenu from './../../_dashboard/user/TableMoreMenu'
import ListToolbar from '../../../components/_dashboard/user/ListToolbar'
import DeleteDiagnosisDialog from './../../DIAGNOSIS/DeleteDiagnosisDialog'
import EditDiagnosisDialog from './../../DIAGNOSIS/EditDiagnosisDialog'
// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'date', label: 'Datum', alignRight: false },
    { id: 'type', label: 'Vrsta', alignRight: false },
    { id: 'tooth', label: 'Zub', alignRight: false },
    { id: 'employeeId', label: 'Stomatolog', alignRight: false },
    { id: 'ordinationId', label: 'Ordinacija', alignRight: false },
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
        return filter(array, (_user) => `${_user.employeeId.firstName} ${_user.employeeId.lastName}`.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function User() {
    const { selectedPacient } = usePacientContext()
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const diagnosis = selectedPacient.diagnosis || []

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
        <Container>
            <ListToolbar
                numSelected={selected.length}
                filterName={filterName}
                onFilterName={handleFilterByName}
                placeholderRole="Prona??ite diagnozu..."
            />
            <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                    <Table>
                        <UserListHead
                            order={order}
                            orderBy={orderBy}
                            headLabel={TABLE_HEAD}
                            rowCount={6}
                            numSelected={selected.length}
                            onRequestSort={handleRequestSort}
                            onSelectAllClick={handleSelectAllClick}
                        />
                        <TableBody>
                            {filteredUsers
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    const { _id, tooth, ordination, kind, employeeId, date } = row;
                                    const formatedDate = new Date(date).toLocaleString('bs-BA')
                                    const employeeName = `${employeeId.firstName} ${employeeId.lastName}`

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
                                                    {formatedDate}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="left">{kind}</TableCell>
                                            <TableCell align="left">{tooth}</TableCell>
                                            <TableCell align="left">{employeeName}</TableCell>
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
                count={diagnosis.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Container>
    );
}
