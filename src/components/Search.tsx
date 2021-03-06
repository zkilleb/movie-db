import React, { KeyboardEvent } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Search as SearchIcon } from '@material-ui/icons';
import {
  TextField,
  Icon,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { Validation } from '../classes';
import { Notification } from '.';
import { colors } from '../constants';

export function Search() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [title, setTitle] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [minMenuOpen, setMinMenuOpen] = React.useState(false);
  const [search, setSearch] = React.useState('title');
  const [validation, setValidation] = React.useState<Validation | undefined>();
  const [width, setWidth] = React.useState(window.innerWidth);

  window.addEventListener('resize', () => {
    setWidth(window.innerWidth);
  });

  const searchTypes = [
    {
      label: 'Title',
      value: 'title',
    },
    {
      label: 'Director',
      value: 'director',
    },
    {
      label: 'Actor',
      value: 'actor',
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
      {width > 576 ? (
        <>
          <Select
            data-cy="SearchType"
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
        </>
      ) : (
        <>
          <SearchIcon data-cy="SearchFieldButton" onClick={handleMenuClick} />
          <Dialog
            open={minMenuOpen}
            onClose={handleMenuClose}
            PaperProps={{
              style: {
                backgroundColor: colors.tableBackground,
              },
            }}
          >
            <DialogTitle className={classes.button}>Search</DialogTitle>
            <Select
              data-cy="SearchType"
              value={search}
              className={`${classes.searchType} ${classes.minSelect}`}
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
              className={`${classes.root} ${classes.minSelect}`}
              label="Search"
              value={title}
              onChange={handleSearchChange}
              onKeyPress={(e) => handleKeyPress(e)}
              data-cy="SearchTextField"
            />
            <DialogActions>
              <Button className={classes.button} onClick={handleMenuClose}>
                Cancel
              </Button>
              <Button
                className={classes.button}
                onClick={handleSearchClick}
                data-cy="MinSearchButton"
              >
                Search
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  );

  function handleMenuClick() {
    setMinMenuOpen(true);
  }

  function handleMenuClose() {
    setMinMenuOpen(false);
  }

  function handleSearchClick() {
    if (title.length > 2) {
      navigate('/search', {
        state: { search: `?title=${title}&type=${search}` },
      });
      setTitle('');
      setMinMenuOpen(false);
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
  minSelect: {
    marginLeft: '8%',
    width: '80%',
  },
  button: {
    color: 'white',
  },
}));
