import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { getRandom, getTMDBKeyword } from "../handlers";
import { TMDBResult } from "../classes";

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
    const minYear = result.year ? parseInt(result.year) - 1 : 0;
    const maxYear = result.year ? parseInt(result.year) + 1 : 0;
    const tmdbResults = await getTMDBKeyword(result.title);
    let filteredTmdbResult: TMDBResult[] | undefined;
    if (tmdbResults) {
      filteredTmdbResult = tmdbResults.find(
        (movie: TMDBResult) =>
          movie.title.toLowerCase() === result.title.toLowerCase() &&
          parseInt(movie.release_date.substring(0, 4)) >= minYear &&
          parseInt(movie.release_date.substring(0, 4)) <= maxYear
      );
    }
    history.push({
      pathname: "/detail",
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
        keyword: filteredTmdbResult,
      },
    });
  }
}

const useStyles = makeStyles(() => ({
  random: {
    alignItems: "center",
    paddingTop: 65,
  },
}));
