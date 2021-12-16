import { useNavigate } from 'react-router-dom'
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
import { moreMenuItems } from './../../../utils/DataProviders/TableMoreMenu'

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
        return filter(array, (_user) => `${_user.firstName} ${_user.lastName}`.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function User() {
    const { pacients } = usePacientContext()
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = pacients.map((n) => n.name);
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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - pacients.length) : 0;

    const filteredUsers = applySortFilter(pacients, getComparator(order, orderBy), filterName);

    const isUserNotFound = filteredUsers.length === 0;

    return (
        <Container>
            <ListToolbar
                numSelected={selected.length}
                filterName={filterName}
                onFilterName={handleFilterByName}
                placeholderRole="Pronađite diagnozu..."
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
                                    const name = row.firstName + ' ' + row.lastName
                                    const { _id, gender, checked } = row;
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
                                            <TableCell component="th" scope="row" padding="none">
                                                <Typography variant="subtitle2" noWrap>
                                                    2021/03/12
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="left">Sanacija</TableCell>
                                            <TableCell align="left">32</TableCell>
                                            <TableCell align="left">Kenan Jašarevic</TableCell>
                                            <TableCell align="left">
                                                Živinice
                                            </TableCell>

                                            <TableCell align="right">
                                                <TableMoreMenu menuItemsArr={moreMenuItems} />
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
                count={pacients.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Container>
    );
}
