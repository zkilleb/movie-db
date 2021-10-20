import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import { TextField, Icon } from "@material-ui/core";
import { useHistory } from "react-router-dom";

export function Search() {
  const classes = useStyles();
  const history = useHistory();
  const [title, setTitle] = React.useState("");

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
      <Icon className={classes.searchIcon} onClick={handleSearchClick}>
        <SearchIcon />
      </Icon>
    </div>
  );

  function handleSearchClick() {
    if (title.length) {
      history.push({
        pathname: "/search",
        search: `?title=${title}`,
      });
      setTitle("");
    }
  }

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
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
  closeIcon: {
    display: "inline-block",
    marginTop: 15,
    marginRight: 10,
  },
}));
