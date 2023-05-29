import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { ClockIcon } from 'assets/svg/svg-components';
import { DateType } from 'types/experiences';
import { Moment } from 'moment';

type Props = {
  value?: DateType;
  onChange: (v: DateType) => void;
  label: string;
  defaultValue?: DateType;
  disabled?: boolean;
  ampm?: boolean;
  closeOnSelect?: boolean;
  disablePast?: boolean;
  name?: string;
  format?: string;
  minTime?: DateType;
};

const CustomTimePicker: React.FC<Props> = ({
  value,
  onChange,
  label,
  defaultValue,
  disabled,
  ampm,
  closeOnSelect,
  disablePast,
  format,
  minTime,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <TimePicker
        label={label}
        value={value}
        onChange={onChange}
        defaultValue={defaultValue}
        disabled={disabled}
        ampm={ampm}
        closeOnSelect={closeOnSelect}
        disablePast={disablePast}
        format={format}
        minTime={minTime as Moment | undefined}
        slots={{
          openPickerIcon: ClockIcon,
        }}
      />
    </LocalizationProvider>
  );
};

export default CustomTimePicker;
