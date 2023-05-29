import Snackbar from '@mui/material/Snackbar';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import React, { FC } from 'react';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { toastSelector } from 'redux/selectors/app';
import { appActions } from 'redux/reducers/app';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Toast: FC = () => {
  const toast = useAppSelector(toastSelector);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(appActions.setToast({ open: false }));
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={toast.open}
      onClose={handleClose}
      autoHideDuration={6000}
    >
      <Alert
        onClose={handleClose}
        severity={toast.severity || 'info'}
        sx={{ width: '100%' }}
      >
        {toast.message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
