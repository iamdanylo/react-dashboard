import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { SxProps, Theme } from '@mui/material/styles';
import { downArrow } from 'assets/svg';

export type SelectOptionType = { label: string; value: string | number };

type Props = {
  // if multiple props = true value must be string[] type
  value: string | string[];
  multiple?: boolean;
  options: SelectOptionType[];
  name: string;
  label: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  helperText?: string | boolean;
  error?: boolean;
  fullWidth?: boolean;
  className?: string;
  id?: string;
  disabled?: boolean;
  sx?: SxProps<Theme>;
};

const CustomSelect: React.FC<Props> = ({
  options,
  onChange,
  value,
  helperText,
  error,
  name,
  label,
  fullWidth = true,
  className = '',
  id = '',
  multiple = false,
  disabled = false,
  sx,
}) => {

  return (
    <TextField
      select
      id={id}
      className={className}
      sx={sx}
      name={name}
      label={label}
      fullWidth={fullWidth}
      variant="outlined"
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      disabled={disabled}
      SelectProps={{
        IconComponent: (props) => <img style={{right: '18px', top: 'calc(50% - 0.4em)'}} src={downArrow} {...props} />,
        multiple,
      }}
    >
      {options.length &&
        options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
    </TextField>
  );
};

export default CustomSelect;
