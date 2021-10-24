import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { Tooltip } from "@material-ui/core";

import { Result } from "../classes";
import { getRecommendations } from "../handlers";

export function Detail(props: any) {
  const classes = useStyles();
  const data: Result = props.location.state.details
    ? props.location.state.details
    : null;
  const tmdbData = props.location.state.keyword;
  const [recommendations, setRecommendations] = React.useState<any>();

  React.useEffect(() => {
    async function fetchData() {
      const response = await getRecommendations(tmdbData.id);
      setRecommendations(response.results.splice(0, 8));
    }
    fetchData();
  }, [tmdbData]);
  console.log(recommendations);
  return (
    <div>
      {data ? (
        <div className={classes.header}>
          {data.title}
          <div className={classes.details}>
            {tmdbData.poster_path ? (
              <img
                className={classes.poster}
                src={`https://image.tmdb.org/t/p/original${tmdbData.poster_path}`}
                alt={`${tmdbData.title} poster`}
                width="213.4"
                height="320"
              />
            ) : (
              <div className={classes.poster}>No Poster Found</div>
            )}
            <div>
              <div>Directed By: {data.director}</div>
              <div>
                Starring:{" "}
                {data.actors
                  ? data.actors.toString().replaceAll(",", ", ")
                  : ""}
              </div>
              <div>Runtime: {data.length} mins.</div>
              <div>Release Year: {data.year}</div>
              <div>Language: {data.language}</div>
              <div>Color: {data.color ? 'Yes' : 'No'}</div>
              <div>Format: {data.format}</div>
              <div>Label: {data.label}</div>
              <div>Notes: {data.notes}</div>
            </div>
          </div>
          <div className={classes.recommendations}>
            Similar Films:
            <div>
              {recommendations &&
                recommendations.map((recommend: any) => {
                  return (
                    <Link
                      to={{
                        pathname: `https://letterboxd.com/film/${recommend.title
                          .toLowerCase()
                          .replaceAll(" ", "-")}`,
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className={classes.recommendInfo}>
                        <Tooltip title={recommend.title}>
                          <img
                            src={`https://image.tmdb.org/t/p/original${recommend.poster_path}`}
                            alt={`${recommend.title} poster`}
                            width="106.7"
                            height="160"
                          />
                        </Tooltip>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      ) : (
        <div className={classes.header}>No movie provided</div>
      )}
    </div>
  );
}

const useStyles = makeStyles(() => ({
  header: {
    fontSize: 20,
    color: "white",
  },
  details: {
    display: "flex",
    marginTop: 20,
    textAlign: "left",
  },
  poster: {
    margin: 10,
    border: "solid",
    textAlign: "center",
  },
  recommendations: {
    marginTop: 30,
  },
  recommendInfo: {
    marginTop: 10,
    display: "inline-block",
    marginLeft: 5,
    marginRight: 5,
  },
}));
