import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Button,
  TableRow,
  TableHead,
  TableContainer,
  TableBody,
  Table,
  TextField,
} from '@material-ui/core';
import { Delete, AddCircle } from '@material-ui/icons';
import { colors } from '../../constants';
import { StyledTableCell, StyledTableHeaderCell } from '..';

export function AddActor({
  actors,
  handleAddedActorChange,
  deleteActor,
  handleAddActor,
}: {
  actors: string[];
  handleAddedActorChange: (value: any, index: number) => void;
  deleteActor: (index: number) => void;
  handleAddActor: (name: string) => void;
}) {
  const classes = useStyles();
  const [addActor, setAddActor] = React.useState<string>('');

  return (
    <div className={classes.wrapper}>
      <TableContainer component={Paper} className={classes.table}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow className={classes.headerRow}>
              <StyledTableHeaderCell colSpan={2} align="center">
                Actor Name
              </StyledTableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {actors.map((actor, index) => (
              <TableRow key={index.toString()}>
                <StyledTableCell align="center" data-cy="AddActorRow">
                  <TextField
                    InputProps={{
                      disableUnderline: true,
                      className: classes.field,
                    }}
                    InputLabelProps={{ className: classes.field }}
                    value={actor}
                    onChange={(value) => handleAddedActorChange(value, index)}
                  >
                    {actor}
                  </TextField>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Delete
                    data-cy="DeleteActor"
                    onClick={() => deleteActor(index)}
                  />
                </StyledTableCell>
              </TableRow>
            ))}
            <StyledTableCell
              className={actors.length > 0 ? classes.headerRow : classes.field}
              colSpan={2}
              align="center"
            >
              <TextField
                InputProps={{ className: classes.field }}
                InputLabelProps={{ className: classes.field }}
                onChange={handleNameField}
                label="Actor Name"
                value={addActor}
                data-cy="AddActorField"
              />
              <Button
                className={classes.addButton}
                onClick={() => handleAdd(addActor)}
                variant="contained"
                data-cy="AddActorButton"
                disabled={!addActor}
              >
                <AddCircle />
              </Button>
            </StyledTableCell>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );

  function handleNameField(event: React.ChangeEvent<HTMLInputElement>) {
    setAddActor(event.target.value);
  }

  function handleAdd(name: string) {
    handleAddActor(name);
    setAddActor('');
  }
}

const useStyles = makeStyles(() => ({
  wrapper: {
    display: 'flex',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  table: {
    backgroundColor: colors.tableBackground,
    width: '50%',
    marginTop: 10,
    margin: 'auto',
    border: '2px solid white',
    marginBottom: 10,
  },
  headerRow: {
    backgroundColor: colors.tableHeaderRowBackground,
  },
  field: {
    color: 'white',
  },
  addButton: {
    margin: 10,
  },
}));
