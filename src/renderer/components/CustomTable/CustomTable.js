import React from 'react';
import PropTypes from 'prop-types';
//import { fade, makeStyles, withStyles } from '@material-ui/core/styles';

import { lighten, makeStyles, withStyles } from '@material-ui/core/styles';
import { Table, TableBody } from '@material-ui/core';
import CustomTableHeader from './CustomTableHeader';

const styles = theme => ({
    root: {
        flexGrow: 1,
    }
});

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function sortItems(array, order, orderBy) {
    const cmp = order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);

    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function CustomTable(props) {
    const { classes, columns, items, buildRow, dense, ...other } = props;
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState(''); // TODO: Pass in defaultOrderBy prop

    function handleRequestSort(event, property) {
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    }

    return (
        <React.Fragment>
            <div className={classes.tableWrapper}>
                <Table
                    className={classes.table}
                    aria-labelledby="tableTitle"
                    size={dense ? 'small' : 'medium'}
                    {...other}
                >
                    <CustomTableHeader
                        columns={columns}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                        {sortItems(items, order, orderBy)
                            .map((row, index) => {
                                return buildRow(row, index);
                            })}
                    </TableBody>
                </Table>
            </div>
        </React.Fragment>
    );
}

CustomTable.propTypes = {
    columns: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
    buildRow: PropTypes.func.isRequired,
    dense: PropTypes.bool
};

/*const CustomTable = (props) => {
    const classes = useStylesReddit();
    return <TextField InputProps={{ classes, disableUnderline: true }} {...props} />;
}*/

export default withStyles(styles)(CustomTable);
