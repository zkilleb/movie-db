import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { StyledTableCell } from '..';

export function AddedReleaseCell({
  value,
  handleAddedReleaseChange,
  id,
}: {
  value?: string;
  handleAddedReleaseChange: (value: string) => void;
  id: string;
}) {
  const classes = useStyles();

  return (
    <StyledTableCell>
      <TextField
        id={id}
        InputProps={{
          disableUnderline: true,
          className: classes.field,
        }}
        InputLabelProps={{ className: classes.field }}
        value={value}
        onChange={(event) => {
          handleAddedReleaseChange(event.target.value);
        }}
      >
        {value}
      </TextField>
    </StyledTableCell>
  );
}

const useStyles = makeStyles(() => ({
  field: {
    color: 'white',
  },
}));
