import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import {
  CustomSelect,
  FormikInput,
  Page,
  WhiteBox,
  TagsSelector,
  ExperiencePreview,
  FileUploader,
  CustomDatePicker,
  TimeSlot,
  CustomIconButton,
  ReactLoader,
  ReachTextArea,
} from 'components';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {
  AccessibilityTypeEnum,
  AccessTypeEnum,
  RecurringTypeEnum,
  ExperienceStatusEnum,
  MultiDaySlot,
  StandardDaySlot,
  ExperiencePricing,
  PricingTypeEnum,
  OperatorEnum,
} from 'models/experiences';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import theme from 'theme';
import moment from 'moment-timezone';
import { DateType, StandardDateType, UpdateExperienceDetailedType } from 'types/experiences';
import { allPacesSelector } from 'redux/selectors/places';
import { placesActions } from 'redux/reducers/places';
import { urlReg } from 'utils/helpers/regex';
import { isValidFileType } from 'constans/files';
import getSymbolFromCurrency from 'currency-symbol-map';
import { experiencesActions } from 'redux/reducers/experiences';
import { convertFileToBlob } from 'utils/helpers/filesHelper';
import InputAdornment from '@mui/material/InputAdornment';
import {
  accessTypeOptions,
  accessibilityOptions,
  experiencesTagsOptions,
  operatorsOptions,
} from 'constans/experiences';
import {
  convertMultiDate,
  convertStandartDate,
  createMultiDate,
  createStandartDate,
  createTimeSlot,
  getRandomId,
} from 'utils/helpers/experiences';
import { selectedExperienceSelector } from 'redux/selectors/experiences';
import { isPastTimeSlot } from 'utils/helpers/dateHelper';
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

interface ExperiencesValues {
  accessibilityType: AccessibilityTypeEnum | null;
  place: string;
  addressDetails: string;
  streamingLink: string;
  capacityLimit: string;
  accessType: AccessTypeEnum | null;
  recurringType: RecurringTypeEnum | null;
  name: string;
  description: string;
  tags: string[];
  isFree: boolean;
  pricingTitle: PricingTypeEnum;
  memberPrice: string;
  publicPrice: string;
  imageUrl: string;
  guestsPerMember: string;
  operator: OperatorEnum;
}

const validationSchema = yup.object().shape({
  accessibilityType: yup.string().required('Required'),
  place: yup.string().required('Required'),
  addressDetails: yup.string().required('Required'),
  streamingLink: yup.string().when('accessibilityType', {
    is: AccessibilityTypeEnum.HYBRID || AccessibilityTypeEnum.VIRTUAL,
    then: () => yup.string().matches(urlReg, 'URL is not valid').required('Required'),
  }),
  capacityLimit: yup
    .number()
    .required('Required')
    .integer('Capacity limit should be whole number')
    .moreThan(0)
    .min(1),
  guestsPerMember: yup
    .number()
    .required('Required')
    .integer('Guests limit should be whole number')
    .moreThan(0)
    .min(1)
    .lessThan(
      yup.ref('capacityLimit'),
      'Guests limit should be less than Capacity Limit'
    ),
  operator: yup.string().required('Required'),
  accessType: yup.string().required('Required'),
  recurringType: yup.string().required('Required'),
  name: yup.string().max(50).required('Required'),
  description: yup.string().required('Required'),
  tags: yup.array().min(1, 'Required'),
  isFree: yup.boolean(),
  memberPrice: yup.number().when('isFree', {
    is: false,
    then: () =>
      yup
        .number()
        .positive()
        .required('Required')
        .integer('The price should be whole number')
        .label('Member price')
        .min(1),
  }),
  publicPrice: yup.number().when(['accessType', 'isFree'], {
    is: (accessType: AccessTypeEnum, isFree: boolean) =>
      accessType === AccessTypeEnum.PUBLIC && !isFree,
    then: () =>
      yup
        .number()
        .positive()
        .required('Required')
        .integer('The price should be whole number')
        .label('Public price')
        .min(1),
  }),
  imageUrl: yup.string().required('Required'),
});

