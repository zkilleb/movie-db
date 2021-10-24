import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import { TextField, Icon, Tooltip } from "@material-ui/core";
import { useHistory } from "react-router-dom";

export function Search() {
  const classes = useStyles();
  const history = useHistory();
  const [title, setTitle] = React.useState("");
  const [validation, setValidation] = React.useState("");

  return (
    <div>
      <TextField
        InputProps={{ className: classes.field }}
        InputLabelProps={{ className: classes.field }}
        className={classes.root}
        label="Search"
        value={title}
        onChange={handleSearchChange}
      />
      <Tooltip title={validation}>
        <Icon className={classes.searchIcon} onClick={handleSearchClick}>
          <SearchIcon />
        </Icon>
      </Tooltip>
    </div>
  );

  function handleSearchClick() {
    if (title.length > 2) {
      history.push({
        pathname: "/search",
        search: `?title=${title}`,
      });
      setTitle("");
    } else {
      setValidation("Search must be at least 3 charactes long");
    }
  }

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValidation("");
    setTitle(event.target.value);
  }
}

const useStyles = makeStyles(() => ({
  root: {
    "& > *": {
      marginTop: 0,
      marginBottom: 10,
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
  field: {
    color: "white",
  },
  searchIcon: {
    marginTop: 15,
    display: "inline-block",
  },
}));
