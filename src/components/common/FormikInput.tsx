import React from 'react';
import TextField from '@mui/material/TextField';
import { InputProps } from '@mui/material/Input';

type FormikInputProps = {
  formik: any;
  name: string;
  label: string;
  type?: string;
  fullWidth?: boolean;
  multiline?: boolean;
  rowsCount?: number;
  className?: string;
  id?: string;
  autoFocus?: boolean;
  systemError?: any;
  inputProps?: Partial<InputProps>;
  disabled?: boolean;
};

const FormikInput: React.FC<FormikInputProps> = ({
  formik,
  name,
  label,
  type = 'text',
  fullWidth = true,
  multiline = false,
  rowsCount = 1,
  className = "",
  id = "",
  autoFocus,
  systemError,
  inputProps,
  disabled,
}) => {
  return (
    <TextField
      id={id}
      className={className}
      fullWidth={fullWidth}
      minRows={rowsCount}
      multiline={multiline}
      name={name}
      label={label}
      autoFocus={autoFocus}
      type={type}
      value={formik.values[name]}
      onChange={formik.handleChange}
      error={formik.touched[name] && Boolean(formik.errors[name]) || Boolean(systemError)}
      helperText={formik.touched[name] && formik.errors[name] || systemError}
      InputProps={inputProps}
      disabled={disabled}
    />
  );
};

export default FormikInput;
