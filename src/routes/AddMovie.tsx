import { makeStyles } from '@material-ui/core/styles';
import { AddForm } from '../components';

export function AddMovie() {
  const classes = useStyles();

  return (
    <div>
      <span className={classes.header}>Add a Movie</span>
      <AddForm />
    </div>
  );
}

const useStyles = makeStyles(() => ({
  header: {
    color: 'white',
    fontSize: 30,
  },
}));
