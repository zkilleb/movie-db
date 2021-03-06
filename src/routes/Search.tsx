import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { Link, useLocation } from 'react-router-dom';
import {
  searchMovie,
  getTMDBKeyword,
  searchDirector,
  searchActor,
} from '../handlers';
import { Result } from '../classes';
import { SearchResult } from '../components';

export function Search() {
  const classes = useStyles();
  const location = useLocation();
  const { state } = location as ISearchTerm;

  const [urlParams, setUrlParams] = React.useState<string>();
  const [searchResults, setSearchResults] = React.useState<Result[]>();
  const [keywordResults, setKeywordResults] = React.useState<[]>();

  const params = new URLSearchParams(state.search);
  const title = params.get('title');
  const type = params.get('type');

  React.useEffect(() => {
    if (title) {
      setUrlParams(decodeURI(title));
      async function fetchData() {
        const tmdbResults = await getTMDBKeyword(title, type);
        let results;
        switch (type) {
          case 'title':
            results = await searchMovie(title);
            break;
          case 'director':
            results = await searchDirector(title);
            break;
          case 'actor':
            results = await searchActor(title);
            break;
          default:
            break;
        }
        if (results) setSearchResults(results);
        if (tmdbResults) setKeywordResults(tmdbResults);
      }
      fetchData();
    }
  }, [title, type]);

  return (
    <div data-cy="SearchResultPage">
      <div className={classes.results}>
        Results for {urlParams}: {searchResults ? searchResults.length : '0'}
      </div>
      {(!searchResults || (searchResults && searchResults.length === 0)) && (
        <div className={classes.linkWrapper}>
          <Link to="/add" className={classes.link}>
            <Button data-cy="AddMovieButton" variant="contained">
              Add Movie
            </Button>
          </Link>
          <Link to="/all-movies" className={classes.link}>
            <Button data-cy="ViewAllButton" variant="contained">
              View All Movies
            </Button>
          </Link>
        </div>
      )}
      <div>
        {searchResults &&
          searchResults.map((result, index) => {
            return (
              <SearchResult
                key={index}
                data={result}
                keywordResults={keywordResults ? keywordResults : []}
              />
            );
          })}
      </div>
    </div>
  );
}

const useStyles = makeStyles(() => ({
  results: {
    color: 'white',
    fontSize: 20,
  },
  link: {
    paddingLeft: 10,
    paddingRight: 10,
    fontFamily: 'Graphik-Semibold-Web,sans-serif',
    fontWeight: 'bold',
    textDecoration: 'none',
    color: 'white',
  },
  linkWrapper: {
    marginTop: 20,
  },
}));

interface ISearchTerm {
  state: {
    search: string;
  };
}
