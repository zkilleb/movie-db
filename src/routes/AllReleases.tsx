import React from 'react';
import {
  Paper,
  TableRow,
  TableHead,
  TableContainer,
  TableBody,
  Table,
  TableCell,
  Dialog,
  DialogContent,
  Button,
  DialogActions,
  Tooltip,
  TextField,
} from '@material-ui/core';
import {
  ArrowDownward,
  ArrowUpward,
  ArrowForward,
  PictureAsPdf,
  FilterList,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ReleaseStat, Validation } from '../classes';
import { getAllReleases, deleteReleaseFromAll } from '../handlers';
import {
  StyledTableCell,
  StyledTableHeaderCell,
  Notification,
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
} from '../styles';
import { getFormattedDate } from '../util';
import { Delete } from '@material-ui/icons';
import { colors } from '../constants';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

export function AllReleases() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [data, setData] = React.useState<ReleaseStat[]>();
  const [displayedData, setDisplayedData] = React.useState<ReleaseStat[]>();
  const [sortedColumn, setSortedColumn] = React.useState({
    field: 'title',
    asc: true,
  });
  const [deleteMovieId, setDeleteMovieId] = React.useState<string>();
  const [deleteReleaseId, setDeleteReleaseId] = React.useState<string>();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deleteTitle, setDeleteTitle] = React.useState<string>();
  const [validation, setValidation] = React.useState<Validation | undefined>();
  const [open, setOpen] = React.useState(false);
  const [filter, setFilter] = React.useState<string>('');

  const [width, setWidth] = React.useState(window.innerWidth);
  const [fullView, setFullView] = React.useState(false);

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
          Are you sure you want to delete release from{' '}
          {deleteTitle && deleteTitle}?
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
        <div className={classes.tableHeaderTextStyle}>All Releases</div>
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
              label="Filter Releases"
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
      {displayedData && (
        <>
          <TableContainer className={classes.tableStyle} component={Paper}>
            <Table aria-label="simple table">
              <TableHead data-cy="AllReleasesHeaderRow">
                <TableRow className={classes.headerRowStyle}>
                  <StyledTableHeaderCell
                    align="center"
                    onClick={() => sortData('title')}
                  >
                    <span className={classes.tableHeaderContentStyle}>
                      Title{renderSortArrow('title')}
                    </span>
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell
                    align="center"
                    onClick={() => sortData('label')}
                  >
                    <span className={classes.tableHeaderContentStyle}>
                      Label{renderSortArrow('label')}
                    </span>
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell
                    align="center"
                    onClick={() => sortData('format')}
                  >
                    <span className={classes.tableHeaderContentStyle}>
                      Format{renderSortArrow('format')}
                    </span>
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell
                    align="center"
                    onClick={() => sortData('notes')}
                  >
                    <span className={classes.tableHeaderContentStyle}>
                      Notes{renderSortArrow('notes')}
                    </span>
                  </StyledTableHeaderCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedData.map((release, index) => {
                  return (
                    <TableRow
                      key={`${release.title}${index}`}
                      data-cy="AllReleasesResultRow"
                    >
                      <StyledTableCell
                        align="center"
                        onClick={() => handleRowClick(release.id)}
                      >
                        {release.title}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        onClick={() => handleRowClick(release.id)}
                      >
                        {release.release.label}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        onClick={() => handleRowClick(release.id)}
                      >
                        {release.release.format}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        onClick={() => handleRowClick(release.id)}
                      >
                        {release.release.notes}
                      </StyledTableCell>
                      <StyledTableCell
                        onClick={() =>
                          handleDeleteModal(
                            release.id,
                            release.release.uuid,
                            release.title,
                          )
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
            Total Releases: {displayedData.length}
          </div>
        </>
      )}
    </div>
  );

  async function fetchData() {
    const result = await getAllReleases();
    setData(result);
    setDisplayedData(result);
  }

  async function fetchFilteredData(value: string) {
    if (value && data) {
      const tempResult = data.filter(
        (e) =>
          e.title.toLowerCase().includes(value.toLowerCase()) ||
          e.release.format.toLowerCase().includes(value.toLowerCase()) ||
          (e.release.label &&
            e.release.label.toLowerCase().includes(value.toLowerCase())) ||
          (e.release.notes &&
            e.release.notes.toLowerCase().includes(value.toLowerCase())),
      );
      setDisplayedData(tempResult);
    } else if (data) setDisplayedData(data);
  }

  function renderSortArrow(field: string) {
    let returnValue = null;
    if (field === sortedColumn.field) {
      sortedColumn.asc
        ? (returnValue = <ArrowDownward />)
        : (returnValue = <ArrowUpward />);
    }
    return returnValue;
  }

  function handleClose() {
    setOpen(false);
  }

  function sortData(field: string) {
    if (displayedData) {
      const tempData = [...displayedData];
      if (field === sortedColumn.field) {
        if (sortedColumn.asc) {
          if (field !== 'title')
            tempData.sort((a: any, b: any) =>
              a.release[field] > b.release[field] ? -1 : 1,
            );
          else
            tempData.sort((a: any, b: any) => (a[field] > b[field] ? -1 : 1));
        } else {
          if (field !== 'title')
            tempData.sort((a: any, b: any) =>
              a.release[field] > b.release[field] ? 1 : -1,
            );
          else
            tempData.sort((a: any, b: any) => (a[field] > b[field] ? 1 : -1));
        }
        setSortedColumn({ field, asc: !sortedColumn.asc });
        setDisplayedData(tempData);
      } else {
        if (field !== 'title')
          tempData.sort((a: any, b: any) =>
            a.release[field] > b.release[field] ? 1 : -1,
          );
        else tempData.sort((a: any, b: any) => (a[field] > b[field] ? 1 : -1));
        setSortedColumn({ field, asc: true });
        setDisplayedData(tempData);
      }
    }
  }

  function handleDeleteModal(id?: string, uuid?: string, title?: string) {
    setDialogOpen(!dialogOpen);
    setDeleteMovieId(id);
    setDeleteReleaseId(uuid);
    setDeleteTitle(title);
  }

  async function handleDelete() {
    try {
      if (deleteReleaseId && deleteMovieId) {
        const response = await deleteReleaseFromAll(
          deleteMovieId,
          deleteReleaseId,
        );
        if (response.status === 200) {
          navigate('/all-releases');
          setDialogOpen(false);
          fetchData();
        }
      }
    } catch (e: any) {
      setValidation({ message: e.response.data.message, severity: 'error' });
    }
    setOpen(true);
  }

  function handleRowClick(id: string) {
    navigate('/detail', {
      state: {
        id,
      },
    });
  }

  function aggregateData(): any {
    const headerData = [
      { text: '#', bold: true, alignment: 'center' },
      { text: 'Title', bold: true, alignment: 'center' },
      { text: 'Label', bold: true, alignment: 'center' },
      { text: 'Format', bold: true, alignment: 'center' },
      { text: 'Notes', bold: true, alignment: 'center' },
    ];
    if (displayedData) {
      const tempData = displayedData.map((release, index) => {
        return [
          { text: index, alignment: 'center' },
          { text: release.title, alignment: 'center' },
          { text: release.release.label, alignment: 'center' },
          { text: release.release.format, alignment: 'center' },
          { text: release.release.notes, alignment: 'center' },
        ];
      });
      return [headerData, ...tempData];
    }
    return [headerData];
  }

  async function generatePdf() {
    const docDefinition = {
      info: {
        title: 'Releases.pdf',
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
      content: [
        { text: 'Releases', style: 'header' },
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
            widths: ['auto', '*', '*', '*', '*'],
            body: aggregateData(),
          },
        },
        {
          text: `Total Number of Releases: ${
            displayedData ? displayedData.length : 0
          }`,
          style: 'footer',
        },
      ],
    };
    pdfMake.createPdf(docDefinition).download('Releases.pdf');
    if (!navigator.userAgent.toLowerCase().includes('android')) {
      pdfMake.createPdf(docDefinition).open();
    }
  }

  function handleFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFilter(event.target.value);
    if (event.target.value) fetchFilteredData(event.target.value);
    else if (data) setDisplayedData(data);
  }
}

const useStyles = makeStyles(() => ({
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
}));
