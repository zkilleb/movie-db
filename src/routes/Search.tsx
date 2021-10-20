import React from "react";
import { searchMovie } from "../handlers";
import { ISearch } from "../classes";

export function Search() {
  const [urlParams, setUrlParams] = React.useState<string>();
  const [searchResults, setSearchResults] = React.useState<ISearch[]>();

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const title = params.get("title");
    if (title) {
      setUrlParams(decodeURI(title));
      async function fetchData() {
        const results = await searchMovie(title);
        if (results) setSearchResults(results);
      }
      fetchData();
    }
  }, []);

  return (
    <div>
      <div>Results for: {urlParams}</div>
      <div>
        {searchResults &&
          searchResults.map((result) => {
            return (
              <div>
                {result.title} {result.year}
              </div>
            );
          })}
      </div>
    </div>
  );
}
