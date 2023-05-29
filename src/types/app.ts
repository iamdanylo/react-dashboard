export type ToastParams = {
  open: boolean;
  message?: string;
  severity?: 'success' | 'info' | 'warning' | 'error';
};