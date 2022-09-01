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
  TextField,
} from '@material-ui/core';
import {
  ArrowDownward,
  ArrowUpward,
  ArrowForward,
  PictureAsPdf,
  FilterList,
  Publish,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { BulkResponse, Result, Validation } from '../classes';
import { getFormattedDate } from '../util';
import { getAllMovies, deleteMovie, addBulkMovie } from '../handlers';
import {
  Notification,
  StyledTableCell,
  StyledTableHeaderCell,
  AddCSVModal,
} from '../components';
import {
  tableFieldStyle,
  tableHeaderContentStyle,
  tableHeaderStyle,
  tableHeaderTextStyle,
  tableStyle,
  headerRowStyle,
  subHeaderStyle,
  pdfIconStyle,
  tableContainerStyle,
  dialogButtonStyle,
  tableFooterStyle,
  leftSubHeaderStyle,
  parentHeaderStyle,
  uploadButtonStyle,
} from '../styles';
import { colors } from '../constants';
import { Delete } from '@material-ui/icons';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

export function AllMovies() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [data, setData] = React.useState<Result[]>();
  const [displayedData, setDisplayedData] = React.useState<Result[]>();
  const [validation, setValidation] = React.useState<Validation | undefined>();
  const [open, setOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string>();
  const [deleteTitle, setDeleteTitle] = React.useState<string>();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [sortedColumn, setSortedColumn] = React.useState({
    field: 'title',
    asc: true,
  });
  const [filter, setFilter] = React.useState<string>('');
  const [width, setWidth] = React.useState(window.innerWidth);
  const [fullView, setFullView] = React.useState(false);
  const [csvOpen, setCSVOpen] = React.useState(false);
  const [bulkAddResponse, setBulkAddResponse] = React.useState<BulkResponse>();

  window.addEventListener('resize', () => {
    setWidth(window.innerWidth);
  });

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={classes.tableContainerStyle}>
      {validation && open && (
        <Notification
          message={validation.message}
          severity={validation.severity}
          open={open}
          handleClose={handleClose}
        />
      )}

      <AddCSVModal
        csvOpen={csvOpen}
        setCSVOpen={setCSVOpen}
        handleFileUpload={handleFileUpload}
        bulkAddResponse={bulkAddResponse}
        setBulkAddResponse={setBulkAddResponse}
      />

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
            className={classes.dialogButtonStyle}
            onClick={() => handleDeleteModal()}
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

      <div className={classes.tableHeaderStyle}>
        <div className={classes.tableHeaderTextStyle}>All Movies</div>
      </div>
      <div className={classes.parentHeaderStyle}>
        <div className={classes.leftSubHeaderStyle}>
          <Tooltip title={'Add Movies By CSV'}>
            <Publish
              className={classes.pdfIconStyle}
              onClick={() => setCSVOpen(true)}
            />
          </Tooltip>
        </div>
        <div className={classes.subHeaderStyle}>
          <Tooltip title={'Export as PDF'}>
            <PictureAsPdf
              className={classes.pdfIconStyle}
              onClick={generatePdf}
            />
          </Tooltip>
          {width > 576 || fullView ? (
            <>
              {width < 576 && fullView && (
                <ArrowForward
                  className={classes.pdfIconStyle}
                  onClick={() => {
                    setFullView(false);
                  }}
                />
              )}
              <TextField
                label="Filter Movies"
                value={filter}
                className={classes.tableFieldStyle}
                InputProps={{ className: classes.tableFieldStyle }}
                InputLabelProps={{ className: classes.tableFieldStyle }}
                onChange={handleFilterChange}
              />
            </>
          ) : (
            <FilterList
              className={classes.pdfIconStyle}
              onClick={() => setFullView(!fullView)}
            />
          )}
        </div>
      </div>

      {displayedData && (
        <>
          <TableContainer className={classes.tableStyle} component={Paper}>
            <Table aria-label="simple table">
              <TableHead data-cy="AllMoviesHeaderRow">
                <TableRow className={classes.headerRowStyle}>
                  <StyledTableHeaderCell
                    onClick={() => sortData('title')}
                    align="center"
                  >
                    <span className={classes.tableHeaderContentStyle}>
                      Title{renderSortArrow('title')}
                    </span>
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell
                    onClick={() => sortData('director')}
                    align="center"
                  >
                    <span className={classes.tableHeaderContentStyle}>
                      Director{renderSortArrow('director')}
                    </span>
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell
                    onClick={() => sortData('year')}
                    align="center"
                  >
                    <span className={classes.tableHeaderContentStyle}>
                      Release Year{renderSortArrow('year')}
                    </span>
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell
                    onClick={() => sortData('length')}
                    align="center"
                  >
                    <span className={classes.tableHeaderContentStyle}>
                      Runtime{renderSortArrow('length')}
                    </span>
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell
                    onClick={() => sortData('language')}
                    align="center"
                  >
                    <span className={classes.tableHeaderContentStyle}>
                      Language{renderSortArrow('language')}
                    </span>
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell
                    onClick={() => sortData('color')}
                    align="center"
                  >
                    <span className={classes.tableHeaderContentStyle}>
                      Color{renderSortArrow('color')}
                    </span>
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell
                    onClick={() => sortData('studio')}
                    align="center"
                  >
                    <span className={classes.tableHeaderContentStyle}>
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
                    <span className={classes.tableHeaderContentStyle}>
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
                {displayedData.map((movie) => {
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
          <div className={classes.tableFooterStyle}>
            Total Movies: {displayedData.length}
          </div>
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
    if (displayedData) {
      const tempData = [...displayedData];
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
        setDisplayedData(tempData);
      } else {
        if (field === 'year' || field === 'length')
          tempData.sort((a: any, b: any) => b[field] - a[field]);
        else tempData.sort((a: any, b: any) => (a[field] > b[field] ? 1 : -1));
        setSortedColumn({ field, asc: true });
        setDisplayedData(tempData);
      }
    }
  }

  function handleRowClick(id: string) {
    navigate('/detail', {
      state: {
        id,
      },
    });
  }

  async function fetchFilteredData(value: string) {
    let formattedColorValue: boolean;
    if (
      value.toLowerCase() === 'y' ||
      value.toLowerCase() === 'ye' ||
      value.toLowerCase() === 'yes'
    )
      formattedColorValue = true;
    else if (value.toLowerCase() === 'n' || value.toLowerCase() === 'no')
      formattedColorValue = false;
    if (value && data) {
      const tempResult = data.filter(
        (e) =>
          e.title.toLowerCase().includes(value.toLowerCase()) ||
          e.director.toLowerCase().includes(value.toLowerCase()) ||
          (formattedColorValue &&
            e.color
              .toString()
              .toLowerCase()
              .includes(formattedColorValue.toString())) ||
          (e.actors &&
            e.actors.join(',').toLowerCase().includes(value.toLowerCase())) ||
          (e.genre && e.genre.toLowerCase().includes(value.toLowerCase())) ||
          (e.language &&
            e.language.toLowerCase().includes(value.toLowerCase())) ||
          (e.notes && e.notes.toLowerCase().includes(value.toLowerCase())) ||
          (e.studio && e.studio.toLowerCase().includes(value.toLowerCase())) ||
          (e.year && e.year.toString().includes(value.toLowerCase())) ||
          (e.length && e.length.toString().includes(value.toLowerCase())),
      );
      setDisplayedData(tempResult);
    } else if (data) setDisplayedData(data);
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
          navigate('/all-movies');
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
    setDisplayedData(result);
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
    if (displayedData) {
      const tempData = displayedData.map((movie, index) => {
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
      info: {
        title: 'Movies.pdf',
      },
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
          text: `Total Number of Movies: ${
            displayedData ? displayedData.length : 0
          }`,
          style: 'footer',
        },
      ],
    };
    pdfMake.createPdf(docDefinition).download('Movies.pdf');
    if (!navigator.userAgent.toLowerCase().includes('android')) {
      pdfMake.createPdf(docDefinition).open();
    }
  }

  function handleFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFilter(event.target.value);
    if (event.target.value) fetchFilteredData(event.target.value);
    else if (data) setDisplayedData(data);
  }

  function handleFileUpload(event: any) {
    if (
      event.target.files[0].name.slice(
        event.target.files[0].name.length - 4,
      ) === '.csv'
    ) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event?.target?.result;
        if (typeof text === 'string') {
          const uploadResult = await addBulkMovie(text);
          setBulkAddResponse(uploadResult);
          fetchData();
        }
      };
      reader.readAsText(event.target.files[0]);
    }
  }
}

const useStyles = makeStyles(() => ({
  leftSubHeaderStyle,
  tableHeaderStyle,
  tableStyle,
  headerRowStyle,
  dialogButtonStyle,
  tableContainerStyle,
  tableHeaderContentStyle,
  tableFooterStyle,
  pdfIconStyle,
  tableHeaderTextStyle,
  tableFieldStyle,
  subHeaderStyle,
  parentHeaderStyle,
  uploadButtonStyle,
}));
