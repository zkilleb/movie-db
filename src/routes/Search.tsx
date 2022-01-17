import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { searchMovie, getTMDBKeyword } from "../handlers";
import { Result } from "../classes";
import { SearchResult } from "../components";

export function Search() {
  const classes = useStyles();
  const [urlParams, setUrlParams] = React.useState<string>();
  const [searchResults, setSearchResults] = React.useState<Result[]>();
  const [keywordResults, setKeywordResults] = React.useState<[]>();

  const params = new URLSearchParams(window.location.search);
  const title = params.get("title");

  React.useEffect(() => {
    if (title) {
      setUrlParams(decodeURI(title));
      async function fetchData() {
        const tmdbResults = await getTMDBKeyword(title);
        const results = await searchMovie(title);
        if (results) setSearchResults(results);
        if (tmdbResults) setKeywordResults(tmdbResults);
      }
      fetchData();
    }
  }, [title]);

  return (
    <div data-cy="SearchResultPage">
      <div className={classes.results}>
        Results for {urlParams}: {searchResults && searchResults.length}
      </div>
      {!searchResults ||
        (searchResults && searchResults.length === 0 && (
          <div className={classes.linkWrapper}>
            <Link to="/add" className={classes.link}>
              <Button variant="contained">Add Movie</Button>
            </Link>
          </div>
        ))}
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
    color: "white",
    fontSize: 20,
  },
  link: {
    paddingLeft: 10,
    paddingRight: 10,
    fontFamily: "Graphik-Semibold-Web,sans-serif",
    fontWeight: "bold",
    textDecoration: "none",
    color: "white",
  },
  linkWrapper: {
    marginTop: 20,
  },
}));
