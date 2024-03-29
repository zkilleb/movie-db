import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Tooltip,
  Icon,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { Result, Validation, Ebert, TMDBResult } from '../classes';
import { Notification, Review, Releases } from '../components';
import { colors } from '../constants';
import { dialogButtonStyle } from '../styles';
import {
  getRecommendations,
  deleteMovie,
  getReview,
  getMovieById,
} from '../handlers';
import { filterTMDBResult } from '../util';

export function Detail() {
  const location = useLocation();
  const { state } = location as IDetailProps;
  const classes = useStyles();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = React.useState<IRecommend[]>();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [validation, setValidation] = React.useState<Validation | undefined>();
  const [review, setReview] = React.useState<Ebert>();
  const [open, setOpen] = React.useState(false);
  const [tmdbData, setTmdbData] = React.useState<TMDBResult | undefined>();
  const [data, setData] = React.useState<Result>();
  const [width, setWidth] = React.useState(window.innerWidth);

  window.addEventListener('resize', () => {
    setWidth(window.innerWidth);
  });

  React.useEffect(() => {
    if (state && state.id) {
      async function fetchData() {
        const result = await getMovieById(state.id);
        const tmdbResult: TMDBResult | undefined = await filterTMDBResult(
          result.year,
          result.title,
        );
        if (tmdbResult && tmdbResult.id) {
          const recommendationResponse = await getRecommendations(
            tmdbResult.id,
          );
          setRecommendations(recommendationResponse);
        }
        try {
          if (result.title && result.year && !result.review) {
            const response = await getReview(
              result.title,
              result.year,
              state.id,
            );
            if (response.status === 200) {
              setReview(response.data);
            }
          } else if (result.review && result.review !== 'Review not found')
            setReview(result.review);
        } catch (e: any) {
          setValidation({ message: e.response.data, severity: 'info' });
          setOpen(true);
        }
        setData(result);
        setTmdbData(tmdbResult);
      }
      fetchData();
    }
  }, [state]);

  return state && state.id && !data ? (
    <CircularProgress className={classes.loading} />
  ) : (
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
            backgroundColor: colors.tableBackground,
            color: 'white',
          },
        }}
      >
        <DialogContent>
          Are you sure you want to delete {data && data.title}?
        </DialogContent>

        <DialogActions>
          <Button
            className={classes.dialogButtonStyle}
            onClick={handleDeleteModal}
          >
            No
          </Button>
          <Button
            className={classes.dialogButtonStyle}
            onClick={handleDelete}
            data-cy="ConfirmDelete"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {data ? (
        <div>
          <div className={classes.header}>
            <div className={classes.headerText}>{data.title}</div>
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
          </div>
          <div
            className={`${classes.details} ${classes.wrap}`}
            data-cy="DetailContainer"
          >
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
              <div className={classes.field} onClick={handleDirectorClick}>
                Directed By: {data.director}
              </div>
              {data.actors && data.actors.length > 0 && (
                <div>
                  Starring:{' '}
                  {data.actors.map((actor, index) => {
                    return (
                      <span
                        key={index}
                        onClick={() => handleActorClick(actor)}
                        className={classes.field}
                      >
                        {actor}
                        {data.actors && index < data.actors.length - 1 && ', '}
                      </span>
                    );
                  })}
                </div>
              )}
              {data.length && <div>Runtime: {data.length} mins.</div>}
              <div>Release Year: {data.year}</div>
              {data.language && <div>Language: {data.language}</div>}
              <div>Color: {data.color ? 'Yes' : 'No'}</div>
              {data.studio && <div>Studio: {data.studio}</div>}
              {data.genre && <div>Genre: {data.genre}</div>}
              {data.notes && <div>Notes: {data.notes}</div>}
            </div>
            <div
              className={width > 576 ? classes.extraInfo : classes.minExtraInfo}
            >
              <Review stars={data.rating} id={data._id} />
              {review && (
                <Review
                  writer={review.reviewWriter}
                  stars={review.starRating}
                  url={review.url}
                />
              )}
              <Releases data={data} />
            </div>
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
      if (data && data._id) {
        const response = await deleteMovie(data._id);
        if (response.status === 200) {
          navigate({
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
    navigate('/edit', { state: { details: data } });
  }

  function handleDirectorClick() {
    if (data) {
      navigate('/search', {
        state: { search: `?title=${data.director}&type=director` },
      });
    }
  }

  function handleActorClick(actor: string) {
    navigate('/search', { state: { search: `?title=${actor}&type=actor` } });
  }

  async function handleClick(recommend: IRecommend) {
    if (recommend.inCollection && recommend.state) {
      navigate('/detail', {
        state: {
          id: recommend.state._id,
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
    width: '100%',
    display: 'flex',
    fontSize: 20,
    color: 'white',
  },
  deleteIcon: {
    paddingRight: 10,
    marginLeft: 'auto',
  },
  editIcon: {
    paddingRight: 10,
    marginLeft: 'auto',
  },
  details: {
    display: 'flex',
    marginTop: 20,
    textAlign: 'left',
    fontSize: 20,
    color: 'white',
  },
  wrap: {
    flexWrap: 'wrap',
    width: '100%',
  },
  poster: {
    marginLeft: 'auto',
    marginRight: 'auto',
    border: 'solid',
    textAlign: 'center',
  },
  recommendations: {
    marginTop: 30,
    color: 'white',
    fontSize: 20,
  },
  recommendInfo: {
    marginTop: 10,
    display: 'inline-block',
    marginLeft: 5,
    marginRight: 5,
  },
  dialogButtonStyle,
  field: {
    '&:hover': {
      textDecoration: 'underline',
      cursor: 'pointer',
    },
  },
  loading: {
    marginTop: '20%',
  },
  extraInfo: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  minExtraInfo: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
  },
  headerText: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginLeft: 60,
  },
}));

interface IRecommend {
  poster_path: string;
  title: string;
  inCollection?: boolean;
  state?: Result;
}

interface IDetailProps {
  state: {
    id: string;
  };
}
