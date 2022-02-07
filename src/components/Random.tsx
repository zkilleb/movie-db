import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { getRandom } from '../handlers';

export function Random() {
  const classes = useStyles();
  const history = useHistory();

  return (
    <div className={classes.random} data-cy="Random" onClick={handleClick}>
      <Button variant="contained">Find Random Movie</Button>
    </div>
  );

  async function handleClick() {
    const result = await getRandom();
    history.push({
      pathname: '/detail',
      state: {
        details: {
          title: result.title,
          format: result.format,
          length: result.length,
          year: result.year,
          color: result.color,
          language: result.language,
          director: result.director,
          label: result.label,
          actors: result.actors,
          notes: result.notes,
          _id: result._id,
        },
      },
    });
  }
}

const useStyles = makeStyles(() => ({
  random: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 60,
  },
}));
