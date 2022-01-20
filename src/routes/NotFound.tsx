import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

export function NotFound() {
  const classes = useStyles();

  return (
    <div>
      <div>Page Not Found</div>
      <Link className={classes.link} to="/">
        Return Home
      </Link>
    </div>
  );
}

const useStyles = makeStyles(() => ({
  link: {
    paddingLeft: 10,
    fontFamily: 'Graphik-Semibold-Web,sans-serif',
    fontWeight: 'bold',
    textDecoration: 'none',
    color: 'white',
  },
}));
