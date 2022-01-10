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
  Tooltip,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { addMovie, editMovie, getTMDBKeyword } from "../handlers";

export function AddForm(data: any) {
  const editResults = data.data;
  const classes = useStyles();
  const history = useHistory();
  const [title, setTitle] = React.useState<string>(
    editResults && editResults.title ? editResults.title : null
  );
  const [format, setFormat] = React.useState<string>(formats[0].value);
  const [length, setLength] = React.useState<string>(
    editResults && editResults.length ? editResults.length : null
  );
  const [year, setYear] = React.useState<string>(
    editResults && editResults.year ? editResults.year : null
  );
  const [color, setColor] = React.useState<boolean>(
    editResults && editResults.color ? editResults.color : true
  );
  const [language, setLanguage] = React.useState<string>(
    editResults && editResults.language ? editResults.language : null
  );
  const [director, setDirector] = React.useState<string>(
    editResults && editResults.director ? editResults.director : null
  );
  const [label, setLabel] = React.useState<string>(
    editResults && editResults.label ? editResults.label : null
  );
  const [actors, setActors] = React.useState<string[]>(
    editResults && editResults.actors ? editResults.actors : []
  );
  const [addActor, setAddActor] = React.useState<string>();
  const [notes, setNotes] = React.useState<string>(
    editResults && editResults.notes ? editResults.notes : null
  );
  const [validation, setValidation] = React.useState("");
  const [test, setTest] = React.useState();

  React.useEffect(() => {
    const minYear = year ? parseInt(year) - 1 : 0;
    const maxYear = year ? parseInt(year) + 1 : 0;
    if (title) {
      async function fetchData() {
        const tmdbResults = await getTMDBKeyword(title);
        if (tmdbResults) {
          const result: any = tmdbResults.find(
            (movie: any) =>
              movie.title.toLowerCase() === title.toLowerCase() &&
              movie.release_date.substring(0, 4) >= minYear &&
              movie.release_date.substring(0, 4) <= maxYear
          );
          setTest(result);
        }
      }
      fetchData();
    }
  }, [title, year]);

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
        <Tooltip title={validation}>
          <Button
            className={classes.submit}
            onClick={handleSubmit}
            variant="contained"
          >
            Submit
          </Button>
        </Tooltip>
      </Paper>
    </div>
  );

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValidation("");
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

  async function handleSubmit() {
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
        window.location.reload();
      } else setValidation("Error adding record to database");
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
            keyword: test,
          },
        });
      } else setValidation("Error editing record in database");
    }
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
