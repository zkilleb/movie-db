import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Tooltip,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  TableRow,
  TableHead,
  TableContainer,
  TableBody,
  Table,
  Paper,
} from '@material-ui/core';
import { Add, Delete } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { Result, Validation } from '../classes';
import { addRelease, deleteRelease } from '../handlers';
import { Notification, StyledTableCell, StyledTableHeaderCell } from '.';

export function Releases({ data }: { data: Result }) {
  const classes = useStyles();
  const history = useHistory();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [label, setLabel] = React.useState<string>();
  const [format, setFormat] = React.useState<string>(formats[0].value);
  const [notes, setNotes] = React.useState<string>();
  const [validation, setValidation] = React.useState<Validation | undefined>();
  const [deleteIndex, setDeleteIndex] = React.useState<number>();
  const [open, setOpen] = React.useState(false);

  return (
    <div className={classes.releases}>
      {validation && open && (
        <Notification
          message={validation.message}
          severity={validation.severity}
          open={open}
          handleClose={handleClose}
        />
      )}

      <Dialog
        open={deleteDialogOpen}
        PaperProps={{
          style: {
            backgroundColor: '#456',
            color: 'white',
            width: '50%',
            height: '15%',
          },
        }}
      >
        <DialogContent>
          Are you sure you want to delete this release?
        </DialogContent>

        <DialogActions>
          <Button
            className={classes.dialogButtons}
            onClick={() => handleDeleteModal()}
          >
            No
          </Button>
          <Button
            className={classes.dialogButtons}
            onClick={() => handleDelete()}
            data-cy="ConfirmDelete"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        data-cy="ReleaseDialog"
        fullWidth
        maxWidth="xl"
        open={dialogOpen}
        PaperProps={{
          style: {
            backgroundColor: '#456',
            color: 'white',
            width: '35%',
            height: '25%',
          },
        }}
      >
        <DialogTitle>Add a release for {data.title}</DialogTitle>
        <DialogContent>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              InputProps={{ className: classes.field }}
              InputLabelProps={{ className: classes.field }}
              label="Label"
              id="label"
              value={label}
              onChange={handleChange}
              data-cy="ReleaseLabel"
            />
            <TextField
              InputProps={{ className: classes.field }}
              InputLabelProps={{ className: classes.field }}
              select
              label="Format"
              id="format"
              value={format}
              onChange={handleChange}
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
              InputProps={{ className: classes.field }}
              InputLabelProps={{ className: classes.field }}
              label="Notes"
              id="notes"
              value={notes}
              onChange={handleChange}
              data-cy="ReleaseNotes"
            />
          </form>
        </DialogContent>

        <DialogActions>
          <Button className={classes.field} onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            className={classes.field}
            onClick={handleAddRelease}
            data-cy="ConfirmAddReleaseButton"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer className={classes.table} component={Paper}>
        <Table aria-label="simple table">
          <TableHead data-cy="ReleasesHeaderRow">
            <TableRow className={classes.headerRow}>
              <StyledTableHeaderCell colSpan={4} align="center">
                <div className={classes.header}>
                  Releases:
                  <Tooltip title={'Add Release'}>
                    <Add
                      className={classes.addButton}
                      onClick={handleClick}
                      data-cy="AddReleaseButton"
                    />
                  </Tooltip>
                </div>
              </StyledTableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.releases.map((release, index) => {
              return (
                <TableRow key={index} data-cy="ReleaseResultRow">
                  <StyledTableCell>{release.label}</StyledTableCell>
                  <StyledTableCell>{release.format}</StyledTableCell>
                  <StyledTableCell>{release.notes}</StyledTableCell>
                  <StyledTableCell>
                    <Delete
                      onClick={() => handleDeleteModal(index)}
                      data-cy="DeleteRelease"
                    />
                  </StyledTableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );

  function handleClick() {
    setDialogOpen(true);
  }

  function handleDeleteModal(index?: number) {
    setDeleteDialogOpen(!deleteDialogOpen);
    setDeleteIndex(index);
  }

  async function handleDelete() {
    try {
      const result = await deleteRelease({
        ...data,
        index: deleteIndex,
      });
      if (result.status === 200) {
        setDeleteDialogOpen(false);
        setLabel('');
        setNotes('');
        history.push({
          pathname: '/detail',
          state: {
            id: data._id,
            reviewLoaded: true,
          },
        });
      }
    } catch (e: any) {
      setValidation({ message: e.response.data.message, severity: 'error' });
      setOpen(true);
    }
  }

  function handleCancel() {
    setDialogOpen(false);
    setLabel('');
    setNotes('');
  }

  async function handleAddRelease() {
    try {
      const result = await addRelease({
        ...data,
        format,
        label,
        releaseNotes: notes,
      });
      if (result.status === 200) {
        setDialogOpen(false);
        setLabel('');
        setNotes('');
        history.push({
          pathname: '/detail',
          state: {
            id: data._id,
            reviewLoaded: true,
          },
        });
      }
    } catch (e: any) {
      setValidation({ message: e.response.data.message, severity: 'error' });
      setOpen(true);
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValidation(undefined);
    switch (event.target.id) {
      case 'label':
        setLabel(event.target.value);
        break;
      case 'format':
        setFormat(event.target.value);
        break;
      case 'notes':
        setNotes(event.target.value);
        break;
    }
  }

  function handleClose() {
    setOpen(false);
  }
}

const formats = [
  {
    label: 'Blu-ray',
    value: 'blu-ray',
  },
  {
    label: 'DVD',
    value: 'dvd',
  },
  {
    label: 'VHS',
    value: 'vhs',
  },
  {
    label: '4K Ultra HD',
    value: '4k',
  },
  {
    label: 'Betamax',
    value: 'betamax',
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'white',
    },
  },
  releases: {
    marginLeft: 'auto',
    marginRight: 10,
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginRight: 10,
  },
  addButton: {
    marginLeft: 10,
  },
  field: {
    color: 'white',
  },
  release: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  dialogButtons: {
    color: 'white',
  },
  headerRow: {
    backgroundColor: '#14181c',
  },
  table: {
    backgroundColor: '#456',
  },
}));
