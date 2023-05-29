import { useEffect, useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Page, WhiteBox } from 'components';
import Typography from '@mui/material/Typography';
import EventsTable from '../components/EventsTable';
import EventsHistoryFilters from './eventsHistoryFilters';
import { historyExperiencesSelector, totalHistorySelector, experiencesLoadingSelector } from 'redux/selectors/experiences';
import { experiencesActions } from 'redux/reducers/experiences';
import { useDidUpdateEffect } from 'utils/hooks';
import { DateFilterOption, DateRange, GetExperiencesRequest } from 'types/experiences';
import Stack from '@mui/material/Stack';
import { HISTORY_EVENTS_SEARCH, HISTORY_EVENTS_FILTER_NAME, HISTORY_EVENTS_RANGE_FILTER } from 'utils/storageKeys';

const FILTER_OPTIONS: DateFilterOption[] = [
  {
    key: 'today',
    label: 'Today',
  },
  {
    key: 'yesterday',
    label: 'Yesterday',
  },
  {
    key: 'week',
    label: 'This week',
  },
  {
    key: 'all',
    label: 'All',
  },
];

const ExperiencesHistory: React.FC = () => {
  const storageRangeFilter = sessionStorage.getItem(
    HISTORY_EVENTS_RANGE_FILTER
  );
  const searchValueStorage = sessionStorage.getItem(HISTORY_EVENTS_SEARCH);
  const activeFilterNameStorage = sessionStorage.getItem(HISTORY_EVENTS_FILTER_NAME);

  const [searchValue, setSearchValue] = useState(searchValueStorage || '');
  const [dateFilter, setDateFilter] = useState<DateRange>(storageRangeFilter ? JSON.parse(storageRangeFilter) : null);
  const [offset, setOffset] = useState(0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const events = useAppSelector(historyExperiencesSelector);
  const total = useAppSelector(totalHistorySelector);
  const loading = useAppSelector(experiencesLoadingSelector);

  useEffect(() => {
    setOffset(0);
    dispatch(
      experiencesActions.getHistoryExperiences({
        query: searchValue,
        offset: 0,
        startDateTime: dateFilter?.startDate,
        endDateTime: dateFilter?.endDate,
      })
    );

    return () => {
      dispatch(experiencesActions.updateHistoryOffset({ offset: 0 }));
    }
  }, [dispatch]);

  useDidUpdateEffect(() => {
    setOffset(0);
    doSearch();
  }, [searchValue, dateFilter]);

  const doSearch = (offset: number = 0) => {
    let request: GetExperiencesRequest = {
      query: searchValue,
      offset: offset,
    };

    if (dateFilter?.startDate) {
      request.startDateTime = dateFilter.startDate;
    }

    if (dateFilter?.endDate) {
      request.endDateTime = dateFilter.endDate;
    }

    dispatch(experiencesActions.getHistoryExperiences(request));
  }

  useDidUpdateEffect(() => {
    dispatch(experiencesActions.updateHistoryOffset({ offset: offset }));
  }, [offset]);

  const loadMore = () => {
    doSearch(offset + 10)
    setOffset(offset + 10);
  };

  const onSearchChange = useCallback(
    (searchText: string) => {
      setSearchValue(searchText);
      sessionStorage.setItem(HISTORY_EVENTS_SEARCH, searchText);
    },
    [navigate, dispatch]
  );

  const handleDateRangeChange = (range: DateRange) => {
    setDateFilter(range);
    sessionStorage.setItem(HISTORY_EVENTS_RANGE_FILTER, JSON.stringify(range));
  };

  return (
    <Page className="experiences-page" title="Experiences history">
      <WhiteBox>
        <Box className="experiences-header">
          <Stack justifyContent='space-between'>
            <Typography variant="h2">Total: {total}</Typography>
          </Stack>
          <EventsHistoryFilters
            onSearchChange={onSearchChange}
            searchValue={searchValue}
            onDateRangeChange={handleDateRangeChange}
            options={FILTER_OPTIONS}
            defaultOption={activeFilterNameStorage ? JSON.parse(activeFilterNameStorage) : FILTER_OPTIONS.find(o => o.key === 'all')}
          />
        </Box>
        <EventsTable
          loading={loading}
          total={total}
          events={events}
          onLoadMore={loadMore}
        />
      </WhiteBox>
    </Page>
  );
};

export default ExperiencesHistory;
