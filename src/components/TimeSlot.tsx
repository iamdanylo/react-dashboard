import { FC } from 'react';
import Stack from '@mui/material/Stack';
import CustomTimePicker from './common/TimePicker';
import { DateType } from 'types/experiences';
import CustomIconButton from './CustomIconButton';
import { SxProps, Theme } from '@mui/material/styles';

interface Props {
  onStartChange: (date: DateType) => void;
  onEndChange: (date: DateType) => void;
  onAddClick: () => void;
  onRemoveClick: () => void;
  startValue: DateType;
  endValue: DateType;
  sx?: SxProps<Theme>;
  disableRemoveBtn?: boolean;
  minEndTime?: DateType;
  minStartTime?: DateType;
  disabled?: boolean;
  disableAddBtn?: boolean;
}

const TimeSlot: FC<Props> = ({
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  onRemoveClick,
  onAddClick,
  disableRemoveBtn,
  sx,
  minEndTime,
  minStartTime,
  disabled,
  disableAddBtn,
}) => {
  const handleStartChange = (date: DateType) => {
    onStartChange(date);
  };

  const handleEndChange = (date: DateType) => {
    onEndChange(date);
  };

  return (
    <Stack direction={'row'} sx={sx} gap={1}>
      <CustomTimePicker
        ampm={false}
        label="Start time"
        value={startValue}
        onChange={handleStartChange}
        format="HH:mm"
        disablePast={false}
        minTime={minStartTime}
        disabled={disabled}
      />
      <CustomTimePicker
        ampm={false}
        label="End time"
        value={endValue}
        onChange={handleEndChange}
        disablePast={false}
        format="HH:mm"
        minTime={minEndTime}
        disabled={disabled}
      />
      <CustomIconButton disabled={disableRemoveBtn} onClick={onRemoveClick} type='remove' />
      <CustomIconButton disabled={disableAddBtn} onClick={onAddClick} type='add' />
    </Stack>
  );
};

export default TimeSlot;
