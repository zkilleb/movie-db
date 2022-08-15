import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Rating } from '@material-ui/lab';
import { Link } from 'react-router-dom';
import { addRating } from '../handlers/addRating';

export function Review({
  writer,
  stars,
  url,
  id,
}: {
  writer?: string;
  stars?: number;
  url?: string;
  id?: string;
}) {
  const classes = useStyles();
  const [rating, setRating] = React.useState(stars);

  return (
    <div className={classes.review} data-cy="Review">
      <div>
        {writer && url && stars ? (
          <Link className={classes.link} to={url}>
            Review By {writer}:
            <Rating
              name={'External Review Rating'}
              className={classes.rating}
              value={rating}
              max={4}
              disabled
            />
          </Link>
        ) : (
          <>
            Your Review:
            <Rating
              name={'Personal Review Rating'}
              className={classes.rating}
              value={rating}
              max={5}
              onChange={async (event, newValue) =>
                await handleAddRating(newValue)
              }
            />
          </>
        )}
      </div>
    </div>
  );

  async function handleAddRating(newValue: number | null) {
    if (id && newValue) {
      setRating(newValue);
      addRating({ id, rating: newValue });
    }
  }
}

const useStyles = makeStyles(() => ({
  review: {
    marginLeft: 'auto',
    marginRight: 10,
  },
  link: {
    textDecoration: 'none',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  rating: {
    marginLeft: 2,
  },
}));
