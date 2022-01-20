import React, { KeyboardEvent } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { TextField, Icon, Select, MenuItem } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { Validation } from '../classes';
import { Notification } from '.';

export function Search() {
  const classes = useStyles();
  const history = useHistory();
  const [title, setTitle] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('title');
  const [validation, setValidation] = React.useState<Validation | undefined>();

  const searchTypes = [
    {
      label: 'Title',
      value: 'title',
    },
    {
      label: 'Director',
      value: 'director',
    },
  ];

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
      <Select
        value={search}
        className={classes.searchType}
        onChange={handleChange}
        inputProps={{
          classes: {
            icon: classes.icon,
          },
        }}
      >
        {searchTypes.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
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
      <Icon
        className={classes.searchIcon}
        onClick={handleSearchClick}
        data-cy="SearchFieldButton"
      >
        <SearchIcon />
      </Icon>
    </div>
  );

  function handleSearchClick() {
    if (title.length > 2) {
      history.push({
        pathname: '/search',
        search: `?title=${title}&type=${search}`,
      });
      setTitle('');
    } else {
      setValidation({
        message: 'Search must be at least 3 charactes long',
        severity: 'error',
      });
      setOpen(true);
    }
  }

  function handleChange(event: any) {
    setSearch(event.target.value);
  }

  function handleKeyPress(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter') {
      handleSearchClick();
    }
  }

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValidation(undefined);
    setTitle(event.target.value);
  }

  function handleClose() {
    setOpen(false);
  }
}

const useStyles = makeStyles(() => ({
  root: {
    '& > *': {
      marginTop: 0,
      marginBottom: 10,
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
  field: {
    color: 'white',
  },
  searchIcon: {
    marginTop: 15,
    display: 'inline-block',
  },
  searchType: {
    color: 'white',
    marginRight: 10,
    '&:before': {
      borderColor: 'white',
    },
    '&:after': {
      borderColor: 'white',
    },
  },
  icon: {
    color: 'white',
  },
}));
