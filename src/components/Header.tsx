import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link, useLocation } from 'react-router-dom';
import { Search } from '.';
import {
  headerLinkStyle,
  headerCurrentLinkStyle,
  headerStyle,
  headerSearchStyle,
} from '../styles';

export function Header({
  callback,
}: {
  callback: (location: string, search: string) => void;
}) {
  const classes = useStyles();
  const location = useLocation();
  const { state } = location as ISearchHistory;

  React.useEffect(() => {
    if (location.pathname === '/search') {
      callback(location.pathname, state.search);
    }
  }, [location, state, callback]);

  return (
    <div className={classes.headerStyle} data-cy="Header">
      <Link
        to="/"
        className={`${classes.headerLinkStyle} ${
          location.pathname === '/' && classes.headerCurrentLinkStyle
        }`}
      >
        Home
      </Link>
      <Link
        to="/all-movies"
        className={`${classes.headerLinkStyle} ${
          location.pathname === '/all-movies' && classes.headerCurrentLinkStyle
        }`}
      >
        All Movies
      </Link>
      <Link
        to="/all-releases"
        className={`${classes.headerLinkStyle} ${
          location.pathname === '/all-releases' &&
          classes.headerCurrentLinkStyle
        }`}
      >
        All Releases
      </Link>
      <Link
        to="/add"
        className={`${classes.headerLinkStyle} ${
          location.pathname === '/add' && classes.headerCurrentLinkStyle
        }`}
      >
        Add Movie
      </Link>
      <Link
        to="/stats"
        className={`${classes.headerLinkStyle} ${
          location.pathname === '/stats' && classes.headerCurrentLinkStyle
        }`}
      >
        Stats
      </Link>
      <div className={classes.headerSearchStyle}>
        <Search />
      </div>
    </div>
  );
}

const useStyles = makeStyles(() => ({
  headerStyle,
  headerLinkStyle,
  headerSearchStyle,
  headerCurrentLinkStyle,
}));

interface ISearchHistory {
  state: {
    search: string;
  };
}
