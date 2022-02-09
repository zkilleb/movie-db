import React from 'react';
import {
  Paper,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { Result, Validation } from '../classes';
import { getAllMovies, deleteMovie } from '../handlers';
import { Notification } from '../components';
import { Delete } from '@material-ui/icons';

export function AllMovies() {
  const classes = useStyles();
  const history = useHistory();
  const [data, setData] = React.useState<Result[]>();
  const [validation, setValidation] = React.useState<Validation | undefined>();
  const [open, setOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string>();
  const [deleteTitle, setDeleteTitle] = React.useState<string>();
  const [dialogOpen, setDialogOpen] = React.useState(false);

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={classes.container}>
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
          Are you sure you want to delete {deleteTitle && deleteTitle}?
        </DialogContent>

        <DialogActions>
          <Button
            className={classes.dialogButtons}
            onClick={() => handleDeleteModal()}
          >
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

      <div className={classes.header}>All Releases</div>
      {data && (
        <TableContainer className={classes.table} component={Paper}>
          <Table aria-label="simple table">
            <TableHead data-cy="AllMoviesHeaderRow">
              <TableRow className={classes.headerRow}>
                <StyledTableHeaderCell align="center">
                  Title
                </StyledTableHeaderCell>
                <StyledTableHeaderCell align="center">
                  Director
                </StyledTableHeaderCell>
                <StyledTableHeaderCell align="center">
                  Release Year
                </StyledTableHeaderCell>
                <StyledTableHeaderCell align="center">
                  Runtime
                </StyledTableHeaderCell>
                <StyledTableHeaderCell align="center">
                  Language
                </StyledTableHeaderCell>
                <StyledTableHeaderCell align="center">
                  Color
                </StyledTableHeaderCell>
                <StyledTableHeaderCell align="center">
                  Studio
                </StyledTableHeaderCell>
                <StyledTableHeaderCell align="center">
                  Notes
                </StyledTableHeaderCell>
                <StyledTableHeaderCell align="center">
                  Genre
                </StyledTableHeaderCell>
                <StyledTableHeaderCell align="center">
                  Actors
                </StyledTableHeaderCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((movie) => {
                return (
                  <TableRow key={movie.title} data-cy="AllMoviesResultRow">
                    <StyledTableCell
                      align="center"
                      onClick={() => handleRowClick(movie._id)}
                    >
                      {movie.title}
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      onClick={() => handleRowClick(movie._id)}
                    >
                      {movie.director}
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      onClick={() => handleRowClick(movie._id)}
                    >
                      {movie.year}
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      onClick={() => handleRowClick(movie._id)}
                    >
                      {movie.length && `${movie.length} mins.`}
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      onClick={() => handleRowClick(movie._id)}
                    >
                      {movie.language}
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      onClick={() => handleRowClick(movie._id)}
                    >
                      {movie.color}
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      onClick={() => handleRowClick(movie._id)}
                    >
                      {movie.studio}
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      onClick={() => handleRowClick(movie._id)}
                    >
                      {movie.notes}
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      onClick={() => handleRowClick(movie._id)}
                    >
                      {movie.genre}
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      onClick={() => handleRowClick(movie._id)}
                    >
                      {movie.actors &&
                        movie.actors.slice(0, 3).map((actor, index) => {
                          return `${actor}${
                            movie.actors &&
                            index < movie.actors.slice(0, 3).length - 1
                              ? ', '
                              : ''
                          }`;
                        })}
                    </StyledTableCell>
                    <StyledTableCell
                      onClick={() => handleDeleteModal(movie._id, movie.title)}
                    >
                      <Delete />
                    </StyledTableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );

  function handleRowClick(id: string) {
    history.push({
      pathname: '/detail',
      state: {
        id,
      },
    });
  }

  function handleDeleteModal(id?: string, title?: string) {
    setDialogOpen(!dialogOpen);
    setDeleteId(id);
    setDeleteTitle(title);
  }

  async function handleDelete() {
    try {
      if (deleteId) {
        const response = await deleteMovie(deleteId);
        if (response.status === 200) {
          history.push({
            pathname: '/all-movies',
          });
          setDialogOpen(false);
          fetchData();
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

  async function fetchData() {
    const result = await getAllMovies();
    setData(result);
  }
}

const StyledTableCell = withStyles({
  root: {
    color: 'white',
  },
})(TableCell);

const StyledTableHeaderCell = withStyles({
  root: {
    color: 'white',
    fontWeight: 'bold',
  },
})(TableCell);

const useStyles = makeStyles(() => ({
  body: {
    color: 'white',
  },
  header: {
    color: 'white',
    fontSize: 30,
  },
  table: {
    backgroundColor: '#456',
    width: '95%',
    marginTop: 10,
    margin: 'auto',
  },
  headerRow: {
    backgroundColor: '#14181c',
  },
  dialogButtons: {
    color: 'white',
  },
  container: {
    overflow: 'hidden',
  },
}));
