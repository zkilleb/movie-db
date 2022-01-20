import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { Search } from '.';

export function Header() {
  const classes = useStyles();

  return (
    <div className={classes.header} data-cy="Header">
      <Link to="/" className={classes.link}>
        Home
      </Link>
      <Link to="/add" className={classes.link}>
        Add Movie
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
    backgroundColor: '#14181c',
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
}));
