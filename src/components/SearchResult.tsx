import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { Result } from '../classes';
import { colors } from '../constants';

export function SearchResult({ data, keywordResults }: IResult) {
  const classes = useStyles();
  const history = useHistory();
  const title = data.title ? data.title : '';
  const actors = data.actors ? data.actors : [];
  // Check for between plus or minus 1 year to account for differences in international release dates
  const minYear = data.year ? data.year - 1 : 0;
  const maxYear = data.year ? data.year + 1 : 0;
  const [result, setResult] = React.useState<ITMDBResult>();
  const [width, setWidth] = React.useState(window.innerWidth);

  window.addEventListener('resize', () => {
    setWidth(window.innerWidth);
  });

  React.useEffect(() => {
    const tempResult = keywordResults.find(
      (movie: any) =>
        movie.title.toLowerCase() === title.toLowerCase() &&
        movie.release_date.substring(0, 4) >= minYear &&
        movie.release_date.substring(0, 4) <= maxYear,
    );
    setResult(tempResult);
  }, [keywordResults, minYear, maxYear, title]);

  return (
    <Paper
      data-cy="SearchResult"
      elevation={1}
      className={`${classes.paper} ${width > 576 ? classes.max : classes.min}`}
      onClick={handleClick}
    >
      {result ? (
        <img
          className={classes.poster}
          src={`https://image.tmdb.org/t/p/original${result.poster_path}`}
          alt={`${data.title} poster`}
          width="106.7"
          height="160"
          data-cy="PosterImage"
        />
      ) : (
        <div className={classes.noPoster}>No Poster Found</div>
      )}
      <div>
        <div>{data.title} </div>
        <div>{data.year}</div>
        <div>Directed By: {data.director}</div>
        <div>Language: {data.language}</div>
        <div>Runtime: {data.length} mins.</div>
        <div>Actors: {actors.toString().replaceAll(',', ', ')}</div>
      </div>
    </Paper>
  );

  function handleClick() {
    history.push({
      pathname: '/detail',
      state: { id: data._id },
    });
  }
}

const useStyles = makeStyles(() => ({
  paper: {
    backgroundColor: colors.tableBackground,
    margin: 'auto',
    marginTop: 25,
    fontSize: 15,
    color: 'white',
    display: 'flex',
    textAlign: 'left',
    borderRadius: '10px 10px 10px 10px',
  },
  max: {
    width: '50%',
  },
  min: {
    width: '75%',
  },
  poster: {
    padding: 10,
  },
  noPoster: {
    width: 106.7,
    height: 160,
    margin: 10,
    textAlign: 'center',
    border: 'solid',
  },
}));

interface IResult {
  data: Result;
  keywordResults: [];
}

interface ITMDBResult {
  poster_path: string;
}
