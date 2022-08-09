import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { Result } from '../classes';
import {
  searchResultNoPosterStyle,
  searchResultPosterStyle,
  paperStyle,
  maxSearchResultStyle,
  minSearchResultStyle,
} from '../styles';

export function SearchResult({ data, keywordResults }: IResult) {
  const classes = useStyles();
  const navigate = useNavigate();
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
      (movie: ITMDBResult) =>
        movie.title.toLowerCase() === title.toLowerCase() &&
        parseInt(movie.release_date.substring(0, 4)) >= minYear &&
        parseInt(movie.release_date.substring(0, 4)) <= maxYear,
    );
    setResult(tempResult);
  }, [keywordResults, minYear, maxYear, title]);

  return (
    <Paper
      data-cy="SearchResult"
      elevation={1}
      className={`${classes.paperStyle} ${
        width > 576
          ? classes.maxSearchResultStyle
          : classes.minSearchResultStyle
      }`}
      onClick={handleClick}
    >
      {result ? (
        <img
          className={classes.searchResultPosterStyle}
          src={`https://image.tmdb.org/t/p/original${result.poster_path}`}
          alt={`${data.title} poster`}
          width="106.7"
          height="160"
          data-cy="PosterImage"
        />
      ) : (
        <div className={classes.searchResultNoPosterStyle}>No Poster Found</div>
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
    navigate('/detail', { state: { id: data._id } });
  }
}

const useStyles = makeStyles(() => ({
  paperStyle,
  maxSearchResultStyle,
  minSearchResultStyle,
  searchResultPosterStyle,
  searchResultNoPosterStyle,
}));

interface IResult {
  data: Result;
  keywordResults: [];
}

interface ITMDBResult {
  poster_path: string;
  title: string;
  release_date: string;
}
