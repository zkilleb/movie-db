import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { getRandom } from '../handlers';

export function Random() {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <div className={classes.random} data-cy="Random" onClick={handleClick}>
      <Button variant="contained">Find Random Movie</Button>
    </div>
  );

  async function handleClick() {
    const result = await getRandom();
    navigate('/detail', {
      state: {
        id: result._id,
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
