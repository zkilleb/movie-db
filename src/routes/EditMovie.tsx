import { makeStyles } from '@material-ui/core/styles';
import { useLocation } from 'react-router-dom';
import { AddForm } from '../components';
import { Result } from '../classes';

export function EditMovie() {
  const location = useLocation();
  const { state } = location as IEditProps;
  const classes = useStyles();
  const data: Result = state.details;

  return (
    <div>
      <span className={classes.header}>Edit Movie</span>
      <AddForm data={data} />
    </div>
  );
}

interface IEditProps {
  state: {
    details: Result;
  };
}

const useStyles = makeStyles(() => ({
  header: {
    color: 'white',
    fontSize: 30,
  },
}));
