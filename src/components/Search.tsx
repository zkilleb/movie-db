import React, { KeyboardEvent } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Search as SearchIcon } from '@material-ui/icons';
import {
  TextField,
  Icon,
  Select,
  MenuItem,
  Menu,
  Button,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { Validation } from '../classes';
import { Notification } from '.';
import { colors } from '../constants';

export function Search() {
  const classes = useStyles();
  const history = useHistory();
  const [title, setTitle] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [minMenuOpen, setMinMenuOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
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
          <SearchIcon onClick={handleMenuClick} />
          <Menu
            open={minMenuOpen}
            anchorEl={anchorEl}
            onClose={handleMenuClose}
            PaperProps={{
              style: {
                backgroundColor: colors.tableBackground,
              },
            }}
          >
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
              className={`${classes.root} ${classes.minField}`}
              label="Search"
              value={title}
              onChange={handleSearchChange}
              onKeyPress={(e) => handleKeyPress(e)}
              data-cy="SearchTextField"
            />
            <Button
              variant="contained"
              className={classes.button}
              onClick={handleSearchClick}
            >
              Search
            </Button>
          </Menu>
        </>
      )}
    </div>
  );

  function handleMenuClick(event: any) {
    setMinMenuOpen(true);
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setMinMenuOpen(false);
  }

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
    setMinMenuOpen(false);
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
  minField: {
    marginLeft: '8%',
    width: '80%',
  },
  minSelect: {
    marginLeft: '8%',
  },
  button: {
    marginLeft: '40%',
  },
}));
