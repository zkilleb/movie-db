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
  FormControlLabel,
  Checkbox,
  TextField,
  MenuItem,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { Delete, AddCircle } from '@material-ui/icons';
import { Release, Result, Validation } from '../classes';
import { addMovie, editMovie } from '../handlers';
import { colors, formats } from '../constants';
import { Notification, StyledTableCell, StyledTableHeaderCell } from '.';

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
  const [addActor, setAddActor] = React.useState<string>('');
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
  const [label, setLabel] = React.useState<string>();
  const [format, setFormat] = React.useState<string>(formats[0].value);
  const [releaseNotes, setReleaseNotes] = React.useState<string>();

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
            className={`${classes.field} ${classes.checkbox}`}
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
            label="Genre"
            id="genre"
            value={genre}
            onChange={handleChange}
            data-cy="GenreField"
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
                        onChange={(value) =>
                          handleAddedActorChange(value, index)
                        }
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
                  className={
                    actors.length > 0 ? classes.headerRow : classes.field
                  }
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
                    onClick={handleAddActor}
                    variant="contained"
                    data-cy="AddActorButton"
                  >
                    <AddCircle />
                  </Button>
                </StyledTableCell>
              </TableBody>
            </Table>
          </TableContainer>
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
                  />
                  <Button
                    className={classes.addButton}
                    onClick={handleAddRelease}
                    variant="contained"
                  >
                    <AddCircle />
                  </Button>
                </StyledTableCell>
              </TableBody>
            </Table>
          </TableContainer>
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
    history.goBack();
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

  function handleAddRelease() {
    if (format || releaseNotes || label)
      setReleases([...releases, { format, notes: releaseNotes, label }]);
    setLabel('');
    setFormat('blu-ray');
    setReleaseNotes('');
  }

  function handleAddedActorChange(event: any, index: number) {
    const tempActors = [...actors];
    tempActors[index] = event.target.value;
    setActors(tempActors);
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

  function deleteRelease(index: number) {
    let tempReleases = [...releases];
    tempReleases.splice(index, 1);
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
            genre,
            releases,
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
    marginTop: 20,
  },
  table: {
    backgroundColor: colors.tableBackground,
    width: '50%',
    marginTop: 10,
    margin: 'auto',
    border: '2px solid white',
    marginBottom: 10,
  },
  addButton: {
    margin: 10,
  },
  field: {
    color: 'white',
  },
  releaseField: {
    color: 'white',
    marginRight: 10,
  },
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
  headerRow: {
    backgroundColor: colors.tableHeaderRowBackground,
  },
  cancel: {
    marginRight: 10,
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginRight: 10,
  },
}));

interface IAddForm {
  data?: Result;
}
