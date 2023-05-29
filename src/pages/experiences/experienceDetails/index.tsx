import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import {
  CopyClickboardInput,
  CustomSelect,
  ExperiencePreview,
  Page,
  ReactLoader,
  WhiteBox,
} from 'components';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { externalLinkIcon } from 'assets/svg';
import PersonItem from './PersonItem';
import BreakdownItem from './BreakDownItem';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { experiencesActions } from 'redux/reducers/experiences';
import {
  selectedExperienceSelector,
  selectedTimeSlotDataSelector,
} from 'redux/selectors/experiences';
import {
  AccessTypeEnum,
  MultiDaySlot,
  RecurringTypeEnum,
  StandardDaySlot,
} from 'models/experiences';
import moment from 'moment';
import getSymbolFromCurrency from 'currency-symbol-map';
import { allPacesSelector } from 'redux/selectors/places';
import { placesActions } from 'redux/reducers/places';
import { UserType } from 'models/member';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '12px',
  p: 4,
};

const HAS_BOOKINGS_DELETE_TITLE = 'This experience already have bookings. If you proceed with the modification, the existing bookings will be removed, and all users will receive a refund. Are you sure you want to delete this experience?';
const DELETE_TITLE = 'Are you sure you want to delete this experience?';

type DateOption = {
  label: string;
  value: string;
  date: number; // timestamp
};

type QueryParams = {
  experienceId?: string;
};

