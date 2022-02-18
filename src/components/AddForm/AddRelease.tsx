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
  MenuItem,
} from '@material-ui/core';
import { Delete, AddCircle } from '@material-ui/icons';
import { Release } from '../../classes';
import { colors, formats } from '../../constants';
import { StyledTableCell, StyledTableHeaderCell } from '..';

export function AddRelease({
  releases,
  handleAddRelease,
  deleteRelease,
}: {
  releases: Release[];
  handleAddRelease: ({ label, format, notes }: Release) => void;
  deleteRelease: (index: number) => void;
}) {
  const classes = useStyles();
  const [label, setLabel] = React.useState<string>();
  const [format, setFormat] = React.useState<string>(formats[0].value);
  const [releaseNotes, setReleaseNotes] = React.useState<string>();

  return (
    <div className={classes.wrapper}>
      <TableContainer className={classes.table} component={Paper}>
        <Table aria-label="simple table">
          <TableHead data-cy="ReleasesHeaderRow">
            <TableRow className={classes.headerRow}>
              <StyledTableHeaderCell colSpan={4} align="center">
                <div className={classes.header}>Releases</div>
              </StyledTableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {releases.map((release, index) => {
              return (
                <TableRow key={index} data-cy="ReleaseResultRow">
                  <StyledTableCell>{release.label}</StyledTableCell>
                  <StyledTableCell>{release.format}</StyledTableCell>
                  <StyledTableCell>{release.notes}</StyledTableCell>
                  <StyledTableCell>
                    <Delete
                      onClick={() => deleteRelease(index)}
                      data-cy="DeleteRelease"
                    />
                  </StyledTableCell>
                </TableRow>
              );
            })}
            <StyledTableCell
              className={
                releases.length > 0 ? classes.headerRow : classes.field
              }
              colSpan={4}
              align="center"
            >
              <TextField
                InputProps={{ className: classes.releaseField }}
                InputLabelProps={{ className: classes.releaseField }}
                onChange={handleReleaseChange}
                label="Label"
                id="label"
                value={label}
                data-cy="ReleaseLabelField"
              />
              <TextField
                InputProps={{ className: classes.releaseField }}
                InputLabelProps={{ className: classes.releaseField }}
                select
                label="Format"
                id="format"
                value={format}
                onChange={handleReleaseChange}
                helperText="Please select your format"
                disabled //TODO: Re-enable after material-ui issue is fixed
              >
                {formats.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                InputProps={{ className: classes.releaseField }}
                InputLabelProps={{ className: classes.releaseField }}
                onChange={handleReleaseChange}
                id="notes"
                label="Notes"
                value={releaseNotes}
                data-cy="ReleaseNotesField"
              />
              <Button
                className={classes.addButton}
                onClick={() =>
                  addRelease({ label, format, notes: releaseNotes })
                }
                variant="contained"
                disabled={!label && !releaseNotes}
                data-cy="AddReleaseButton"
              >
                <AddCircle />
              </Button>
            </StyledTableCell>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );

  function addRelease({ label, format, notes }: Release) {
    handleAddRelease({ label, format, notes });
    setLabel('');
    setFormat('blu-ray');
    setReleaseNotes('');
  }

  function handleReleaseChange(event: React.ChangeEvent<HTMLInputElement>) {
    switch (event.target.id) {
      case 'label':
        setLabel(event.target.value);
        break;
      case 'format':
        setFormat(event.target.value);
        break;
      case 'notes':
        setReleaseNotes(event.target.value);
        break;
    }
  }
}

const useStyles = makeStyles(() => ({
  headerRow: {
    backgroundColor: colors.tableHeaderRowBackground,
  },
  addButton: {
    margin: 10,
  },
  table: {
    backgroundColor: colors.tableBackground,
    width: '50%',
    marginTop: 10,
    border: '2px solid white',
    marginBottom: 10,
  },
  releaseField: {
    color: 'white',
    marginRight: 10,
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginRight: 10,
  },
  field: {
    color: 'white',
  },
  wrapper: {
    display: 'flex',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
