import { TableCell } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

export const StyledTableCell = withStyles({
  root: {
    color: 'white',
  },
})(TableCell);

export const StyledTableHeaderCell = withStyles({
  root: {
    color: 'white',
    fontWeight: 'bold',
  },
})(TableCell);
