import React from "react";
import { makeStyles } from "@material-ui/core/styles";
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
  MenuItem,
  TextField,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { Result, Validation } from "../classes";
import { addMovie, editMovie } from "../handlers";
import { Notification } from ".";
import { filterTMDBResult } from "../util";

export function AddForm(data: IAddForm) {
  const editResults = data.data;
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState<string | null>(
    editResults && editResults.title ? editResults.title : null
  );
  const [format, setFormat] = React.useState<string>(formats[0].value);
  const [length, setLength] = React.useState<string | null>(
    editResults && editResults.length ? editResults.length.toString() : null
  );
  const [year, setYear] = React.useState<string | null>(
    editResults && editResults.year ? editResults.year.toString() : null
  );
  const [color, setColor] = React.useState<boolean>(
    editResults && editResults.color ? editResults.color : true
  );
  const [language, setLanguage] = React.useState<string | null>(
    editResults && editResults.language ? editResults.language : null
  );
  const [director, setDirector] = React.useState<string | null>(
    editResults && editResults.director ? editResults.director : null
  );
  const [label, setLabel] = React.useState<string | null>(
    editResults && editResults.label ? editResults.label : null
  );
  const [actors, setActors] = React.useState<string[]>(
    editResults && editResults.actors ? editResults.actors : []
  );
  const [addActor, setAddActor] = React.useState<string>();
  const [notes, setNotes] = React.useState<string | null>(
    editResults && editResults.notes ? editResults.notes : null
  );
  const [validation, setValidation] = React.useState<Validation | undefined>();
  const [keyword, setKeyword] = React.useState();

  React.useEffect(() => {
    async function fetchData() {
      const result = await filterTMDBResult(year, title);
      setKeyword(result);
    }
    fetchData();
  }, [title, year]);

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
                style={{ color: "#00b020" }}
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
            label="Label"
            id="label"
            value={label}
            onChange={handleChange}
            data-cy="LabelField"
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
                  <TableCell>Actor Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {actors.map((actor) => (
                  <TableRow data-cy="AddActorRow" key={actor}>
                    <TableCell align="center">{actor}</TableCell>
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
      case "title":
        setTitle(event.target.value);
        break;
      case "format":
        setFormat(event.target.value);
        break;
      case "length":
        setLength(event.target.value.replace(/[^0-9]/g, ""));
        break;
      case "year":
        setYear(event.target.value.replace(/[^0-9]/g, ""));
        break;
      case "color":
        setColor(event.target.checked);
        break;
      case "language":
        setLanguage(event.target.value);
        break;
      case "director":
        setDirector(event.target.value);
        break;
      case "label":
        setLabel(event.target.value);
        break;
      case "notes":
        setNotes(event.target.value);
        break;
    }
  }

  function handleAddActor() {
    if (addActor) setActors([...actors, addActor]);
    setAddActor("");
  }

  function handleNameField(event: React.ChangeEvent<HTMLInputElement>) {
    setAddActor(event.target.value);
  }

  function handleClose() {
    setOpen(false);
  }

  async function handleSubmit() {
    if (title) {
      try {
        if (!editResults) {
          const results = await addMovie({
            title,
            format,
            length,
            year,
            color,
            language,
            director,
            label,
            actors,
            notes,
          });
          if (results.status === 200) {
            setValidation({
              message: "Record Succesfully Created",
              severity: "success",
            });
            history.push({
              pathname: "/detail",
              state: {
                details: {
                  title,
                  format,
                  length,
                  year,
                  color,
                  language,
                  director,
                  label,
                  actors,
                  notes,
                  _id: results.data.insertedId,
                },
                keyword,
              },
            });
          }
        } else {
          const results = await editMovie({
            title,
            format,
            length,
            year,
            color,
            language,
            director,
            label,
            actors,
            notes,
            id: editResults._id,
          });
          if (results.status === 200) {
            history.push({
              pathname: "/detail",
              state: {
                details: {
                  title,
                  format,
                  length,
                  year,
                  color,
                  language,
                  director,
                  label,
                  actors,
                  notes,
                  _id: editResults._id,
                },
                keyword,
              },
            });
          }
        }
      } catch (e: any) {
        setValidation({ message: e.response.data.message, severity: "error" });
      }
    } else setValidation({ message: "Title is required", severity: "error" });
    setOpen(true);
  }
}

const formats = [
  {
    label: "Blu-ray",
    value: "blu-ray",
  },
  {
    label: "DVD",
    value: "dvd",
  },
  {
    label: "VHS",
    value: "vhs",
  },
  {
    label: "4K Ultra HD",
    value: "4k",
  },
  {
    label: "Betamax",
    value: "betamax",
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
    "& label.Mui-focused": {
      color: "white",
    },
    "& .MuiInput-underline:before": {
      borderBottomColor: "white",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "white",
    },
  },
  checkbox: {
    color: "rgba(85,221,102,.25)",
  },
  table: {
    minWidth: 200,
    maxWidth: 400,
  },
  addButton: {
    margin: 10,
  },
  field: {
    color: "white",
  },
  paper: {
    backgroundColor: "#456",
    width: "90%",
    margin: "auto",
    marginTop: 25,
    borderRadius: "10px 10px 10px 10px",
  },
  addActors: {
    backgroundColor: "white",
    width: "40%",
    marginTop: 10,
    margin: "auto",
  },
  submit: {
    marginBottom: 10,
  },
}));

interface IAddForm {
  data?: Result;
}
