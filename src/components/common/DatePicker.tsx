import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { CalendarIcon } from 'assets/svg/svg-components';
import { SxProps, Theme } from '@mui/material/styles';
import { DateType } from 'types/experiences';

type Props = {
  value: DateType;
  onChange: (v: DateType) => void;
  label: string;
  defaultValue?: DateType;
  disabled?: boolean;
  disableFuture?: boolean;
  disablePast?: boolean;
  format?: string;
  sx?: SxProps<Theme>;
  minDate?: DateType;
};

const CustomDatePicker: React.FC<Props> = ({
  value,
  onChange,
  label,
  defaultValue,
  disabled = false,
  disableFuture = false,
  disablePast = false,
  format = 'DD/MM/YYYY',
  sx,
  minDate,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        sx={sx}
        label={label}
        value={value}
        format={format}
        defaultValue={defaultValue}
        onChange={(date) => onChange(date)}
        disabled={disabled}
        disableFuture={disableFuture}
        disablePast={disablePast}
        minDate={minDate}
        slots={{
          openPickerIcon: CalendarIcon,
        }}
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
