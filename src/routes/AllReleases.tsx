import React from 'react';
import {
  Paper,
  TableRow,
  TableHead,
  TableContainer,
  TableBody,
  Table,
} from '@material-ui/core';
import { ArrowDownward, ArrowUpward } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { ReleaseStat } from '../classes';
import { getAllReleases } from '../handlers';
import { StyledTableCell, StyledTableHeaderCell } from '../components';
import { colors } from '../constants';

export function AllReleases() {
  const classes = useStyles();
  const history = useHistory();
  const [data, setData] = React.useState<ReleaseStat[]>();
  const [sortedColumn, setSortedColumn] = React.useState({
    field: 'title',
    asc: true,
  });

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.header}>All Releases</div>
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
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((release, index) => {
                  return (
                    <TableRow
                      key={`${release.title}${index}`}
                      data-cy="AllReleasesResultRow"
                      onClick={() => handleRowClick(release.id)}
                    >
                      <StyledTableCell align="center">
                        {release.title}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {release.release.label}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {release.release.format}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {release.release.notes}
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

  function handleRowClick(id: string) {
    history.push({
      pathname: '/detail',
      state: {
        id,
      },
    });
  }
}

const useStyles = makeStyles(() => ({
  header: {
    color: 'white',
    fontSize: 30,
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
}));
