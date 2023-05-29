import React from 'react';
import Stack from '@mui/material/Stack';
import { SearchInput } from 'components';
import DateFilters from './upcomingDateRangeFilter';
import moment from 'moment';
import { DateFilterOption, DateRange } from 'types/experiences';

type Props = {
  onSearchChange: (value: string) => void;
  searchValue: string;
  onDateRangeChange: (range: DateRange ) => void;
  options: DateFilterOption[];
  defaultOption: DateFilterOption;
};

const UpcomingEventsFilters: React.FC<Props> = ({
  onSearchChange,
  searchValue,
  onDateRangeChange,
  options,
  defaultOption,
}) => {

  return (
    <Stack flexDirection={'row'} alignItems={'center'}>
      <SearchInput
        name="search"
        onChange={(v) => onSearchChange(v)}
        value={searchValue}
      />
      <DateFilters
        options={options}
        defaultOption={defaultOption}
        onDateRangeChange={onDateRangeChange}
        minDate={moment().set({hours: 0, minutes: 0}).toDate()}
      />
    </Stack>
  );
};

export default UpcomingEventsFilters;