type QueryParams = {
  experienceId?: string;
};

const EditExperience: React.FC = () => {
  const [standardDates, setStandardDates] = useState([createStandartDate()]);
  const [multiDates, setMultiDates] = useState(createMultiDate());
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [datesError, setDatesError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [status, setStatus] = useState<ExperienceStatusEnum | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const experience = useAppSelector(selectedExperienceSelector);
  const { experienceId } = useParams<QueryParams>();

  const dispatch = useAppDispatch();
  const places = useAppSelector(allPacesSelector);

  useEffect(() => {
    if (experienceId) {
      dispatch(experiencesActions.getExperienceById({ id: experienceId }));
    }

    return () => {
      dispatch(experiencesActions.clearSelectedExperience());
    };
  }, [dispatch, experienceId]);

  useEffect(() => {
    if (!places.length) {
      dispatch(placesActions.getPlaces());
    }
  }, [dispatch, places]);

  const getBookedSlotsIds = (): string[] => {
    if (!experience) return [];
    if (experience?.when?.recurringType === RecurringTypeEnum.MULTI_DAY) {
      const slot = experience?.when?.daySlots as MultiDaySlot;
      if (!slot._id) return [];
      return [slot._id]
    } else {
      const slots = experience?.when?.daySlots as StandardDaySlot[];
      const bookedSlots = slots.flatMap(d => d.timeSlots.filter(t => t?.bookingsAmount && t.bookingsAmount > 0));
      // @ts-ignore
      return bookedSlots.map(slot => slot._id);
    }
  };

  const bookedSlotsIds = useMemo(() => getBookedSlotsIds(), [experience]);

  const generateExperienceData = () => {
    const values = formik.values;
    let data: UpdateExperienceDetailedType = {
      who: {
        capacityLimit: parseInt(values.capacityLimit, 10),
        accessType: values.accessType as AccessTypeEnum,
        guestsPerMember: parseInt(values.guestsPerMember, 10),
        operator: values.operator,
      },
      where: {
        place: values.place,
        accessibilityType: values.accessibilityType as AccessibilityTypeEnum,
        addressDetails: values.addressDetails,
      },
      what: {
        title: values.name,
        description: values.description,
        tags: values.tags,
        imageUrl: values.imageUrl,
      },
      when: {
        recurringType: values.recurringType as RecurringTypeEnum,
        daySlots:
          values.recurringType === RecurringTypeEnum.SINGLE
            ? convertStandartDate(standardDates)
            : convertMultiDate(multiDates),
      },
      pricing: getPricing(),
      status: status || ExperienceStatusEnum.DRAFT,
      isFree: values.isFree,
    };

    if (
      (values.accessibilityType === AccessibilityTypeEnum.VIRTUAL ||
        values.accessibilityType === AccessibilityTypeEnum.HYBRID) &&
      data.where
    ) {
      data.where.streamingLink = values.streamingLink;
    }

    return data;
  }

  const handleSubmit = (values: ExperiencesValues) => {
    if (!status || !experienceId) return;
    const dateValidation = validateRecurringData();
    if (!dateValidation?.isValid) {
      setDatesError(dateValidation.message);
      return;
    }

    const isRequiredForce = shouldUseForceUpdate();

    if (isRequiredForce) {
      setIsModalVisible(true);
    } else {
      const data = generateExperienceData();
      dispatch(experiencesActions.updateExperience({ id: experienceId, data }));
    }
  };

  const handleForceUpdate = () => {
    if (!experienceId) return;
    const data = generateExperienceData();
    data.forceUpdateTimeSlots = true;
    dispatch(experiencesActions.updateExperience({ id: experienceId, data }));
    setIsModalVisible(false);
  };

  const shouldUseForceUpdate = () => {
    const isStandardType = formik.values.recurringType === RecurringTypeEnum.SINGLE;
    const allIds = isStandardType ? getStandardSlotsIds() : [multiDates?.timeSlotId];
    const shouldUseForceUpdate = !bookedSlotsIds.every(id => allIds.includes(id));
    return shouldUseForceUpdate;
  };

  const getStandardSlotsIds = () => {
    return standardDates.flatMap(d => d.times.map(t => t.timeSlotId));
  };

  const formik = useFormik({
    initialValues: {
      accessibilityType: experience?.where.accessibilityType || null,
      place: experience?.where.place || '',
      addressDetails: experience?.where.addressDetails || '',
      streamingLink: experience?.where.streamingLink || '',
      capacityLimit: experience?.who.capacityLimit.toString() || '',
      accessType: experience?.who.accessType || null,
      recurringType: experience?.when.recurringType || null,
      name: experience?.what.title || '',
      description: experience?.what.description || '',
      tags: experience?.what.tags || [],
      isFree: experience?.isFree ?? false,
      pricingTitle: experience?.pricing[0]?.type || PricingTypeEnum.STANDARD,
      memberPrice: experience?.pricing[0]?.private
        ? (experience?.pricing[0].private / 100).toString()
        : '',
      publicPrice: experience?.pricing[0]?.public
        ? (experience?.pricing[0].public / 100).toString()
        : '',
      imageUrl: experience?.what.imageUrl || '',
      guestsPerMember: experience?.who?.guestsPerMember
        ? experience?.who?.guestsPerMember.toString()
        : '',
      operator: experience?.who.operator || OperatorEnum.COMPANY,
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
    validateOnBlur: true,
    enableReinitialize: true,
  });

  const selectedPlace = useMemo(
    () => places.find((p) => p._id === formik.values.place),
    [places, formik.values.place]
  );

  useEffect(() => {
    if (!experience || !experienceId || !selectedPlace) return;
    setExperienceDates();
  }, [experience, selectedPlace]);

  const setExperienceDates = () => {
    if (!experience || !selectedPlace) return;

    if (experience.when.recurringType === RecurringTypeEnum.MULTI_DAY) {
      const multi = experience.when.daySlots as MultiDaySlot;
      setMultiDates({
        id: getRandomId(),
        startDate: moment(multi.startDate),
        endDate: moment(multi.endDate),
        timeSlotId: multi._id,
        disabled: isPastTimeSlot({
          startDateTime: multi.startDate,
          endDateTime: multi.endDate,
        }, selectedPlace.city.timeZone),
      });
    } else {
      const slots = experience.when.daySlots as StandardDaySlot[];
      const standardSlots = slots.map((slot) => ({
        id: getRandomId(),
        date: moment.utc(slot.date),
        disabled: slot.timeSlots.every(s => isPastTimeSlot({
          startDateTime: moment.utc(slot.date).add(moment.duration(s.startTime)).toDate(),
          endDateTime: moment.utc(slot.date).add(moment.duration(s.endTime)).toDate(),
        }, selectedPlace.city.timeZone)),
        times: slot.timeSlots.map((time) => ({
          id: getRandomId(),
          startTime: moment.utc(slot.date).add(moment.duration(time.startTime)),
          endTime: moment.utc(slot.date).add(moment.duration(time.endTime)),
          timeSlotId: time._id,
          disabled: isPastTimeSlot({
            startDateTime: moment.utc(slot.date).add(moment.duration(time.startTime)).toDate(),
            endDateTime: moment.utc(slot.date).add(moment.duration(time.endTime)).toDate(),
          }, selectedPlace.city.timeZone),
        })),
      }));
      setStandardDates(standardSlots);
    }
  };

  const tzNowDate = useMemo(
    () => moment.tz(moment(), selectedPlace?.city?.timeZone || ''),
    [selectedPlace]
  );

  const getPricing = (): ExperiencePricing[] | [] => {
    if (formik.values.isFree) return [];

    if (formik.values.accessType === AccessTypeEnum.PRIVATE) {
      return [
        {
          type: formik.values.pricingTitle,
          private: parseInt(formik.values.memberPrice, 10) * 100,
        },
      ];
    } else {
      return [
        {
          type: formik.values.pricingTitle,
          private: parseInt(formik.values.memberPrice, 10) * 100,
          public: parseInt(formik.values.publicPrice, 10) * 100,
        },
      ];
    }
  };

  const validateRecurringData = () => {
    const type = formik.values.recurringType;
    if (!type)
      return {
        isValid: false,
        message: 'Choose the experience type first',
      };

    if (type === RecurringTypeEnum.MULTI_DAY) {
      return validateMultiDates();
    } else {
      return validateStandardDate();
    }
  };

  const validateStandardDate = () => {
    if (datesError) setDatesError(null);
    if (!standardDates?.length)
      return {
        isValid: false,
        message: 'Date is required',
      };
    
    // Deep copy
    const copied = JSON.parse(JSON.stringify(standardDates)) as StandardDateType[];

    const dates = copied.filter(d => !d.disabled);
    dates.forEach(d => {
      d.times = d.times.filter(t => !t.disabled);
    });

    const isInvalid = dates.some((d) => {
      if (!d.date) return true;

      return d.times.some(
        (t, i) =>
          !t.disabled &&
          !t.endTime ||
          !t.startTime ||
          moment(t.endTime).utc(true).isSameOrBefore(moment(t?.startTime).utc(true)) ||
          moment(t.startTime).utc(true).isBefore(moment(tzNowDate).utc(true)) ||
          moment(t.endTime)
            .utc(true)
            .isBefore(moment(tzNowDate).utc(true).add(1, 'hour')) ||
          d.times.some(
            (elem, j) =>
              i !== j &&
              // @ts-ignore
              t?.startTime < elem?.endTime &&
              // @ts-ignore
              t?.endTime > elem?.startTime
          )
      );
    });

    if (isInvalid) {
      return {
        isValid: false,
        message: 'Invalid date/time or there is time slots intersections',
      };
    }

    return { isValid: true, message: '' };
  };

  const validateMultiDates = () => {
    if (!multiDates.startDate || !multiDates.endDate) {
      return {
        isValid: false,
        message: 'Dates period is required',
      };
    }

    if (multiDates.disabled) {
      return { isValid: true, message: '' }
    }
    
    if (
      multiDates.endDate.isBefore(multiDates.startDate) ||
      multiDates.startDate.isBefore(moment().startOf('day'))
    ) {
      return {
        isValid: false,
        message: 'Invalid recurring',
      };
    }
    return { isValid: true, message: '' };
  };

  const addStandartSlot = () => {
    setStandardDates([...standardDates, createStandartDate()]);
  };

  const addStandardTime = (dateId: string) => {
    const dates = [...standardDates];
    const date = dates.find((d) => d.id === dateId);
    if (!date) return;
    date.times.push(createTimeSlot(date?.date));
    setStandardDates(dates);
  };

  const removeStandardDate = (dateId: string) => {
    if (datesError) setDatesError(null);
    const dates = [...standardDates];
    const dateIndex = dates.findIndex((d) => d.id === dateId);
    dates.splice(dateIndex, 1);
    setStandardDates(dates);
  };

  const removeStandardTime = (dateId: string, timeId: string) => {
    const dates = [...standardDates];
    const standart = dates.find((d) => d.id === dateId);
    if (!standart) return;
    if (datesError) setDatesError(null);
    const index = standart.times.findIndex((t) => t.id === timeId);
    standart.times.splice(index, 1);

    setStandardDates(dates);
  };

  const handleStandartDateChange = (date: DateType, dateId: string) => {
    if (!date || !dateId) return;
    if (datesError) setDatesError(null);
    const dates = [...standardDates];
    const dateSlot = dates.find((d) => d.id === dateId);
    if (!dateSlot) return;
    dateSlot.date = date;

    dateSlot.times.forEach((t) => {
      t.startTime = moment(dateSlot.date).set({
        hours: t?.startTime?.get('hours'),
        minutes: t?.startTime?.get('minutes'),
      });
      t.endTime = moment(dateSlot.date).set({
        hours: t?.endTime?.get('hours') || 1,
        minutes: t?.endTime?.get('minutes'),
      });
    });

    setStandardDates(dates);
  };

  const handleStandartTimeChange = (
    time: DateType,
    dateId: string,
    timeId: string,
    type: 'startTime' | 'endTime'
  ) => {
    if (!time || !dateId || !timeId) return;
    if (datesError) setDatesError(null);
    const dates = [...standardDates];
    const dateSlot = dates.find((d) => d.id === dateId);
    if (!dateSlot) return;
    const timeSlot = dateSlot.times.find((t) => t.id === timeId);
    if (!timeSlot) return;
    if (type === 'startTime') {
      if (
        !timeSlot.endTime ||
        (timeSlot.endTime && timeSlot.endTime.isSameOrBefore(time))
      ) {
        timeSlot.endTime = moment(time).add(1, 'hour');
      }
    }
    timeSlot[type] = time;
    setStandardDates(dates);
  };

  const handleMultiDateChange = (date: DateType, type: 'startDate' | 'endDate') => {
    if (!date || !type) return;
    if (datesError) setDatesError(null);
    const dates = { ...multiDates };
    if (type === 'startDate') {
      if (dates.endDate?.isSameOrBefore(date)) {
        dates.endDate = moment(date).add(1, 'days');
      }
    }
    dates[type] = date;
    setMultiDates(dates);
  };

  const onAccessabilityChange = (e: ChangeEvent<any>) => {
    formik.setFieldValue('accessibilityType', e.target.value);
    if (e.target.value === AccessibilityTypeEnum.TRIP) {
      formik.setFieldValue('recurringType', RecurringTypeEnum.MULTI_DAY);
      formik.setFieldValue('guestsPerMember', '1');
    } else {
      formik.setFieldValue('recurringType', RecurringTypeEnum.SINGLE);
    }
  };

  const handleUploadImage = async (file: File | null) => {
    setFileError(null);

    if (file) {
      const isValidType = isValidFileType(file?.name, 'image');
      const isValidSize = file.size <= 20000000;

      if (!isValidType) {
        setFileError('Not a valid image type');
        return;
      }

      if (!isValidSize) {
        setFileError('The file size should be less then 20 Mb');
        return;
      }

      const blob = await convertFileToBlob(file);

      setUploadedFile(file);
      formik.setFieldValue('imageUrl', blob);
    } else {
      setUploadedFile(null);
      formik.setFieldValue('imageUrl', experience?.what.imageUrl);
    }
  };

  const handleIsFreeChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (checked) {
      formik.setFieldValue('guestsPerMember', '1');
    }

    formik.setFieldValue('isFree', checked);
  };

  const placesOptions = useMemo(() => {
    if (!places?.length) return [{ value: '', label: '' }];
    return places.map((p) => ({
      value: p._id,
      label: p.name,
    }));
  }, [places]);

  const selectedDate = useMemo(() => {
    const isMulti = formik.values.accessibilityType === AccessibilityTypeEnum.TRIP;
    if (isMulti && multiDates?.startDate && multiDates?.endDate) {
      return `${moment(multiDates?.startDate).format('LL')} - ${moment(
        multiDates?.endDate
      ).format('LL')}`;
    }

    if (!isMulti && standardDates[0]?.date) {
      return moment(standardDates[0]?.times[0].startTime).format(
        'ddd, DD MMMM [at] HH:mm'
      );
    }
  }, [formik.values.accessibilityType, multiDates, standardDates]);

  const currencySymbol = !!selectedPlace?.city?.country?.currency
    ? getSymbolFromCurrency(selectedPlace.city.country.currency.toUpperCase())
    : '$';
  const isStreamingLinkAvailable =
    formik.values.accessibilityType === AccessibilityTypeEnum.VIRTUAL ||
    formik.values.accessibilityType === AccessibilityTypeEnum.HYBRID;

  return (
    <Page title="Edit experience" className="experience-profile-page">
      {!experience ? (
        <Stack alignItems="center" direction="column" marginTop={2}>
          <ReactLoader />
        </Stack>
      ) : (
        <Stack component="form">
          <Grid container sx={{ marginBottom: '24px' }} spacing={2}>
            <Grid item xs={4}>
              <WhiteBox margin="0 0 12px 0">
                <Typography sx={{ marginBottom: '24px' }} variant="h2">
                  Where
                </Typography>
                <Stack height={'100%'}>
                  <CustomSelect
                    className="experience-item"
                    name="accessibilityType"
                    label="Type"
                    options={accessibilityOptions}
                    value={formik.values.accessibilityType || ''}
                    onChange={onAccessabilityChange}
                    error={
                      formik.touched.accessibilityType &&
                      Boolean(formik.errors.accessibilityType)
                    }
                    helperText={
                      formik.touched.accessibilityType && formik.errors.accessibilityType
                    }
                  />
                  <CustomSelect
                    className="experience-item"
                    name="place"
                    label="Place"
                    options={placesOptions}
                    value={formik.values.place}
                    onChange={formik.handleChange}
                    error={formik.touched.place && Boolean(formik.errors.place)}
                    helperText={formik.touched.place && formik.errors.place}
                  />
                  <TextField
                    className="experience-item"
                    value={selectedPlace?.address || 'Autofilled'}
                    label="Address"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <FormikInput
                    className="experience-item"
                    formik={formik}
                    name="addressDetails"
                    label="Room Number, Floor, Etc."
                  />
                  {isStreamingLinkAvailable && (
                    <FormikInput
                      className="experience-item"
                      formik={formik}
                      name="streamingLink"
                      label="Streaming link"
                    />
                  )}
                </Stack>
              </WhiteBox>
              <WhiteBox margin="0 0 12px 0">
                <Typography sx={{ marginBottom: '24px' }} variant="h2">
                  What
                </Typography>
                <Stack>
                  <FormikInput
                    className="experience-item"
                    formik={formik}
                    name="name"
                    label="Title"
                  />
                  <ReachTextArea
                    placeholder='Description'
                    sx={{marginBottom: '24px'}}
                    value={formik.values.description}
                    onChange={(value) => formik.setFieldValue('description', value)}
                    hasError={
                      formik.touched.description && Boolean(formik.errors.description)
                    }
                    errorText={formik.errors.description}
                  />
                  <TagsSelector
                    name="tags"
                    label="Tags"
                    options={experiencesTagsOptions}
                    formik={formik}
                  />
                  <FileUploader
                    label="UPLOAD IMAGE"
                    onChange={(file) => handleUploadImage(file)}
                    file={uploadedFile}
                    hasError={
                      (formik.touched.imageUrl && Boolean(formik.errors.imageUrl)) ||
                      Boolean(fileError)
                    }
                    errorText={fileError || formik.errors.imageUrl}
                  />
                </Stack>
              </WhiteBox>
            </Grid>
            <Grid item xs={4}>
              <WhiteBox margin="0 0 12px 0">
                <Typography sx={{ marginBottom: '24px' }} variant="h2">
                  Who
                </Typography>
                <Stack>
                  <CustomSelect
                    className="experience-item"
                    name="operator"
                    label="Operator"
                    options={operatorsOptions}
                    value={formik.values.operator || ''}
                    onChange={formik.handleChange}
                    error={formik.touched.operator && Boolean(formik.errors.operator)}
                    helperText={formik.touched.operator && formik.errors.operator}
                  />
                  <FormikInput
                    className="experience-item"
                    formik={formik}
                    name="capacityLimit"
                    label="Capacity limit"
                    type="number"
                  />
                  <CustomSelect
                    className="experience-item"
                    name="accessType"
                    label="Access type"
                    options={accessTypeOptions}
                    value={formik.values.accessType || ''}
                    onChange={formik.handleChange}
                    error={formik.touched.accessType && Boolean(formik.errors.accessType)}
                    helperText={formik.touched.accessType && formik.errors.accessType}
                  />
                {formik.values.accessibilityType !== AccessibilityTypeEnum.TRIP && !formik.values.isFree &&
                  <FormikInput
                    className="experience-item"
                    formik={formik}
                    name="guestsPerMember"
                    label="Guest list capacity per member"
                    type='number'
                  />
                }
                </Stack>
              </WhiteBox>
              <WhiteBox margin="0 0 12px 0">
                <Typography sx={{ marginBottom: '24px' }} variant="h2">
                  Pricing
                </Typography>
                <Stack>
                  <FormControlLabel
                    sx={{
                      marginBottom: '24px',
                    }}
                    control={
                      <Checkbox
                        name="isFree"
                        color="info"
                        onChange={handleIsFreeChange}
                        value={formik.values.isFree}
                        checked={formik.values.isFree}
                      />
                    }
                    label="Free experience"
                  />
                  {!formik.values.isFree && (
                    <Stack>
                      <TextField
                        className="experience-item"
                        value={'Standard'}
                        label="Pricing name"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <Stack
                        direction={'row'}
                        sx={{ marginBottom: '24px' }}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                      >
                        <Typography
                          fontWeight={700}
                          color={theme.palette.custom.main}
                          variant="h5"
                        >
                          Member & Guests
                        </Typography>
                        <FormikInput
                          type="number"
                          className="experience-pricing-item"
                          formik={formik}
                          name="memberPrice"
                          inputProps={{
                            startAdornment: (
                              <InputAdornment
                                disableTypography
                                sx={{
                                  color: theme.palette.custom.main,
                                }}
                                position="start"
                              >
                                {currencySymbol}
                              </InputAdornment>
                            ),
                          }}
                          label=""
                        />
                      </Stack>
                      {formik.values.accessType === AccessTypeEnum.PUBLIC && (
                        <Stack
                          direction={'row'}
                          sx={{ marginBottom: '24px' }}
                          justifyContent={'space-between'}
                          alignItems={'center'}
                        >
                          <Typography
                            fontWeight={700}
                            color={theme.palette.custom.main}
                            variant="h5"
                          >
                            Public
                          </Typography>
                          <FormikInput
                            type="number"
                            className="experience-pricing-item"
                            formik={formik}
                            name="publicPrice"
                            label=""
                            inputProps={{
                              startAdornment: (
                                <InputAdornment
                                  disableTypography
                                  sx={{
                                    color: theme.palette.custom.main,
                                  }}
                                  position="start"
                                >
                                  {currencySymbol}
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Stack>
                      )}
                    </Stack>
                  )}
                </Stack>
              </WhiteBox>
              <WhiteBox
                sx={{
                  border: !!datesError ? `1px solid ${theme.palette.error.main}` : 'none',
                  marginBottom: '12px',
                }}
              >
                <Stack
                  sx={{ marginBottom: '24px' }}
                  direction={'row'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                >
                  <Typography variant="h2">When</Typography>
                  {selectedPlace && tzNowDate && (
                    <Typography variant="subtitle2">
                      Chosen place's current time: {tzNowDate.format('YYYY-MM-DD HH:mm')}
                    </Typography>
                  )}
                </Stack>
                <Stack>
                  {datesError && (
                    <Typography
                      sx={{ margin: '0 14px 14px 14px' }}
                      color="error"
                      variant="caption"
                    >
                      {datesError}
                    </Typography>
                  )}
                  {formik.values.accessibilityType == AccessibilityTypeEnum.TRIP && (
                    <>
                      <Stack sx={{ marginBottom: '24px' }} gap={1} direction={'row'}>
                        <CustomDatePicker
                          label="Start date"
                          disablePast={!multiDates.disabled}
                          value={multiDates.startDate}
                          onChange={(val) => handleMultiDateChange(val, 'startDate')}
                          disabled={multiDates.disabled}
                        />
                        <CustomDatePicker
                          label="End date"
                          disablePast={!multiDates.disabled}
                          value={multiDates.endDate}
                          minDate={moment(multiDates.startDate).add(1, 'day')}
                          onChange={(val) => handleMultiDateChange(val, 'endDate')}
                          disabled={multiDates.disabled}
                        />
                      </Stack>
                    </>
                  )}
                  {formik.values.accessibilityType != AccessibilityTypeEnum.TRIP &&
                    standardDates.map((d, dateIndex) => (
                      <Stack sx={{ marginBottom: '24px' }} key={d.id}>
                        <Stack
                          justifyContent={'space-between'}
                          gap={1}
                          direction={'row'}
                          sx={{ marginBottom: '24px' }}
                        >
                          <CustomDatePicker
                            label="Date"
                            value={d.date}
                            onChange={(date) => handleStandartDateChange(date, d.id)}
                            disablePast={!d.disabled}
                            disabled={d.disabled}
                            minDate={d.disabled ? d.date : moment()}
                            sx={{ flex: 1 }}
                          />
                          <CustomIconButton
                            disabled={standardDates?.length <= 1 && dateIndex == 0 || d.disabled || d?.times.some(t => t.disabled)}
                            type="remove"
                            onClick={() => removeStandardDate(d.id)}
                          />
                          {!d.disabled && <CustomIconButton type="add" onClick={addStandartSlot} />}
                        </Stack>
                        {d?.times?.map((time, timeIndex) => (
                          <TimeSlot
                            key={time.id}
                            disabled={!d?.date || time.disabled}
                            sx={{ marginBottom: '14px' }}
                            disableRemoveBtn={d?.times?.length <= 1 && timeIndex == 0 || time.disabled}
                            startValue={
                              time.startTime && d?.date
                                ? moment(d.date).set({
                                    hours: time.startTime.get('hours'),
                                    minutes: time.startTime.get('minutes'),
                                  })
                                : null
                            }
                            endValue={
                              time.endTime && d?.date
                                ? moment(d.date).set({
                                    hours: time.endTime.get('hours'),
                                    minutes: time.endTime.get('minutes'),
                                  })
                                : null
                            }
                            minStartTime={
                              d?.date && d.date.isSame(tzNowDate, 'date') && !d.disabled && !time.disabled
                                ? tzNowDate
                                : moment(d.date).set({
                                    hours: 0,
                                    minutes: 0,
                                  })
                            }
                            minEndTime={
                              d.date?.isSame(tzNowDate, 'date') && !d.disabled && !time.disabled
                                ? moment(tzNowDate).add(1, 'minute')
                                : moment(d.date).set({
                                    hours: 0,
                                    minutes: 1,
                                  })
                            }
                            onStartChange={(startValue) =>
                              handleStandartTimeChange(
                                startValue,
                                d.id,
                                time.id,
                                'startTime'
                              )
                            }
                            onEndChange={(endValue) =>
                              handleStandartTimeChange(endValue, d.id, time.id, 'endTime')
                            }
                            onAddClick={() => addStandardTime(d.id)}
                            onRemoveClick={() => removeStandardTime(d.id, time.id)}
                            disableAddBtn={time.disabled}
                          />
                        ))}
                      </Stack>
                    ))}
                </Stack>
              </WhiteBox>
            </Grid>
            <Grid item xs={4}>
              <ExperiencePreview
                imageUrl={formik.values.imageUrl}
                name={formik.values.name}
                description={formik.values.description}
                isFree={formik.values.isFree}
                time={selectedDate || 'Experience date'}
                location={selectedPlace?.address || 'Location'}
                externalUrl={
                  isStreamingLinkAvailable ? formik.values.streamingLink : undefined
                }
                memberPrice={formik.values.memberPrice}
                publicPrice={formik.values.publicPrice}
                currency={currencySymbol}
                isPublicPriceVisible={formik.values.accessType === AccessTypeEnum.PUBLIC}
              />
              <WhiteBox margin="0 0 12px 0">
                <Button
                  variant="outlined"
                  color="custom"
                  fullWidth
                  disabled={bookedSlotsIds?.length > 0}
                  sx={{ marginBottom: '24px' }}
                  onClick={() => {
                    setStatus(ExperienceStatusEnum.DRAFT);
                    formik.handleSubmit();
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => {
                    setStatus(ExperienceStatusEnum.PUBLISH);
                    formik.handleSubmit();
                  }}
                >
                  Publish
                </Button>
              </WhiteBox>
            </Grid>
          </Grid>
        </Stack>
      )}
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
            The time slots that you want to modify already have bookings. If you proceed with the modification, the existing bookings will be removed, and all users will receive a refund. Are you sure you want to modify the time slots?
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
              onClick={handleForceUpdate}
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

export default EditExperience;
