import { Result } from "../classes";
import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";

export function SearchResult({ data, keywordResults }: IResult) {
  const classes = useStyles();
  const title = data.title ? data.title : "";
  const actors = data.actors ? data.actors : [];
  const result: any = keywordResults.find(
    (movie: any) =>
      movie.title.toLowerCase() === title.toLowerCase() &&
      movie.release_date.substring(0, 4) === data.year
  );

  return (
    <Paper elevation={1} className={classes.paper}>
      {result ? (
        <img
          className={classes.poster}
          src={`https://image.tmdb.org/t/p/original${result.poster_path}`}
          alt={`${data.title} poster`}
          width="106.7"
          height="160"
        />
      ) : null}
      <div>
        <div>{data.title} </div>
        <div>{data.year}</div>
        <div>Directed By: {data.director}</div>
        <div>Language: {data.language}</div>
        <div>Runtime: {data.length} mins.</div>
        <div>Actors: {actors.toString().replaceAll(',', ", ")}</div>
      </div>
    </Paper>
  );
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
    borderRadius: '10px 10px 10px 10px'
  },
  poster: {
    padding: 10,
  },
}));

interface IResult {
  data: Result;
  keywordResults: [];
}
