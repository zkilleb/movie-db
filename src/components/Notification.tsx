import { Snackbar } from '@material-ui/core';
import { Alert, Color } from '@material-ui/lab';

export function Notification({
  message,
  severity,
  handleClose,
  open,
}: {
  message: string;
  severity: string;
  handleClose: () => void;
  open: boolean;
}) {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={severity as Color}
        data-cy="DetailAlert"
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
