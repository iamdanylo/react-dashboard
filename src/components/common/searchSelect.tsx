import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { SxProps, Theme } from '@mui/material/styles';
import { SelectOptionType } from 'components/common/CustomSelect';

type Props = {
  options: SelectOptionType[];
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string | boolean;
  error?: boolean;
  fullWidth?: boolean;
  className?: string;
  id?: string;
  disabled?: boolean;
  sx?: SxProps<Theme>;
};

const SearchSelect: React.FC<Props> = ({
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
  disabled = false,
  sx,
}) => {
  const [selectedValue, setSelectedValue] = React.useState<SelectOptionType | null>(null);

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: SelectOptionType | null
  ) => {
    setSelectedValue(newValue);
    onChange(newValue?.value as string);
  };

  React.useEffect(() => {
    if (value === "" && selectedValue) {
      setSelectedValue(null)
    }
  }, [selectedValue, value]);

  return (
    <Autocomplete
      id={id}
      sx={sx}
      disablePortal
      options={options}
      className={className}
      fullWidth={fullWidth}
      disabled={disabled}
      value={selectedValue}
      onChange={handleChange}
      getOptionLabel={(option) => option.label}
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
          label={label}
          variant="outlined"
          error={error}
          helperText={helperText}
        />
      )}
    />
  );
};

export default SearchSelect;
