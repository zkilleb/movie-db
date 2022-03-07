import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import { colors } from '../constants';
import { ByColor, ByFormat, ByGenre, ByLabel } from '../components/Stats';

export function Stats() {
  const classes = useStyles();

  return (
    <div data-cy="StatPage">
      <div className={classes.header}>Statistics</div>
      <Paper elevation={1} className={classes.paper}>
        <ByLabel />
        <ByFormat />
        <ByGenre />
        <ByColor />
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
