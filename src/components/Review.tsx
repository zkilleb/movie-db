import { makeStyles } from '@material-ui/core/styles';
import { Rating } from '@material-ui/lab';
import { Link } from 'react-router-dom';

export function Review({
  writer,
  stars,
  url,
}: {
  writer: string;
  stars: number;
  url: string;
}) {
  const classes = useStyles();

  return (
    <div className={classes.review} data-cy="Review">
      <div>
        <Link className={classes.link} to={url}>
          Review By {writer}:{' '}
          <Rating className={classes.rating} value={stars} max={4} disabled />
        </Link>
      </div>
    </div>
  );
}

const useStyles = makeStyles(() => ({
  review: {
    marginLeft: 'auto',
    marginRight: 10,
  },
  link: {
    textDecoration: 'none',
    color: 'white',
  },
  rating: {
    marginTop: 5,
  },
}));
