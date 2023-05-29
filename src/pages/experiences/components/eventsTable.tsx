import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import { ReactLoader, StyledTableCell, StyledTableRow } from 'components';
import { FC } from 'react';
import Button from '@mui/material/Button';
import moment from 'moment';
import Stack from '@mui/material/Stack';
import {
  ExperienceDto,
  ExperienceStatusEnum,
  ExperienceTimeSlotType,
  RecurringTypeEnum,
} from 'models/experiences';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { getExperienceStatusLabel } from 'utils/helpers/experiences';

type TableHeadCell = {
  label: string;
};

const TABLE_HEAD: TableHeadCell[] = [
  {
    label: 'Event',
  },
  {
    label: 'Place',
  },
  {
    label: 'Country',
  },
  {
    label: 'Date',
  },
  {
    label: 'Time',
  },
  {
    label: 'RSVPs',
  },
  {
    label: 'Recurring',
  },
  {
    label: 'Status',
  },
];

type ExperienceStatusBadgeProps = {
  status: ExperienceStatusEnum;
};

const ExperienceStatusBadge: FC<ExperienceStatusBadgeProps> = ({ status }) => (
  <Stack
    sx={{
      borderRadius: '12px',
      padding: '10px',
      backgroundColor: status === ExperienceStatusEnum.DRAFT ? '#E8E8FF' : '#C1F2B6',
    }}
    justifyContent="center"
    alignItems="center"
  >
    <Typography sx={{ textTransform: 'capitalize' }} variant="body2">
      {getExperienceStatusLabel(status)}
    </Typography>
  </Stack>
);

type Props = {
  onLoadMore: () => void;
  events: ExperienceDto[];
  total: number | null;
  loading?: boolean;
};

const EventsTable: FC<Props> = ({ onLoadMore, events, total, loading }) => {
  const navigate = useNavigate();

  const formatDate = (date: Date) => {
    return moment(date).utc(false).format('ddd, DD MMMM');
  };

  const getTimeView = (
    timeslot: ExperienceTimeSlotType,
    recurringType: RecurringTypeEnum
  ) => {
    return recurringType === RecurringTypeEnum.MULTI_DAY
      ? '--/--'
      : `${moment.utc(timeslot.startDateTime).format(
          'HH:mm'
        )} - ${moment.utc(timeslot.endDateTime).format('HH:mm')}`;
  };

  const onClickHandler = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>, eventId: string) => {
    if (e.metaKey || e.ctrlKey) {
      
      window.open(
        `${window.location.origin}/experiences/details/${eventId}`,
        '_blank',
        'noreferrer'
      );
    } else {
      navigate(`/experiences/details/${eventId}`);
    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 'none' }}>
      {loading && !events?.length ? (
        <Stack alignItems="center" direction="column" marginTop={2}>
          <ReactLoader />
        </Stack>
      ) : (
        <TableContainer sx={{ maxHeight: '68vh' }}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table" stickyHeader>
            <TableHead>
              <StyledTableRow className="table-head">
                {TABLE_HEAD.map((item) => (
                  <StyledTableCell key={item.label} align="left">
                    {item.label}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {events.map((event, i) => (
                <StyledTableRow onClick={(e) => onClickHandler(e, event._id)} className="table-row" key={i}>
                  <StyledTableCell sx={{minWidth: '180px'}} align="left">{event.title}</StyledTableCell>
                  <StyledTableCell sx={{minWidth: '100px'}} align="left">{event.place?.name}</StyledTableCell>
                  <StyledTableCell align="left">
                    {event.place?.city?.country?.name}
                  </StyledTableCell>
                  <StyledTableCell sx={{minWidth: '150px'}} align="left">
                    {formatDate(event.timeSlot.startDateTime)}
                  </StyledTableCell>
                  <StyledTableCell sx={{minWidth: '130px'}} align="left">
                    {getTimeView(event.timeSlot, event.recurringType)}
                  </StyledTableCell>
                  <StyledTableCell align="left">{event.bookingsAmount}</StyledTableCell>
                  <StyledTableCell align="left">{event.isSingle ? 'Single' : 'Multiple'}</StyledTableCell>
                  <StyledTableCell align="left">
                    <ExperienceStatusBadge status={event.status} />
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
          {total && events?.length < total ? (
            <Button onClick={onLoadMore} variant="contained" color="primary" fullWidth>
              Load more
            </Button>
          ) : null}
        </TableContainer>
      )}
    </Paper>
  );
};

export default EventsTable;
