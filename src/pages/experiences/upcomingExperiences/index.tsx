import { useEffect, useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Page, WhiteBox } from 'components';
import Typography from '@mui/material/Typography';
import EventsTable from '../components/EventsTable';
import UpcomingEventsFilters from './upcomingEventsFilter';
import { upcomingSelector, totalUpcomingSelector, experiencesLoadingSelector } from 'redux/selectors/experiences';
import { experiencesActions } from 'redux/reducers/experiences';
import { useDidUpdateEffect } from 'utils/hooks';
import { DateFilterOption, DateRange, GetExperiencesRequest } from 'types/experiences';
import Stack from '@mui/material/Stack';
import { UPCOMING_EVENTS_FILTER_NAME, UPCOMING_EVENTS_RANGE_FILTER, UPCOMING_EVENTS_SEARCH } from 'utils/storageKeys';

const FILTER_OPTIONS: DateFilterOption[] = [
  {
    key: 'today',
    label: 'Today',
  },
  {
    key: 'tomorrow',
    label: 'Tomorrow',
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

const Experiences: React.FC = () => {
  const storageRangeFilter = sessionStorage.getItem(
    UPCOMING_EVENTS_RANGE_FILTER
  );
  const searchValueStorage = sessionStorage.getItem(UPCOMING_EVENTS_SEARCH);
  const activeFilterNameStorage = sessionStorage.getItem(UPCOMING_EVENTS_FILTER_NAME);
  const [searchValue, setSearchValue] = useState(searchValueStorage || '');
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRange>(storageRangeFilter ? JSON.parse(storageRangeFilter) : null);
  const [offset, setOffset] = useState(0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const events = useAppSelector(upcomingSelector);
  const total = useAppSelector(totalUpcomingSelector);
  const loading = useAppSelector(experiencesLoadingSelector);

  useEffect(() => {
    setOffset(0);
    dispatch(
      experiencesActions.getUpcomingExperiences({
        query: searchValue,
        offset: 0,
        startDateTime: dateRangeFilter?.startDate,
        endDateTime: dateRangeFilter?.endDate,
      })
    );

    return () => {
      dispatch(experiencesActions.updateUpcomingOffset({ offset: 0 }));
    }
  }, [dispatch]);

  useDidUpdateEffect(() => {
    setOffset(0);
    doSearch();
  }, [searchValue, dateRangeFilter]);

  const doSearch = (offset: number = 0) => {
    let request: GetExperiencesRequest = {
      query: searchValue,
      offset: offset,
    };

    if (dateRangeFilter?.startDate) {
      request.startDateTime = dateRangeFilter.startDate;
    }

    if (dateRangeFilter?.endDate) {
      request.endDateTime = dateRangeFilter.endDate;
    }

    dispatch(experiencesActions.getUpcomingExperiences(request));
  }

  useDidUpdateEffect(() => {
    dispatch(experiencesActions.updateUpcomingOffset({ offset: offset }));
  }, [offset]);

  const loadMore = () => {
    doSearch(offset + 10)
    setOffset(offset + 10);
  };

  const onSearchChange = useCallback(
    (searchText: string) => {
      setSearchValue(searchText);
      sessionStorage.setItem(UPCOMING_EVENTS_SEARCH, searchText);
    },
    [navigate, dispatch]
  );

  const handleDateRangeChange = (range: DateRange) => {
    setDateRangeFilter(range);
    sessionStorage.setItem(UPCOMING_EVENTS_RANGE_FILTER, JSON.stringify(range));
  };

  return (
    <Page className="experiences-page" title="Upcoming experiences">
      <WhiteBox>
        <Box className="experiences-header">
          <Stack justifyContent='space-between'>
            <Typography variant="h2">Total: {total}</Typography>
          </Stack>
          <UpcomingEventsFilters
            onSearchChange={onSearchChange}
            options={FILTER_OPTIONS}
            defaultOption={activeFilterNameStorage ? JSON.parse(activeFilterNameStorage) : FILTER_OPTIONS.find(o => o.key === 'all')}
            searchValue={searchValue}
            onDateRangeChange={handleDateRangeChange}
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

export default Experiences;
