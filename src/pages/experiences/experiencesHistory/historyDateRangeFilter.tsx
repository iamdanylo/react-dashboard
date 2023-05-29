import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import { PopUp } from 'components';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DateRange as DateRangeLite } from 'react-date-range';
import { CalendarIcon } from 'assets/svg/svg-components';
import moment, { Moment } from 'moment';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateFilterOption, DateRange } from 'types/experiences';
import { convertDateRangeToCalendarRange } from 'utils/helpers/dateHelper';
import { HISTORY_EVENTS_CALENDAR_DATE_RANGE, HISTORY_EVENTS_FILTER_NAME } from 'utils/storageKeys';

type Props = {
  onDateRangeChange: (range: DateRange) => void;
  options: DateFilterOption[];
  defaultOption: DateFilterOption;
  maxDate: Date;
};

const HistoryDateFilters: React.FC<Props> = ({
  onDateRangeChange,
  options,
  defaultOption,
  maxDate,
}) => {
  const storageRangeFilter = sessionStorage.getItem(HISTORY_EVENTS_CALENDAR_DATE_RANGE);
  const parsedRange = storageRangeFilter ? JSON.parse(storageRangeFilter) : null;
  const defaultDateRange = parsedRange ? convertDateRangeToCalendarRange(parsedRange) : {
    startDate: undefined,
    endDate: undefined,
    key: 'selection',
  };

  const [activeOption, setActiveOption] = useState(defaultOption);
  const [dateRange, setDateRange] = useState(defaultDateRange);

  const handleOptionClick = (opt: DateFilterOption) => {
    if (opt.key === activeOption.key) return;
    setActiveOption(opt);
    sessionStorage.setItem(HISTORY_EVENTS_FILTER_NAME, JSON.stringify(opt));

    let date: DateRange = {};
    if (opt.key !== 'other') {
      date = getDateByOption(opt.key);
    } else {
      date = {
        startDate: dateRange.startDate ? moment(dateRange.startDate).utc(true).toISOString() : undefined,
        endDate: dateRange.endDate ? moment(dateRange.endDate).add(1, 'day').utc(true).toISOString() : undefined,
      }
    }

    onDateRangeChange(date);
  };

  const handleSelect = (ranges: any) => {
    if (activeOption.key !== 'other') return;
    const { startDate, endDate } = ranges.selection;
    setDateRange(ranges.selection);
    sessionStorage.setItem(
      HISTORY_EVENTS_CALENDAR_DATE_RANGE,
      JSON.stringify(ranges.selection),
    );

    const start = moment(startDate).utc(true).toISOString();
    const end = moment(endDate).add(1, 'day').utc(true).toISOString();

    const date: DateRange = {
      startDate: start,
      endDate: end,
    };

    onDateRangeChange(date);
  };

  const getDateByOption = (key: DateFilterOption['key']) => {
    switch (key) {
      case 'today':
        return {
          startDate: moment.utc().set({hours: 0, minutes: 0, seconds: 0}).toISOString(),
          endDate: moment.utc().toISOString(),
        };
      case 'yesterday':
        return {
          startDate: moment.utc().subtract(1, 'day').set({hours: 0, minutes: 0, seconds: 0}).toISOString(),
          endDate: moment.utc().set({hours: 0, minutes: 0, seconds: 0}).toISOString(),
        };
      case 'week':
        return {
          startDate: moment.utc().subtract(7, 'days').set({hours: 0, minutes: 0, seconds: 0}).toISOString(),
          endDate: moment.utc().toISOString(),
        };
      case 'all':
        return null;
      default:
        return null;
    }
  };

  return (
    <Stack
      sx={{
        padding: '3px',
        border: '1px solid rgb(247, 247, 255)',
        borderRadius: '17px',
        marginLeft: '18px',
      }}
      direction={'row'}
    >
      {options.map((op) => {
        const isActive = activeOption.key === op.key;
        return (
          <Box
            key={op.key}
            onClick={() => handleOptionClick(op)}
            className={`event-date-filter-item ${isActive ? 'active' : ''}`}
          >
            <Typography className="filter-text" variant="body2">
              {op.label}
            </Typography>
          </Box>
        );
      })}
      <PopUp
        isOpen={false}
        onOpen={() => handleOptionClick({ key: 'other', label: 'other' })}
        position={'bottom right'}
        trigger={
          <Box
            className={`event-date-filter-item ${
              activeOption.key === 'other' ? 'active' : ''
            }`}
          >
            <Typography
              sx={{ marginRight: '6px' }}
              className="filter-text"
              variant="body2"
            >
              Other
            </Typography>
            <Box className="date-icon-wrap">
              <CalendarIcon />
            </Box>
          </Box>
        }
        content={
          <DateRangeLite
            editableDateInputs={false}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            ranges={[dateRange]}
            rangeColors={['#4c4ca0']}
            maxDate={maxDate}
          />
        }
      />
    </Stack>
  );
};

export default HistoryDateFilters;
