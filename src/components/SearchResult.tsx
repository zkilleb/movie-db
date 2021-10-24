import { Result } from "../classes";
import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import { useHistory } from "react-router-dom";

export function SearchResult({ data, keywordResults }: IResult) {
  const classes = useStyles();
  const history = useHistory();
  const title = data.title ? data.title : "";
  const actors = data.actors ? data.actors : [];
  // Check for between plus or minus 1 year to account for differences in international release dates
  const minYear = data.year ? data.year - 1 : 0;
  const maxYear = data.year ? data.year + 1 : 0;
  const result: any = keywordResults.find(
    (movie: any) =>
      movie.title.toLowerCase() === title.toLowerCase() &&
      movie.release_date.substring(0, 4) >= minYear &&
      movie.release_date.substring(0, 4) <= maxYear
  );

  return (
    <Paper elevation={1} className={classes.paper} onClick={handleClick}>
      {result ? (
        <img
          className={classes.poster}
          src={`https://image.tmdb.org/t/p/original${result.poster_path}`}
          alt={`${data.title} poster`}
          width="106.7"
          height="160"
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
        <div>Actors: {actors.toString().replaceAll(",", ", ")}</div>
      </div>
    </Paper>
  );

  function handleClick() {
    history.push({
      pathname: "/detail",
      state: { details: data, keyword: result },
    });
  }
}

const useStyles = makeStyles(() => ({
  paper: {
    backgroundColor: "#456",
    width: "50%",
    margin: "auto",
    marginTop: 25,
    fontSize: 15,
    color: "white",
    display: "flex",
    textAlign: "left",
    borderRadius: "10px 10px 10px 10px",
  },
  poster: {
    padding: 10,
  },
  noPoster: {
    width: 106.7,
    height: 160,
    margin: 10,
    textAlign: "center",
    border: "solid",
  },
}));

interface IResult {
  data: Result;
  keywordResults: [];
}
