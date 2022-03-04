import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import { colors } from '../constants';
import { ByFormat, ByLabel } from '../components/Stats';

export function Stats() {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.header}>Statistics</div>
      <Paper elevation={1} className={classes.paper}>
        <ByLabel />
        <ByFormat />
      </Paper>
    </div>
  );
}

const useStyles = makeStyles(() => ({
  paper: {
    backgroundColor: colors.tableBackground,
    width: '90%',
    height: 500,
    margin: 'auto',
    marginTop: 25,
    borderRadius: '10px 10px 10px 10px',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
  },
  header: {
    color: 'white',
    fontSize: 30,
  },
}));
