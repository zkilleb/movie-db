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
} from '@material-ui/core';
import { ArrowDownward, ArrowUpward, PictureAsPdf } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ReleaseStat, Validation } from '../classes';
import { getAllReleases, deleteReleaseFromAll } from '../handlers';
import {
  StyledTableCell,
  StyledTableHeaderCell,
  Notification,
} from '../components';
import { getFormattedDate } from '../util';
import { Delete } from '@material-ui/icons';
import { colors } from '../constants';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

export function AllReleases() {
  const classes = useStyles();
  const history = useHistory();
  const [data, setData] = React.useState<ReleaseStat[]>();
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
          Are you sure you want to delete release from{' '}
          {deleteTitle && deleteTitle}?
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
        <div className={classes.headerText}>All Releases</div>
        <Tooltip title={'Export as PDF'}>
          <PictureAsPdf className={classes.pdfIcon} onClick={generatePdf} />
        </Tooltip>
      </div>
      {data && (
        <>
          <TableContainer className={classes.table} component={Paper}>
            <Table aria-label="simple table">
              <TableHead data-cy="AllReleasesHeaderRow">
                <TableRow className={classes.headerRow}>
                  <StyledTableHeaderCell
                    align="center"
                    onClick={() => sortData('title')}
                  >
                    <span className={classes.headerContent}>
                      Title{renderSortArrow('title')}
                    </span>
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell
                    align="center"
                    onClick={() => sortData('label')}
                  >
                    <span className={classes.headerContent}>
                      Label{renderSortArrow('label')}
                    </span>
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell
                    align="center"
                    onClick={() => sortData('format')}
                  >
                    <span className={classes.headerContent}>
                      Format{renderSortArrow('format')}
                    </span>
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell
                    align="center"
                    onClick={() => sortData('notes')}
                  >
                    <span className={classes.headerContent}>
                      Notes{renderSortArrow('notes')}
                    </span>
                  </StyledTableHeaderCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((release, index) => {
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
          <span className={classes.footer}>Total Releases: {data.length}</span>
        </>
      )}
    </div>
  );

  async function fetchData() {
    const result = await getAllReleases();
    setData(result);
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
    if (data) {
      const tempData = [...data];
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
        setData(tempData);
      } else {
        if (field !== 'title')
          tempData.sort((a: any, b: any) =>
            a.release[field] > b.release[field] ? 1 : -1,
          );
        else tempData.sort((a: any, b: any) => (a[field] > b[field] ? 1 : -1));
        setSortedColumn({ field, asc: true });
        setData(tempData);
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
          history.push({
            pathname: '/all-releases',
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

  function handleRowClick(id: string) {
    history.push({
      pathname: '/detail',
      state: {
        id,
      },
    });
  }

  function aggregateData(): any {
    const headerData = [
      { text: '#', bold: true, center: true, alignment: 'center' },
      { text: 'Title', bold: true, center: true, alignment: 'center' },
      { text: 'Label', bold: true, alignment: 'center' },
      { text: 'Format', bold: true, alignment: 'center' },
      { text: 'Notes', bold: true, alignment: 'center' },
    ];
    if (data) {
      const tempData = data.map((release, index) => {
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
          text: `Total Number of Releases: ${data ? data.length : 0}`,
          style: 'footer',
        },
      ],
    };
    pdfMake.createPdf(docDefinition).download('Releases.pdf');
    pdfMake.createPdf(docDefinition).open();
  }
}

const useStyles = makeStyles(() => ({
  header: {
    color: 'white',
    fontSize: 30,
    display: 'flex',
  },
  headerText: {
    fontSize: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginLeft: 40,
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
  dialogButtons: {
    color: 'white',
  },
  pdfIcon: {
    paddingRight: 10,
    marginLeft: 'auto',
    color: 'white',
  },
}));
