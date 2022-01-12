import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Tooltip,
  Icon,
  Dialog,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
} from "@material-ui/core";
import { Delete, Edit } from "@material-ui/icons";
import { Link, useHistory } from "react-router-dom";
import { Result } from "../classes";
import { getRecommendations } from "../handlers";
import { deleteMovie } from "../handlers/deleteMovie";

export function Detail(props: any) {
  const classes = useStyles();
  const history = useHistory();
  const data: Result = props.location.state.details
    ? props.location.state.details
    : null;
  const tmdbData = props.location.state.keyword;
  const [recommendations, setRecommendations] = React.useState<IRecommend[]>();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [validation, setValidation] = React.useState("");

  React.useEffect(() => {
    if (tmdbData && tmdbData.id) {
      async function fetchData() {
        const response = await getRecommendations(tmdbData.id);
        setRecommendations(response.results.splice(0, 8));
      }
      fetchData();
    }
  }, [tmdbData]);

  return (
    <div>
      <Dialog
        open={dialogOpen}
        PaperProps={{
          style: {
            backgroundColor: "#456",
            color: "white",
            width: "50%",
            height: "15%",
          },
        }}
      >
        <DialogContent>
          Are you sure you want to delete {data.title}?
          <DialogContentText className={classes.error}>
            {validation}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button className={classes.dialogButtons} onClick={handleDeleteModal}>
            No
          </Button>
          <Button className={classes.dialogButtons} onClick={handleDelete}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {data ? (
        <div className={classes.header}>
          {data.title}
          <Tooltip title={"Edit Movie"}>
            <Icon className={classes.editIcon} onClick={handleEditClick}>
              <Edit />
            </Icon>
          </Tooltip>
          <Tooltip title={"Delete Movie"}>
            <Icon className={classes.deleteIcon} onClick={handleDeleteModal}>
              <Delete />
            </Icon>
          </Tooltip>
          <div className={classes.details}>
            {tmdbData && tmdbData.poster_path ? (
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
              <div>Color: {data.color ? "Yes" : "No"}</div>
              <div>Format: {data.format}</div>
              <div>Label: {data.label}</div>
              <div>Notes: {data.notes}</div>
            </div>
          </div>
          <div className={classes.recommendations}>
            Similar Films:
            <div>
              {recommendations &&
                recommendations.map((recommend: IRecommend) => {
                  return (
                    <Link
                      to={{
                        pathname: `https://letterboxd.com/film/${recommend.title
                          .toLowerCase()
                          .replaceAll(" ", "-")}`,
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={JSON.stringify(recommend)}
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

  function handleDeleteModal() {
    setDialogOpen(!dialogOpen);
  }

  async function handleDelete() {
    if (data._id) {
      const response = await deleteMovie(data._id);
      if (response === "Record succesfully deleted") {
        history.push({
          pathname: "/",
        });
      } else setValidation("Error deleting record");
    }
  }

  function handleEditClick() {
    history.push({
      pathname: "/edit",
      state: { details: data },
    });
  }
}

const useStyles = makeStyles(() => ({
  header: {
    fontSize: 20,
    color: "white",
  },
  deleteIcon: {
    position: "absolute",
    right: 0,
    marginRight: 10,
  },
  editIcon: {
    position: "absolute",
    right: 30,
    marginRight: 10,
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
  dialogButtons: {
    color: "white",
  },
  error: {
    color: "red",
  },
}));

interface IRecommend {
  poster_path: string;
  title: string;
}
