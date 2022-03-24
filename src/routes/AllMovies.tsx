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
  Tooltip,
} from '@material-ui/core';
import { ArrowDownward, ArrowUpward, PictureAsPdf } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Result, Validation } from '../classes';
import { getFormattedDate } from '../util';
import { getAllMovies, deleteMovie } from '../handlers';
import {
  Notification,
  StyledTableCell,
  StyledTableHeaderCell,
} from '../components';
import { colors } from '../constants';
import { Delete } from '@material-ui/icons';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

export function AllMovies() {
  const classes = useStyles();
  const history = useHistory();
  const [data, setData] = React.useState<Result[]>();
  const [validation, setValidation] = React.useState<Validation | undefined>();
  const [open, setOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string>();
  const [deleteTitle, setDeleteTitle] = React.useState<string>();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [sortedColumn, setSortedColumn] = React.useState({
    field: 'title',
    asc: true,
  });

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
            backgroundColor: colors.tableBackground,
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

      <div className={classes.header}>
        <div className={classes.headerText}>All Movies</div>
        <Tooltip title={'Export as PDF'}>
          <PictureAsPdf className={classes.pdfIcon} onClick={generatePdf} />
        </Tooltip>
      </div>
      {data && (
        <>
          <TableContainer className={classes.table} component={Paper}>
            <Table aria-label="simple table">
              <TableHead data-cy="AllMoviesHeaderRow">
                <TableRow className={classes.headerRow}>
                  <StyledTableHeaderCell
                    onClick={() => sortData('title')}
                    align="center"
                  >
                    <span className={classes.headerContent}>
                      Title{renderSortArrow('title')}
                    </span>
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell
                    onClick={() => sortData('director')}
                    align="center"
                  >
                    <span className={classes.headerContent}>
                      Director{renderSortArrow('director')}
                    </span>
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell
                    onClick={() => sortData('year')}
                    align="center"
                  >
                    <span className={classes.headerContent}>
                      Release Year{renderSortArrow('year')}
                    </span>
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell
                    onClick={() => sortData('length')}
                    align="center"
                  >
                    <span className={classes.headerContent}>
                      Runtime{renderSortArrow('length')}
                    </span>
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell
                    onClick={() => sortData('language')}
                    align="center"
                  >
                    <span className={classes.headerContent}>
                      Language{renderSortArrow('language')}
                    </span>
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell
                    onClick={() => sortData('color')}
                    align="center"
                  >
                    <span className={classes.headerContent}>
                      Color{renderSortArrow('color')}
                    </span>
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell
                    onClick={() => sortData('studio')}
                    align="center"
                  >
                    <span className={classes.headerContent}>
                      Studio{renderSortArrow('studio')}
                    </span>
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell align="center">
                    Notes
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell
                    onClick={() => sortData('genre')}
                    align="center"
                  >
                    <span className={classes.headerContent}>
                      Genre{renderSortArrow('genre')}
                    </span>
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
                        {movie.color ? 'Yes' : 'No'}
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
                        onClick={() =>
                          handleDeleteModal(movie._id, movie.title)
                        }
                      >
                        <Delete />
                      </StyledTableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <span className={classes.footer}>Total Movies: {data.length}</span>
        </>
      )}
    </div>
  );

  function renderSortArrow(field: string) {
    let returnValue = null;
    if (field === sortedColumn.field) {
      sortedColumn.asc
        ? (returnValue = <ArrowDownward />)
        : (returnValue = <ArrowUpward />);
    }
    return returnValue;
  }

  function sortData(field: string) {
    if (data) {
      const tempData = [...data];
      if (field === sortedColumn.field) {
        if (sortedColumn.asc) {
          if (field === 'year' || field === 'length')
            tempData.sort((a: any, b: any) => a[field] - b[field]);
          else
            tempData.sort((a: any, b: any) => (a[field] > b[field] ? -1 : 1));
        } else {
          if (field === 'year' || field === 'length')
            tempData.sort((a: any, b: any) => b[field] - a[field]);
          else
            tempData.sort((a: any, b: any) => (a[field] > b[field] ? 1 : -1));
        }
        setSortedColumn({ field, asc: !sortedColumn.asc });
        setData(tempData);
      } else {
        if (field === 'year' || field === 'length')
          tempData.sort((a: any, b: any) => b[field] - a[field]);
        else tempData.sort((a: any, b: any) => (a[field] > b[field] ? 1 : -1));
        setSortedColumn({ field, asc: true });
        setData(tempData);
      }
    }
  }

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

  function aggregateData(): any {
    const headerData = [
      { text: '#', bold: true, alignment: 'center' },
      { text: 'Title', bold: true, alignment: 'center' },
      { text: 'Director', bold: true, alignment: 'center' },
      { text: 'Release Year', bold: true, alignment: 'center' },
      { text: 'Runtime', bold: true, alignment: 'center' },
      { text: 'Language', bold: true, alignment: 'center' },
      { text: 'Color', bold: true, alignment: 'center' },
      { text: 'Studio', bold: true, alignment: 'center' },
      { text: 'Notes', bold: true, alignment: 'center' },
      { text: 'Genre', bold: true, alignment: 'center' },
      { text: 'Actors', bold: true, alignment: 'center' },
    ];
    if (data) {
      const tempData = data.map((movie, index) => {
        return [
          { text: index, alignment: 'center' },
          { text: movie.title, alignment: 'center' },
          { text: movie.director, alignment: 'center' },
          { text: movie.year, alignment: 'center' },
          { text: movie.length, alignment: 'center' },
          { text: movie.language, alignment: 'center' },
          { text: movie.color, alignment: 'center' },
          { text: movie.studio, alignment: 'center' },
          { text: movie.notes, alignment: 'center' },
          { text: movie.genre, alignment: 'center' },
          {
            text: movie && movie.actors ? movie.actors.join('\n') : '',
            alignment: 'center',
          },
        ];
      });
      return [headerData, ...tempData];
    }

    return [headerData];
  }

  async function generatePdf() {
    const docDefinition = {
      styles: {
        header: {
          fontSize: 30,
          bold: true,
          marginBottom: 10,
        },
        subHeader: {
          fontSize: 15,
          bold: true,
          marginBottom: 10,
        },
        footer: {
          bold: true,
          fontSize: 15,
          marginTop: 10,
        },
      },
      pageOrientation: 'landscape' as any,
      content: [
        { text: 'Movies', style: 'header' },
        { text: `Generated On: ${getFormattedDate()}`, style: 'subHeader' },
        {
          text: `Sorted by ${sortedColumn.field}, ${
            sortedColumn.asc ? 'ascending' : 'descending'
          }`,
          style: 'subHeader',
        },
        {
          layout: {
            fillColor: (i: number) => {
              return i % 2 === 0 ? '#CCCCCC' : null;
            },
          },
          table: {
            widths: [
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
            ],
            body: aggregateData(),
          },
        },
        {
          text: `Total Number of Movies: ${data ? data.length : 0}`,
          style: 'footer',
        },
      ],
    };
    pdfMake.createPdf(docDefinition).download('Movies.pdf');
    pdfMake.createPdf(docDefinition).open();
  }
}

const useStyles = makeStyles(() => ({
  header: {
    color: 'white',
    fontSize: 30,
    display: 'flex',
  },
  table: {
    backgroundColor: colors.tableBackground,
    width: '95%',
    marginTop: 10,
    margin: 'auto',
  },
  headerRow: {
    backgroundColor: colors.tableHeaderRowBackground,
  },
  dialogButtons: {
    color: 'white',
  },
  container: {
    overflow: 'hidden',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'center',
  },
  footer: {
    color: 'white',
  },
  pdfIcon: {
    paddingRight: 10,
    marginLeft: 'auto',
    color: 'white',
  },
  headerText: {
    fontSize: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginLeft: 40,
  },
}));
