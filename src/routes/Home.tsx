import { Random } from '../components';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';

export function Home() {
  const classes = useStyles();

  return (
    <div>
      <Paper elevation={1} className={classes.paper}>
        Home Page
        <Random />
      </Paper>
    </div>
  );
}

const useStyles = makeStyles(() => ({
  paper: {
    backgroundColor: '#456',
    width: '90%',
    height: 500,
    margin: 'auto',
    marginTop: 25,
    borderRadius: '10px 10px 10px 10px',
    color: 'white',
  },
}));
