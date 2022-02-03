import { Random, RecentSearches } from '../components';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import { Search } from '../classes';

export function Home({ recentSearches }: { recentSearches: Search[] }) {
  const classes = useStyles();

  return (
    <div>
      <Paper elevation={1} className={classes.paper}>
        <span className={classes.header}>My Movie Database</span>
        <Random />
        {recentSearches.length > 0 && (
          <RecentSearches recentSearches={recentSearches} />
        )}
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
  header: {
    fontSize: 75,
  },
}));
