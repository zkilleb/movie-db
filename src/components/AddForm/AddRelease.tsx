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
import { v4 as uuidv4 } from 'uuid';
import { Release } from '../../classes';
import { colors, formats } from '../../constants';
import { StyledTableCell, StyledTableHeaderCell } from '..';
import { AddedReleaseCell } from './AddedReleaseCell';

export function AddRelease({
  releases,
  handleAddRelease,
  deleteRelease,
  handleAddedReleaseChange,
}: {
  releases: Release[];
  handleAddRelease: ({ label, format, notes }: Release) => void;
  deleteRelease: (index: number) => void;
  handleAddedReleaseChange: (value: any, index: number) => void;
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
                  <AddedReleaseCell
                    id="label"
                    value={release.label}
                    handleAddedReleaseChange={(value) =>
                      handleInterimAddedReleaseChange(
                        value,
                        release,
                        index,
                        'label',
                      )
                    }
                  />
                  <AddedReleaseCell
                    id="format"
                    value={release.format}
                    handleAddedReleaseChange={(value) =>
                      handleInterimAddedReleaseChange(
                        value,
                        release,
                        index,
                        'format',
                      )
                    }
                  />
                  <AddedReleaseCell
                    id="notes"
                    value={release.notes}
                    handleAddedReleaseChange={(value) =>
                      handleInterimAddedReleaseChange(
                        value,
                        release,
                        index,
                        'notes',
                      )
                    }
                  />
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
                value={format}
                onChange={handleSelectChange}
                helperText="Please select your format"
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
                  addRelease({
                    label,
                    format,
                    notes: releaseNotes,
                    uuid: uuidv4(),
                  })
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

  function handleInterimAddedReleaseChange(
    value: string,
    release: Release,
    index: number,
    id: string,
  ) {
    switch (id) {
      case 'label':
        handleAddedReleaseChange(
          {
            label: value,
            format: release.format,
            notes: release.notes,
          },
          index,
        );
        break;
      case 'format':
        handleAddedReleaseChange(
          {
            label: release.label,
            format: value,
            notes: release.notes,
          },
          index,
        );
        break;
      case 'notes':
        handleAddedReleaseChange(
          {
            label: release.label,
            format: release.format,
            notes: value,
          },
          index,
        );
        break;
    }
  }

  function addRelease({ label, format, notes }: Release) {
    handleAddRelease({ label, format, notes, uuid: uuidv4() });
    setLabel('');
    setFormat('blu-ray');
    setReleaseNotes('');
  }

  function handleReleaseChange(event: React.ChangeEvent<HTMLInputElement>) {
    switch (event.target.id) {
      case 'label':
        setLabel(event.target.value);
        break;
      case 'notes':
        setReleaseNotes(event.target.value);
        break;
    }
  }

  function handleSelectChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFormat(event.target.value);
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
