import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { searchIcon } from 'assets/svg';

type InputProps = {
  name: string;
  label?: string;
  type?: string;
  fullWidth?: boolean;
  className?: string;
  id?: string;
  autoFocus?: boolean;
  systemError?: any;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

const SearchInput: React.FC<InputProps> = ({
  onChange,
  name,
  label,
  type = 'text',
  fullWidth = true,
  className = "",
  id = "",
  autoFocus,
  systemError,
  value,
  placeholder = 'Search'
}) => {
  const customClassName = className ?? '';

  return (
    <Box className={`search-input-wrap ${customClassName}`}>
      <img src={searchIcon} className="search-input-icon" />
      <TextField
        id={id}
        className="search-input"
        fullWidth={fullWidth}
        name={name}
        label={label}
        autoFocus={autoFocus}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        error={Boolean(systemError)}
        helperText={systemError}
      />
    </Box>
  );
};

export default SearchInput;
