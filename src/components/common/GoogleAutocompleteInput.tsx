import React, { FC } from 'react';
import { usePlacesWidget } from 'react-google-autocomplete';
import TextField from '@mui/material/TextField';

type AutocompleteInputProps = {
  name: string;
  label: string;
  fullWidth?: boolean;
  rowsCount?: number;
  className?: string;
  id?: string;
  onChange: (e: string) => void;
  value: string;
  helperText?: string | boolean;
  error?: boolean;
};

const GoogleAutocompleteInput: FC<AutocompleteInputProps> = ({
  onChange,
  value,
  helperText,
  error,
  name,
  label,
  fullWidth = true,
  className = '',
  id = '',
}) => {

  const { ref } = usePlacesWidget({
    apiKey: process.env.REACT_APP_GOOGLE,
    onPlaceSelected: (place: google.maps.places.PlaceResult) =>
      onChange(place.formatted_address || ''),
  });

  return (
    <TextField
      type="text"
      variant="outlined"
      inputRef={ref}
      id={id}
      className={className}
      name={name}
      label={label}
      fullWidth={fullWidth}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      helperText={helperText}
    />
  );
};

export default GoogleAutocompleteInput;
