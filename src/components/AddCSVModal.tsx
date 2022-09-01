import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Button,
} from '@material-ui/core';
import {
  dialogButtonStyle,
  tableFooterStyle,
  uploadButtonStyle,
} from '../styles';
import { BulkResponse } from '../classes';
import { colors } from '../constants';

export function AddCSVModal({
  csvOpen,
  setCSVOpen,
  handleFileUpload,
  bulkAddResponse,
  setBulkAddResponse,
}: {
  csvOpen: boolean;
  setCSVOpen: (value: boolean) => void;
  handleFileUpload: (event: any) => void;
  bulkAddResponse?: BulkResponse;
  setBulkAddResponse: (response?: BulkResponse) => void;
}) {
  const classes = useStyles();

  return (
    <Dialog
      open={csvOpen}
      PaperProps={{
        style: {
          backgroundColor: colors.tableBackground,
          color: 'white',
          width: '50%',
          height: '20%',
        },
      }}
    >
      <DialogTitle>Add Movies By CSV File</DialogTitle>
      <DialogContent>
        <DialogContentText className={classes.tableFooterStyle}>
          Bulk upload movies via CSV file. Ensure CSV file contains a header row
          and data follows the order of title, length, year, color, language,
          director, studio, notes, genre. Leave empty fields blank. Actors and
          releases will have to be added manually.
        </DialogContentText>
        <Button
          className={classes.uploadButtonStyle}
          variant="contained"
          component="label"
        >
          Upload File
          <input accept=".csv" type="file" hidden onChange={handleFileUpload} />
        </Button>
        <DialogContentText className={classes.tableFooterStyle}>
          <div>{bulkAddResponse && bulkAddResponse.message}</div>
          {bulkAddResponse &&
            bulkAddResponse.errors.map((error) => (
              <div>
                {error.item}: {error.reason}
              </div>
            ))}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          className={classes.dialogButtonStyle}
          onClick={() => {
            setCSVOpen(false);
            setBulkAddResponse(undefined);
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const useStyles = makeStyles(() => ({
  dialogButtonStyle,
  tableFooterStyle,
  uploadButtonStyle,
}));
