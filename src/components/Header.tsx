import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link, useLocation } from 'react-router-dom';
import { Search } from '.';
import { colors } from '../constants';

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
    <div className={classes.header} data-cy="Header">
      <Link
        to="/"
        className={`${classes.link} ${
          location.pathname === '/' && classes.current
        }`}
      >
        Home
      </Link>
      <Link
        to="/all-movies"
        className={`${classes.link} ${
          location.pathname === '/all-movies' && classes.current
        }`}
      >
        All Movies
      </Link>
      <Link
        to="/all-releases"
        className={`${classes.link} ${
          location.pathname === '/all-releases' && classes.current
        }`}
      >
        All Releases
      </Link>
      <Link
        to="/add"
        className={`${classes.link} ${
          location.pathname === '/add' && classes.current
        }`}
      >
        Add Movie
      </Link>
      <Link
        to="/stats"
        className={`${classes.link} ${
          location.pathname === '/stats' && classes.current
        }`}
      >
        Stats
      </Link>
      <div className={classes.search}>
        <Search />
      </div>
    </div>
  );
}

const useStyles = makeStyles(() => ({
  header: {
    width: '100%',
    height: 55,
    backgroundColor: colors.tableHeaderRowBackground,
    display: 'flex',
    alignItems: 'center',
  },
  link: {
    paddingLeft: 10,
    paddingRight: 10,
    fontFamily: 'Graphik-Semibold-Web,sans-serif',
    fontWeight: 'bold',
    textDecoration: 'none',
    color: 'white',
  },
  search: {
    paddingRight: 10,
    color: 'white',
    marginLeft: 'auto',
  },
  current: {
    textDecoration: 'underline',
    textDecorationThickness: 2.5,
    textUnderlineOffset: '.5em',
  },
}));

interface ISearchHistory {
  state: {
    search: string;
  };
}
