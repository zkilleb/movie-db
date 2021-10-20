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
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { addMovie } from "../handlers";

export function AddForm() {
  const classes = useStyles();
  const [title, setTitle] = React.useState<string>();
  const [format, setFormat] = React.useState<string>(formats[0].value);
  const [length, setLength] = React.useState<number>();
  const [year, setYear] = React.useState<number>();
  const [color, setColor] = React.useState<boolean>(true);
  const [language, setLanguage] = React.useState<string>();
  const [director, setDirector] = React.useState<string>();
  const [label, setLabel] = React.useState<string>();
  const [actors, setActors] = React.useState<string[]>([]);
  const [addActor, setAddActor] = React.useState<string | null>();
  const [notes, setNotes] = React.useState<string>();

  return (
    <div>
      <Paper elevation={1} className={classes.paper}>
        <form className={classes.root} noValidate autoComplete="off">
          <TextField
            InputProps={{ className: classes.field }}
            InputLabelProps={{ className: classes.field }}
            label="Title"
            id="title"
            value={title}
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
            label="Runtime"
            id="length"
            value={length}
            onChange={handleChange}
            helperText="In minutes"
          />
          <TextField
            InputProps={{ className: classes.field }}
            InputLabelProps={{ className: classes.field }}
            label="Release Year"
            id="year"
            value={year}
            onChange={handleChange}
            placeholder="YYYY"
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
          />
          <TextField
            InputProps={{ className: classes.field }}
            InputLabelProps={{ className: classes.field }}
            label="Director"
            id="director"
            value={director}
            onChange={handleChange}
          />
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
            label="Notes"
            id="notes"
            value={notes}
            onChange={handleChange}
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
                  <TableRow key={actor}>
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
          />
          <Button
            className={classes.addButton}
            onClick={handleAddActor}
            variant="contained"
          >
            <AddCircleIcon />
          </Button>
        </form>
        <Button
          className={classes.submit}
          onClick={handleSubmit}
          variant="contained"
        >
          Submit
        </Button>
      </Paper>
    </div>
  );

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    switch (event.target.id) {
      case "title":
        setTitle(event.target.value);
        break;
      case "format":
        setFormat(event.target.value);
        break;
      case "length":
        setLength(parseInt(event.target.value));
        break;
      case "year":
        setYear(parseInt(event.target.value));
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
    setAddActor(undefined);
  }

  function handleNameField(event: React.ChangeEvent<HTMLInputElement>) {
    setAddActor(event.target.value);
  }

  async function handleSubmit() {
    await addMovie({
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
