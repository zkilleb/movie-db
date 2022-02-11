import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

export function NotFound() {
  const classes = useStyles();

  return (
    <div data-cy="NotFound">
      <div className={classes.header}>Page Not Found</div>
      <Link className={classes.link} to="/">
        Return Home
      </Link>
    </div>
  );
}

const useStyles = makeStyles(() => ({
  header: {
    color: 'white',
    fontSize: 30,
  },
  link: {
    paddingLeft: 10,
    textDecoration: 'none',
    color: 'white',
  },
}));
