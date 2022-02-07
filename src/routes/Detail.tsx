import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Tooltip,
  Icon,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { Result, Validation, Ebert } from '../classes';
import { Notification, Review } from '../components';
import { getRecommendations, deleteMovie, getReview } from '../handlers';
import { filterTMDBResult } from '../util';

export function Detail(props: any) {
  const classes = useStyles();
  const history = useHistory();
  const data: Result = props.location.state.details
    ? props.location.state.details
    : null;
  const tmdbData = props.location.state.keyword;
  const [recommendations, setRecommendations] = React.useState<IRecommend[]>();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [validation, setValidation] = React.useState<Validation | undefined>();
  const [review, setReview] = React.useState<Ebert>();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (tmdbData && tmdbData.id) {
      async function fetchData() {
        const response = await getRecommendations(tmdbData.id);
        setRecommendations(response);
      }
      fetchData();
    }
  }, [tmdbData]);

  React.useEffect(() => {
    async function fetchData() {
      try {
        if (data.title && data.year) {
          const response = await getReview(data.title, data.year);
          if (response.status === 200) {
            setReview(response.data);
          }
        }
      } catch (e: any) {
        setValidation({ message: e.response.data, severity: 'info' });
        setOpen(true);
      }
    }
    fetchData();
  }, [data]);

  return (
    <div>
      {validation && open && (
        <Notification
          message={validation.message}
          severity={validation.severity}
          open={open}
          handleClose={handleClose}
        />
      )}

      <Dialog
        open={dialogOpen}
        PaperProps={{
          style: {
            backgroundColor: '#456',
            color: 'white',
            width: '50%',
            height: '15%',
          },
        }}
      >
        <DialogContent>
          Are you sure you want to delete {data.title}?
        </DialogContent>

        <DialogActions>
          <Button className={classes.dialogButtons} onClick={handleDeleteModal}>
            No
          </Button>
          <Button
            className={classes.dialogButtons}
            onClick={handleDelete}
            data-cy="ConfirmDelete"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {data ? (
        <div className={classes.header} data-cy="DetailContainer">
          {data.title}
          <Tooltip title={'Edit Movie'}>
            <Icon
              className={classes.editIcon}
              onClick={handleEditClick}
              data-cy="EditIcon"
            >
              <Edit />
            </Icon>
          </Tooltip>
          <Tooltip title={'Delete Movie'}>
            <Icon
              className={classes.deleteIcon}
              onClick={handleDeleteModal}
              data-cy="DeleteIcon"
            >
              <Delete />
            </Icon>
          </Tooltip>
          <div className={classes.details}>
            {tmdbData && tmdbData.poster_path ? (
              <img
                data-cy="DetailPoster"
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
              <div
                className={classes.field}
                onClick={handleDirectorClick}
              >
                Directed By: {data.director}
              </div>
              <div>
                Starring:{' '}
                {data.actors
                  ? data.actors.map((actor, index) => {
                      return (
                        <span
                          key={index}
                          onClick={() => handleActorClick(actor)}
                          className={classes.field}
                        >
                          {actor}
                          {data.actors &&
                            index < data.actors.length - 1 &&
                            ', '}
                        </span>
                      );
                    })
                  : ''}
              </div>
              <div>Runtime: {data.length} mins.</div>
              <div>Release Year: {data.year}</div>
              <div>Language: {data.language}</div>
              <div>Color: {data.color ? 'Yes' : 'No'}</div>
              <div>Format: {data.format}</div>
              <div>Label: {data.label}</div>
              <div>Notes: {data.notes}</div>
            </div>
            {review && (
              <Review
                writer={review.reviewWriter}
                stars={review.starRating}
                url={review.url}
              />
            )}
          </div>
          <div className={classes.recommendations} data-cy="Recommendations">
            Similar Films:
            <div>
              {recommendations &&
                recommendations.map((recommend: IRecommend) => {
                  return (
                    <div
                      key={JSON.stringify(recommend)}
                      className={classes.recommendInfo}
                      onClick={() => handleClick(recommend)}
                    >
                      <Tooltip title={recommend.title}>
                        <img
                          src={`https://image.tmdb.org/t/p/original${recommend.poster_path}`}
                          alt={`${recommend.title} poster`}
                          width="106.7"
                          height="160"
                          data-cy="RecommendedFilm"
                        />
                      </Tooltip>
                    </div>
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
    try {
      if (data._id) {
        const response = await deleteMovie(data._id);
        if (response.status === 200) {
          history.push({
            pathname: '/',
          });
        }
      }
    } catch (e: any) {
      setValidation({ message: e.response.data.message, severity: 'error' });
    }
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleEditClick() {
    history.push({
      pathname: '/edit',
      state: { details: data },
    });
  }

  function handleDirectorClick() {
    history.push({
      pathname: '/search',
      search: `?title=${data.director}&type=director`,
    });
  }

  function handleActorClick(actor: string) {
    history.push({
      pathname: '/search',
      search: `?title=${actor}&type=actor`,
    });
  }

  async function handleClick(recommend: IRecommend) {
    if (recommend.inCollection && recommend.state) {
      const keyword = await filterTMDBResult(
        recommend.state.year ? recommend.state.year.toString() : null,
        recommend.state.title ? recommend.state.title.toString() : null,
      );
      history.push({
        pathname: '/detail',
        state: {
          details: {
            title: recommend.state.title,
            format: recommend.state.format,
            length: recommend.state.length,
            year: recommend.state.year,
            color: recommend.state.color,
            language: recommend.state.language,
            director: recommend.state.director,
            label: recommend.state.label,
            actors: recommend.state.actors,
            notes: recommend.state.notes,
            _id: recommend.state._id,
          },
          keyword,
        },
      });
    } else {
      window.open(
        `https://letterboxd.com/film/${recommend.title
          .toLowerCase()
          .replaceAll(' ', '-')}`,
        '_blank',
      );
    }
  }
}

const useStyles = makeStyles(() => ({
  header: {
    fontSize: 20,
    color: 'white',
  },
  deleteIcon: {
    position: 'absolute',
    right: 0,
    marginRight: 10,
  },
  editIcon: {
    position: 'absolute',
    right: 30,
    marginRight: 10,
  },
  details: {
    display: 'flex',
    marginTop: 20,
    textAlign: 'left',
  },
  poster: {
    margin: 10,
    border: 'solid',
    textAlign: 'center',
  },
  recommendations: {
    marginTop: 30,
  },
  recommendInfo: {
    marginTop: 10,
    display: 'inline-block',
    marginLeft: 5,
    marginRight: 5,
  },
  dialogButtons: {
    color: 'white',
  },
  field: {
    '&:hover': {
      textDecoration: 'underline',
      cursor: 'pointer',
    },
  },
}));

interface IRecommend {
  poster_path: string;
  title: string;
  inCollection?: boolean;
  state?: Result;
}
