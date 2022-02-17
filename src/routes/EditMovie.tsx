import { makeStyles } from '@material-ui/core/styles';
import { AddForm } from '../components';
import { Result } from '../classes';

export function EditMovie(props: IEditProps) {
  const classes = useStyles();
  const data: Result = props.location.state.details;

  return (
    <div>
      <span className={classes.header}>Edit Movie</span>
      <AddForm data={data} />
    </div>
  );
}

interface IEditProps {
  location: {
    state: {
      details: Result;
    };
  };
}

const useStyles = makeStyles(() => ({
  header: {
    color: 'white',
    fontSize: 30,
  },
}));
