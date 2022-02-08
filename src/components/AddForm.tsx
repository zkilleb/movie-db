import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Button,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  FormControlLabel,
  Checkbox,
  TextField,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Delete } from '@material-ui/icons';
import { Result, Validation } from '../classes';
import { addMovie, editMovie } from '../handlers';
import { Notification } from '.';

export function AddForm(data: IAddForm) {
  const editResults = data.data;
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState<string>(
    editResults && editResults.title ? editResults.title : '',
  );
  const [length, setLength] = React.useState<string>(
    editResults && editResults.length ? editResults.length.toString() : '',
  );
  const [year, setYear] = React.useState<string>(
    editResults && editResults.year ? editResults.year.toString() : '',
  );
  const [color, setColor] = React.useState<boolean>(
    editResults && editResults.color ? editResults.color : true,
  );
  const [language, setLanguage] = React.useState<string>(
    editResults && editResults.language ? editResults.language : '',
  );
  const [director, setDirector] = React.useState<string>(
    editResults && editResults.director ? editResults.director : '',
  );
  const [studio, setStudio] = React.useState<string>(
    editResults && editResults.studio ? editResults.studio : '',
  );
  const [actors, setActors] = React.useState<string[]>(
    editResults && editResults.actors ? editResults.actors : [],
  );
  const [addActor, setAddActor] = React.useState<string>();
  const [notes, setNotes] = React.useState<string>(
    editResults && editResults.notes ? editResults.notes : '',
  );
  const [validation, setValidation] = React.useState<Validation | undefined>();

  return (
    <div>
      {validation && open && (
        <Notification
          message={validation.message}
          severity={validation.severity}
          open={open}
          handleClose={handleClose}
        />
      )}

      <Paper elevation={1} className={classes.paper}>
        <form className={classes.root} noValidate autoComplete="off">
          <TextField
            InputProps={{ className: classes.field }}
            InputLabelProps={{ className: classes.field }}
            label="Title"
            id="title"
            value={title}
            onChange={handleChange}
            data-cy="TitleField"
          />
          <TextField
            InputProps={{ className: classes.field }}
            InputLabelProps={{ className: classes.field }}
            label="Runtime"
            id="length"
            value={length}
            onChange={handleChange}
            helperText="In minutes"
            data-cy="RuntimeField"
          />
          <TextField
            InputProps={{ className: classes.field }}
            InputLabelProps={{ className: classes.field }}
            label="Release Year"
            id="year"
            value={year}
            onChange={handleChange}
            placeholder="YYYY"
            data-cy="ReleaseYearField"
          />
          <FormControlLabel
            className={classes.field}
            control={
              <Checkbox
                checked={color}
                onChange={handleChange}
                style={{ color: '#00b020' }}
                id="color"
              />
            }
            label="Color"
          />
          <TextField
            InputProps={{ className: classes.field }}
            InputLabelProps={{ className: classes.field }}
            label="Language(s)"
            id="language"
            value={language}
            onChange={handleChange}
            data-cy="LanguageField"
          />
          <TextField
            InputProps={{ className: classes.field }}
            InputLabelProps={{ className: classes.field }}
            label="Director"
            id="director"
            value={director}
            onChange={handleChange}
            data-cy="DirectorField"
          />
          <TextField
            InputProps={{ className: classes.field }}
            InputLabelProps={{ className: classes.field }}
            label="Studio"
            id="studio"
            value={studio}
            onChange={handleChange}
            data-cy="StudioField"
          />
          <TextField
            InputProps={{ className: classes.field }}
            InputLabelProps={{ className: classes.field }}
            label="Notes"
            id="notes"
            value={notes}
            onChange={handleChange}
            data-cy="NotesField"
          />
          <TableContainer component={Paper} className={classes.addActors}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    Actor Name
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {actors.map((actor, index) => (
                  <TableRow data-cy="AddActorRow" key={actor}>
                    <TableCell align="center">{actor}</TableCell>
                    <TableCell align="center">
                      <Delete onClick={() => deleteActor(index)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
            onClick={handleAddActor}
            variant="contained"
            data-cy="AddActorButton"
          >
            <AddCircleIcon />
          </Button>
        </form>
        <Button
          className={classes.submit}
          onClick={handleSubmit}
          variant="contained"
          data-cy="SubmitButton"
        >
          Submit
        </Button>
      </Paper>
    </div>
  );

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValidation(undefined);
    switch (event.target.id) {
      case 'title':
        setTitle(event.target.value);
        break;
      case 'length':
        setLength(event.target.value.replace(/[^0-9]/g, ''));
        break;
      case 'year':
        setYear(event.target.value.replace(/[^0-9]/g, ''));
        break;
      case 'color':
        setColor(event.target.checked);
        break;
      case 'language':
        setLanguage(event.target.value);
        break;
      case 'director':
        setDirector(event.target.value);
        break;
      case 'studio':
        setStudio(event.target.value);
        break;
      case 'notes':
        setNotes(event.target.value);
        break;
    }
  }

  function handleAddActor() {
    if (addActor) setActors([...actors, addActor]);
    setAddActor('');
  }

  function handleNameField(event: React.ChangeEvent<HTMLInputElement>) {
    setAddActor(event.target.value);
  }

  function handleClose() {
    setOpen(false);
  }

  function deleteActor(index: number) {
    let tempActors = [...actors];
    tempActors.splice(index, 1);
    setActors(tempActors);
  }

  async function handleSubmit() {
    if (title && director && year) {
      try {
        if (!editResults) {
          const results = await addMovie({
            title,
            length,
            year,
            color,
            language,
            director,
            studio,
            actors,
            notes,
          });
          if (results.status === 200) {
            setValidation({
              message: 'Record Succesfully Created',
              severity: 'success',
            });
            history.push({
              pathname: '/detail',
              state: {
                id: results.data.insertedId,
              },
            });
          }
        } else {
          const results = await editMovie({
            title,
            length,
            year,
            color,
            language,
            director,
            studio,
            actors,
            notes,
            releases: editResults.releases,
            id: editResults._id,
          });
          if (results.status === 200) {
            history.push({
              pathname: '/detail',
              state: {
                id: editResults._id,
              },
            });
          }
        }
      } catch (e: any) {
        setValidation({ message: e.response.data.message, severity: 'error' });
      }
    } else
      setValidation({
        message: 'Title, director and year are required',
        severity: 'error',
      });
    setOpen(true);
  }
}

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
  checkbox: {
    color: 'rgba(85,221,102,.25)',
  },
  table: {
    minWidth: 200,
    maxWidth: 400,
    margin: 'auto',
  },
  addButton: {
    margin: 10,
  },
  field: {
    color: 'white',
  },
  paper: {
    backgroundColor: '#456',
    width: '90%',
    margin: 'auto',
    marginTop: 25,
    borderRadius: '10px 10px 10px 10px',
  },
  addActors: {
    backgroundColor: 'white',
    width: '25%',
    marginTop: 10,
    margin: 'auto',
  },
  submit: {
    marginBottom: 10,
  },
}));

interface IAddForm {
  data?: Result;
}
