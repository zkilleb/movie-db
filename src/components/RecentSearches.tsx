import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { Search } from '../classes';

export function RecentSearches({
  recentSearches,
}: {
  recentSearches: Search[];
}) {
  const classes = useStyles();

  return (
    <div>
      <span className={classes.header}>Recent Searches:</span>
      {recentSearches.map((search: Search) => (
        <Link
          key={search.params}
          className={classes.searches}
          to={search.path && `${search.path}${search.params}`}
        >
          <div>{parseSearch(search.params)}</div>
        </Link>
      ))}
    </div>
  );

  function parseSearch(search: string) {
    const urlParams = new URLSearchParams(search);
    return `${urlParams.get('type')}: ${urlParams.get('title')}`;
  }
}

const useStyles = makeStyles(() => ({
  searches: {
    textDecoration: 'none',
    color: 'white',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 20,
  },
}));
