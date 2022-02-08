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
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { Result, Validation } from '../classes';
import { addRelease } from '../handlers';
import { Notification } from '.';

export function Releases({ data }: { data: Result }) {
  const classes = useStyles();
  const history = useHistory();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [label, setLabel] = React.useState<string>();
  const [format, setFormat] = React.useState<string>(formats[0].value);
  const [notes, setNotes] = React.useState<string>();
  const [validation, setValidation] = React.useState<Validation | undefined>();
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
            />
          </form>
        </DialogContent>

        <DialogActions>
          <Button className={classes.field} onClick={handleCancel}>
            Cancel
          </Button>
          <Button className={classes.field} onClick={handleAddRelease}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <div className={classes.header}>
        Releases:
        <Tooltip title={'Add Release'}>
          <Add className={classes.addButton} onClick={handleClick} />
        </Tooltip>
      </div>
      {data.releases &&
        data.releases.map((release) => {
          return (
            <li key={JSON.stringify(release)}>
              {release.label} {release.format} {release.notes}
            </li>
          );
        })}
    </div>
  );

  function handleClick() {
    setDialogOpen(true);
  }

  function handleCancel() {
    setDialogOpen(false);
    setLabel('');
    setNotes('');
  }

  async function handleAddRelease() {
    try {
      const result = await addRelease({
        title: data.title,
        format,
        length: data.length,
        year: data.year,
        color: data.color,
        language: data.language,
        studio: data.studio,
        director: data.director,
        label,
        actors: data.actors,
        notes: data.notes,
        releaseNotes: notes,
        releases: data.releases,
        _id: data._id,
      });
      if (result.status === 200) {
        setDialogOpen(false);
        setLabel('');
        setNotes('');
        history.push({
          pathname: '/detail',
          state: {
            id: data._id,
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
}));
