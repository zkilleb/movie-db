import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Button,
  FormControlLabel,
  Checkbox,
  TextField,
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Release, Result, Validation } from '../../classes';
import { addMovie, editMovie } from '../../handlers';
import { colors } from '../../constants';
import { Notification } from '..';
import { AddRelease } from './AddRelease';
import { AddActor } from './AddActor';
import { formFieldStyle } from '../../styles';

export function AddForm(data: IAddForm) {
  const editResults = data.data;
  const classes = useStyles();
  const navigate = useNavigate();
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
  const [notes, setNotes] = React.useState<string>(
    editResults && editResults.notes ? editResults.notes : '',
  );
  const [genre, setGenre] = React.useState<string>(
    editResults && editResults.genre ? editResults.genre : '',
  );
  const [validation, setValidation] = React.useState<Validation | undefined>();
  const [releases, setReleases] = React.useState<Release[]>(
    editResults && editResults?.releases ? editResults.releases : [],
  );

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
            InputProps={{ className: classes.formFieldStyle }}
            InputLabelProps={{ className: classes.formFieldStyle }}
            label="Title"
            id="title"
            value={title}
            onChange={handleChange}
            data-cy="TitleField"
          />
          <TextField
            InputProps={{ className: classes.formFieldStyle }}
            InputLabelProps={{ className: classes.formFieldStyle }}
            label="Runtime"
            id="length"
            value={length}
            onChange={handleChange}
            helperText="In minutes"
            data-cy="RuntimeField"
          />
          <TextField
            InputProps={{ className: classes.formFieldStyle }}
            InputLabelProps={{ className: classes.formFieldStyle }}
            label="Release Year"
            id="year"
            value={year}
            onChange={handleChange}
            placeholder="YYYY"
            data-cy="ReleaseYearField"
          />
          <FormControlLabel
            className={`${classes.formFieldStyle} ${classes.checkbox}`}
            control={
              <Checkbox
                checked={color}
                onChange={handleChange}
                style={{ color: colors.checkBoxColor }}
                id="color"
              />
            }
            label="Color"
          />
          <TextField
            InputProps={{ className: classes.formFieldStyle }}
            InputLabelProps={{ className: classes.formFieldStyle }}
            label="Language(s)"
            id="language"
            value={language}
            onChange={handleChange}
            data-cy="LanguageField"
          />
          <TextField
            InputProps={{ className: classes.formFieldStyle }}
            InputLabelProps={{ className: classes.formFieldStyle }}
            label="Director"
            id="director"
            value={director}
            onChange={handleChange}
            data-cy="DirectorField"
          />
          <TextField
            InputProps={{ className: classes.formFieldStyle }}
            InputLabelProps={{ className: classes.formFieldStyle }}
            label="Studio"
            id="studio"
            value={studio}
            onChange={handleChange}
            data-cy="StudioField"
          />
          <TextField
            InputProps={{ className: classes.formFieldStyle }}
            InputLabelProps={{ className: classes.formFieldStyle }}
            label="Genre"
            id="genre"
            value={genre}
            onChange={handleChange}
            data-cy="GenreField"
          />
          <TextField
            InputProps={{ className: classes.formFieldStyle }}
            InputLabelProps={{ className: classes.formFieldStyle }}
            label="Notes"
            id="notes"
            value={notes}
            onChange={handleChange}
            data-cy="NotesField"
          />
          <AddActor
            actors={actors}
            handleAddActor={handleAddActor}
            deleteActor={deleteActor}
            handleAddedActorChange={handleAddedActorChange}
          />
          <AddRelease
            releases={releases}
            handleAddRelease={handleAddRelease}
            deleteRelease={deleteRelease}
            handleAddedReleaseChange={handleAddedReleaseChange}
          />
        </form>
        {window.location.pathname === '/edit' && (
          <Button
            className={`${classes.submit} ${classes.cancel}`}
            onClick={handleCancel}
            variant="contained"
            data-cy="CancelButton"
          >
            Cancel
          </Button>
        )}
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

  function handleCancel() {
    navigate(-1);
  }

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
      case 'genre':
        setGenre(event.target.value);
        break;
      case 'notes':
        setNotes(event.target.value);
        break;
    }
  }

  function handleAddRelease({ label, format, notes }: Release) {
    if (format || notes || label) {
      setReleases([...releases, { format, notes, label, uuid: uuidv4() }]);
    }
  }

  function handleAddedActorChange(event: any, index: number) {
    const tempActors = [...actors];
    tempActors[index] = event.target.value;
    setActors(tempActors);
  }

  function handleAddActor(addActor: string) {
    if (addActor) setActors([...actors, addActor]);
  }

  function handleClose() {
    setOpen(false);
  }

  function deleteActor(index: number) {
    let tempActors = [...actors];
    tempActors.splice(index, 1);
    setActors(tempActors);
  }

  function deleteRelease(index: number) {
    let tempReleases = [...releases];
    tempReleases.splice(index, 1);
    setReleases(tempReleases);
  }

  function handleAddedReleaseChange(value: any, index: number) {
    const tempReleases = [...releases];
    tempReleases[index] = value;
    setReleases(tempReleases);
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
            genre,
            actors,
            notes,
            releases,
          });
          if (results.status === 200) {
            setValidation({
              message: 'Record Succesfully Created',
              severity: 'success',
            });
            navigate('/detail', {
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
            genre,
            releases,
            id: editResults._id,
          });
          if (results.status === 200) {
            navigate('/detail', {
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
    '& label.Mui-focused': formFieldStyle,
    '& .MuiInput-underline:before': {
      borderBottomColor: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'white',
    },
  },
  checkbox: {
    marginTop: 20,
  },
  formFieldStyle,
  paper: {
    backgroundColor: colors.tableBackground,
    width: '90%',
    margin: 'auto',
    marginTop: 25,
    borderRadius: '10px 10px 10px 10px',
  },
  submit: {
    marginBottom: 10,
  },
  cancel: {
    marginRight: 10,
  },
}));

interface IAddForm {
  data?: Result;
}
