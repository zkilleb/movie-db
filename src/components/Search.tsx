import React, { KeyboardEvent } from "react";
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
      <Tooltip title={validation}>
        <TextField
          InputProps={{ className: classes.field }}
          InputLabelProps={{ className: classes.field }}
          className={classes.root}
          label="Search"
          value={title}
          onChange={handleSearchChange}
          onKeyPress={(e) => handleKeyPress(e)}
          data-cy="SearchTextField"
        />
      </Tooltip>
      <Tooltip title={validation}>
        <Icon
          className={classes.searchIcon}
          onClick={handleSearchClick}
          data-cy="SearchFieldButton"
        >
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

  function handleKeyPress(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter") {
      handleSearchClick();
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
