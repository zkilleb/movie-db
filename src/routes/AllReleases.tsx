import React from 'react';
import {
  Paper,
  TableRow,
  TableHead,
  TableContainer,
  TableBody,
  Table,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ReleaseStat } from '../classes';
import { getAllReleases } from '../handlers';
import { StyledTableCell, StyledTableHeaderCell } from '../components';
import { colors } from '../constants';

export function AllReleases() {
  const classes = useStyles();
  const [data, setData] = React.useState<ReleaseStat[]>();

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.header}>All Releases</div>
      {data && (
        <TableContainer className={classes.table} component={Paper}>
          <Table aria-label="simple table">
            <TableHead data-cy="AllReleasesHeaderRow">
              <TableRow className={classes.headerRow}>
                <StyledTableHeaderCell align="center">
                  Title
                </StyledTableHeaderCell>
                <StyledTableHeaderCell align="center">
                  <span className={classes.headerContent}>Format</span>
                </StyledTableHeaderCell>
                <StyledTableHeaderCell align="center">
                  <span className={classes.headerContent}>Notes</span>
                </StyledTableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((release) => {
                return (
                  <TableRow key={release.title} data-cy="AllReleasesResultRow">
                    <StyledTableCell align="center">
                      {release.title}
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
      )}
    </div>
  );

  async function fetchData() {
    const result = await getAllReleases();
    setData(result);
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
}));