const ExperienceDetails: React.FC = () => {
  const [timeSlotOptions, setTimeSlotOptions] = useState<DateOption[] | null>(null);
  const [activeTimeSlot, setActiveTimeSlot] = useState<DateOption | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasBookings, setHasBookings] = useState(false);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { experienceId } = useParams<QueryParams>();
  const experience = useAppSelector(selectedExperienceSelector);
  const places = useAppSelector(allPacesSelector);
  const timeSlotData = useAppSelector(selectedTimeSlotDataSelector);
  const isMultiDay = experience?.when?.recurringType === RecurringTypeEnum.MULTI_DAY;

  useEffect(() => {
    if (experienceId) {
      dispatch(experiencesActions.getExperienceById({ id: experienceId }));
    }

    return () => {
      dispatch(experiencesActions.clearSelectedExperience());
    };
  }, [dispatch, experienceId]);

  useEffect(() => {
    if (experienceId && experience && experience?.when?.daySlots && activeTimeSlot) {
      dispatch(
        experiencesActions.getExperienceByTimeSlotId({
          experienceId: experienceId,
          timeSlotId: activeTimeSlot?.value,
        })
      );
    }

    return () => {
      dispatch(experiencesActions.clearSelectedExperienceTimeSlotData());
    };
  }, [dispatch, activeTimeSlot]);

  useEffect(() => {
    if (!experience) return;
    setDatesOptions();
  }, [experience]);

  useEffect(() => {
    if (!places.length) {
      dispatch(placesActions.getPlaces());
    }
  }, [dispatch, places]);

  const setDatesOptions = () => {
    if (!isMultiDay) {
      const slots = experience?.when?.daySlots as StandardDaySlot[];
      let options = [] as DateOption[];
      const sortedSlots = [...slots].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      sortedSlots.forEach((slot) => {
        const date = slot.date;
        slot.timeSlots.map((time) => {
          if (!time._id) return;
          options.push({
            value: time._id,
            label: moment(date).format('D MMMM:') + ` ${time.startTime}-${time.endTime}`,
            date: moment.utc(slot.date).add(moment.duration(time.startTime)).valueOf(),
          });
        });
      });

      const sortedOptions = options.sort((a, b) => a.date - b.date);
      setTimeSlotOptions(sortedOptions);
      setActiveTimeSlot(sortedOptions[0]);
    } else {
      const slot = experience?.when?.daySlots as MultiDaySlot;
      if (slot?._id) {
        setActiveTimeSlot({
          label: getMultiDate(),
          value: slot._id,
          date: moment.utc(slot.startDate).valueOf(),
        });
      }
    }
  };

  const onTimeSlotChange = useCallback(
    (e: ChangeEvent<any>) => {
      const activeOption = timeSlotOptions?.find((o) => o.value === e.target.value);
      if (activeOption) setActiveTimeSlot(activeOption);
    },
    [timeSlotOptions]
  );

  const getMultiDate = () => {
    if (!isMultiDay || !experience) return '';
    const slot = experience?.when?.daySlots as MultiDaySlot;
    return `${moment(slot.startDate).format('D MMMM')} - ${moment(slot.endDate).format(
      'D MMMM'
    )}`;
  };

  const handleDeleteExperience = () => {
    if (!experienceId) return;
    dispatch(experiencesActions.deleteExperience({ experienceId: experienceId, forceDeleteExperience: hasBookings }));
    setIsModalVisible(false);
  };

  const isExperienceWithBookings = (): boolean => {
    if (!experience) return false;
    if (experience?.when?.recurringType === RecurringTypeEnum.MULTI_DAY) {
      const slot = experience?.when?.daySlots as MultiDaySlot;
      return !!slot?.bookingsAmount;
    } else {
      const slots = experience?.when?.daySlots as StandardDaySlot[];
      const bookedSlots = slots.flatMap(d => d.timeSlots.filter(t => t?.bookingsAmount && t.bookingsAmount > 0));
      // @ts-ignore
      return bookedSlots?.length > 0;
    }
  };

  const onExperienceDelete = () => {
    const hasBookings = isExperienceWithBookings();
    setHasBookings(hasBookings);
    setIsModalVisible(true);
  };

  const pricing = useMemo(() => experience?.pricing[0], [experience]);

  const selectedPlace = useMemo(
    () => places.find((p) => p._id === experience?.where?.place),
    [places, experience]
  );

  const getBookingsByUserType = (userType: UserType) => {
    if (!timeSlotData?.bookingDetails?.participants?.length) return [];
    return timeSlotData.bookingDetails.participants.filter(
      (b) => b.userType === userType
    );
  };

  const membersBookings = useMemo(
    () => getBookingsByUserType(UserType.MEMBER),
    [timeSlotData]
  );
  const guestsBookings = useMemo(
    () => getBookingsByUserType(UserType.GUEST),
    [timeSlotData]
  );
  const publicBookings = useMemo(
    () => getBookingsByUserType(UserType.PUBLIC),
    [timeSlotData]
  );

  return (
    <Page onBackClick={() => navigate(-1)} className="experience-details-page">
      <>
        {!experience ? (
          <Stack alignItems="center" direction="column" marginTop={2}>
            <ReactLoader />
          </Stack>
        ) : (
          <>
            <Stack
              sx={{ marginBottom: '32px' }}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h1">{experience.what.title}</Typography>
              {timeSlotOptions && activeTimeSlot && timeSlotOptions?.length > 0 && (
                <CustomSelect
                  name="date-select"
                  label="Date"
                  options={timeSlotOptions}
                  value={activeTimeSlot.value}
                  onChange={(e) => onTimeSlotChange(e)}
                  sx={{ maxWidth: '262px' }}
                  disabled={timeSlotOptions?.length <= 1}
                />
              )}
            </Stack>
            <Grid container sx={{ marginBottom: '24px' }} spacing={2}>
              <Grid item xs={4}>
                <WhiteBox sx={{ marginBottom: '16px' }}>
                  <Stack
                    sx={{ marginBottom: '28px' }}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="h2">Members</Typography>
                    <Button
                      variant="contained"
                      size="small"
                      endIcon={<img src={externalLinkIcon} />}
                    >
                      Export
                    </Button>
                  </Stack>
                  <Stack>
                    {membersBookings?.length > 0 ? (
                      membersBookings.map((m) => (
                        <PersonItem key={m.fullName} name={m.fullName} />
                      ))
                    ) : (
                      <Typography variant="body2">No bookings yet</Typography>
                    )}
                  </Stack>
                </WhiteBox>
                <WhiteBox sx={{ marginBottom: '16px' }}>
                  <Stack
                    sx={{ marginBottom: '28px' }}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="h2">Guests</Typography>
                    <Button
                      variant="contained"
                      size="small"
                      endIcon={<img src={externalLinkIcon} />}
                    >
                      Export
                    </Button>
                  </Stack>
                  {guestsBookings?.length > 0 ? (
                    guestsBookings.map((p, i) => (
                      <PersonItem
                        key={i}
                        name={p.fullName}
                        options={[{ label: 'Option', onClick: () => {} }]}
                      />
                    ))
                  ) : (
                    <Typography variant="body2">No bookings yet</Typography>
                  )}
                </WhiteBox>
                <WhiteBox sx={{ marginBottom: '16px' }}>
                  <Stack
                    sx={{ marginBottom: '28px' }}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="h2">Public List</Typography>
                    <Button
                      variant="contained"
                      size="small"
                      endIcon={<img src={externalLinkIcon} />}
                    >
                      Export
                    </Button>
                  </Stack>
                  {publicBookings?.length > 0 ? (
                    publicBookings.map((p, i) => (
                      <PersonItem
                        key={i}
                        name={p.fullName}
                        options={[{ label: 'Option', onClick: () => {} }]}
                      />
                    ))
                  ) : (
                    <Typography variant="body2">No bookings yet</Typography>
                  )}
                </WhiteBox>
              </Grid>
              <Grid item xs={4}>
                <WhiteBox sx={{ marginBottom: '16px' }}>
                  <Typography sx={{ marginBottom: '16px' }} variant="h2">
                    Breakdown
                  </Typography>
                  <BreakdownItem
                    title="Total RSVPs"
                    amount={`${
                      timeSlotData?.bookingDetails?.participants?.length || '0'
                    }`}
                  />
                  <Stack
                    sx={{ marginTop: '12px' }}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <BreakdownItem
                      sx={{ flex: 1, marginRight: '10px' }}
                      title="Members"
                      amount={`${membersBookings?.length}`}
                      dotColor="#1E1E70"
                    />
                    <BreakdownItem
                      sx={{ flex: 1, marginRight: '10px' }}
                      title="Guests"
                      amount={`${guestsBookings?.length}`}
                      dotColor="#E8E8FF"
                    />
                    <BreakdownItem
                      sx={{ flex: 1 }}
                      title="Public"
                      amount={`${publicBookings?.length}`}
                      dotColor="#E6DFD5"
                    />
                  </Stack>
                </WhiteBox>
                <WhiteBox sx={{ marginBottom: '16px' }}>
                  <Typography sx={{ marginBottom: '16px' }} variant="h2">
                    Links
                  </Typography>
                  <CopyClickboardInput
                    sx={{ marginBottom: '12px' }}
                    title="Public Checkout App"
                    inputValue={`${process.env.REACT_APP_CHEKOUT_URL}/event/${experienceId}`}
                  />
                  <CopyClickboardInput
                    sx={{ marginBottom: '12px' }}
                    title="Member App"
                    inputValue={`app://event?id=${experienceId}`}
                  />
                  <CopyClickboardInput
                    title="Dynamic Link"
                    inputValue={`${process.env.REACT_APP_API_URL}/api/mobile/experiences/experience-checkout-link?eventId=${experienceId}&checkoutRedirect=${process.env.REACT_APP_CHEKOUT_URL}/event/${experienceId}`}
                  />
                </WhiteBox>
              </Grid>
              <Grid item xs={4}>
                <WhiteBox sx={{ marginBottom: '16px' }}>
                  <Button
                    onClick={() => navigate(`/experiences/edit/${experienceId}`)}
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginBottom: '16px' }}
                  >
                    EDIT
                  </Button>
                  <Button
                    onClick={onExperienceDelete}
                    variant='outlined'
                    color='error'
                    fullWidth
                  >
                    DELETE
                  </Button>
                </WhiteBox>
                <ExperiencePreview
                  imageUrl={experience.what.imageUrl}
                  name={experience.what.title}
                  description={experience.what.description}
                  isFree={experience.isFree}
                  time={!isMultiDay ? activeTimeSlot?.label || '' : getMultiDate()}
                  location={selectedPlace?.address || ''}
                  externalUrl={experience.where.streamingLink || ''}
                  memberPrice={pricing?.private ? `${pricing.private / 100}` : ''}
                  publicPrice={pricing?.public ? `${pricing.public / 100}` : ''}
                  currency={
                    selectedPlace
                      ? getSymbolFromCurrency(selectedPlace.city.country.currency)
                      : ''
                  }
                  isPublicPriceVisible={
                    experience.who.accessType === AccessTypeEnum.PUBLIC
                  }
                />
              </Grid>
            </Grid>
          </>
        )}
      </>
      <Modal
        open={isModalVisible}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Stack sx={style}>
          <Stack
            sx={{ marginBottom: '12px' }}
            direction={'row'}
            textAlign={'center'}
          >
            <Typography variant="body1">
              {hasBookings ? HAS_BOOKINGS_DELETE_TITLE : DELETE_TITLE}
            </Typography>
          </Stack>
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Button
              onClick={() => setIsModalVisible(false)}
              sx={{
                marginTop: '24px',
                color: '#fff',
                maxWidth: '150px',
              }}
              variant="contained"
              color="error"
              fullWidth
            >
              CANCEL
            </Button>
            <Button
              onClick={handleDeleteExperience}
              sx={{
                marginTop: '24px',
                color: '#fff',
                maxWidth: '150px',
              }}
              variant="contained"
              color="success"
              fullWidth
            >
              CONFIRM
            </Button>
          </Stack>
        </Stack>
      </Modal>
    </Page>
  );
};

export default ExperienceDetails;
