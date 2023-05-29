import { useAppDispatch, useAppSelector } from 'app/hooks';
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
  ExperiencePricing,
  PricingTypeEnum,
  OperatorEnum,
} from 'models/experiences';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import theme from 'theme';
import moment from 'moment-timezone';
import { DateType, CreateExperienceRequest } from 'types/experiences';
import { allPacesSelector } from 'redux/selectors/places';
import { placesActions } from 'redux/reducers/places';
import { urlReg } from 'utils/helpers/regex';
import { isValidFileType } from 'constans/files';
import getSymbolFromCurrency from 'currency-symbol-map';
import { experiencesActions } from 'redux/reducers/experiences';
import { convertFileToBlob } from 'utils/helpers/filesHelper';
import InputAdornment from '@mui/material/InputAdornment';
import { accessTypeOptions, accessibilityOptions, experiencesTagsOptions, operatorsOptions } from 'constans/experiences';
import { convertMultiDate, convertStandartDate, createMultiDate, createStandartDate, createTimeSlot } from 'utils/helpers/experiences';
import { experiencesLoadingSelector } from 'redux/selectors/experiences';

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
  imageUrl: File | null;
  guestsPerMember: string;
  operator: OperatorEnum;
}

const validationSchema = yup.object().shape({
  accessibilityType: yup.string().required('Required'),
  place: yup.string().required('Required'),
  addressDetails: yup.string().required('Required'),
  streamingLink: yup.string().when('accessibilityType', {
    is: AccessibilityTypeEnum.HYBRID || AccessibilityTypeEnum.VIRTUAL,
    then: () =>
      yup.string().matches(urlReg, 'URL is not valid').required('Required'),
  }),
  capacityLimit: yup.number()
    .required('Required')
    .integer('Capacity limit should be whole number')
    .moreThan(0)
    .min(1),
  guestsPerMember: yup.number()
    .required('Required')
    .integer('Guests limit should be whole number')
    .moreThan(0)
    .min(1)
    .lessThan(yup.ref('capacityLimit'), 'Guests limit should be less than Capacity Limit'),
  operator: yup.string().required('Required'),
  accessType: yup.string().required('Required'),
  recurringType: yup.string().required('Required'),
  name: yup.string().max(50).required('Required'),
  description: yup.string().required('Required'),
  tags: yup.array().min(1, 'Required'),
  isFree: yup.boolean(),
  memberPrice: yup.number().when('isFree', {
    is: false,
    then: () => yup.number().positive()
    .required('Required')
    .integer('The price should be whole number')
    .label('Member price')
    .min(1)
  }),
  publicPrice: yup.number().when(['accessType', 'isFree'], {
    is: (accessType: AccessTypeEnum, isFree: boolean) =>
      accessType === AccessTypeEnum.PUBLIC && !isFree,
    then: () => yup.number().positive()
    .required('Required')
    .integer('The price should be whole number')
    .label('Public price')
    .min(1),
  }),
  imageUrl: yup
    .mixed()
    .required('Experience image is required')
    .test(
      'is-valid-type',
      'Not a valid image type',
      // @ts-ignore
      (file) => isValidFileType(file?.name, 'image')
    )
    // @ts-ignore
    .test('fileSize', 'The file size should be less then 20 Mb', (file: File) => {
      return file && file.size <= 20000000; // 20 Mb limit
    }),
});

const CreateExperience: React.FC = () => {
  const [stardardDates, setStandardDates] = useState([createStandartDate()]);
  const [multiDates, setMultiDates] = useState(createMultiDate());
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [datesError, setDatesError] = useState<string | null>(null);
  const [status, setStatus] = useState<ExperienceStatusEnum | null>(null);

  const dispatch = useAppDispatch();
  const places = useAppSelector(allPacesSelector);
  const loading = useAppSelector(experiencesLoadingSelector);

  const handleSubmit = async (values: ExperiencesValues): Promise<void> => {
    if (!status || loading) return;
    const dateValidation = validateRecurringData();
    if (!dateValidation?.isValid) {
      setDatesError(dateValidation.message);
      return;
    }

    let imageBase64 = '';
    if (values.imageUrl) {
      imageBase64 = await convertFileToBlob(values.imageUrl);
    }

    let data: CreateExperienceRequest = {
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
        imageUrl: imageBase64,
      },
      when: {
        recurringType: values.recurringType as RecurringTypeEnum,
        daySlots: values.recurringType === RecurringTypeEnum.SINGLE ? convertStandartDate(stardardDates) : convertMultiDate(multiDates),
      },
      pricing: getPricing(),
      status: status,
      isFree: values.isFree,
    };

    if ((values.accessibilityType === AccessibilityTypeEnum.VIRTUAL || values.accessibilityType === AccessibilityTypeEnum.HYBRID) && data.where)  {
      data.where.streamingLink = values.streamingLink;
    }

    dispatch(experiencesActions.createExperience(data));
  };

  const formik = useFormik({
    initialValues: {
      accessibilityType: null,
      place: '',
      addressDetails: '',
      streamingLink: '',
      capacityLimit: '',
      accessType: null,
      recurringType: null,
      name: '',
      description: '',
      tags: [],
      isFree: false,
      pricingTitle: PricingTypeEnum.STANDARD,
      memberPrice: '',
      publicPrice: '',
      imageUrl: null,
      guestsPerMember: '',
      operator: OperatorEnum.COMPANY,
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
    validateOnBlur: true,
    enableReinitialize: true,
  });

  const selectedPlace = useMemo(() => places.find((p) => p._id === formik.values.place), [places, formik.values.place]);
  const tzNowDate = useMemo(() => moment.tz(moment(), selectedPlace?.city?.timeZone || ''), [formik.values.place]);

  useEffect(() => {
    return () => {
      formik.resetForm();
      resetState();
    }
  }, []);

  const resetState = () => {
    setStandardDates([createStandartDate()]);
    setMultiDates(createMultiDate());
    setStatus(null);
    setUploadedFile(null);
  };

  const getPricing = (): ExperiencePricing[] | [] => {
    if (formik.values.isFree) return [];

    if (formik.values.accessType === AccessTypeEnum.PRIVATE) {
      return [{ type: formik.values.pricingTitle, private: parseInt(formik.values.memberPrice, 10) * 100}]
    } else {
    return [{ type: formik.values.pricingTitle, private: parseInt(formik.values.memberPrice, 10) * 100, public: parseInt(formik.values.publicPrice, 10) * 100}]
    }
  };

  useEffect(() => {
    if (!places.length) {
      dispatch(placesActions.getPlaces());
    }
  }, [dispatch, places]);

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
    if (!stardardDates?.length)
      return {
        isValid: false,
        message: 'Date is required',
      };

    const isInvalid = stardardDates.some((d) => {
      if (!d.date) return true;

      return d.times.some(
        (t, i) =>
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
    } else if (multiDates.endDate.isBefore(multiDates.startDate) || multiDates.startDate.isBefore(moment().startOf('day'))) {
      return {
        isValid: false,
        message: 'Invalid recurring',
      };
    }
    return { isValid: true, message: '' };
  };

  const addStandartSlot = () => {
    setStandardDates([...stardardDates, createStandartDate()]);
  };

  const addStandardTime = (dateId: string) => {
    const dates = [...stardardDates];
    const date = dates.find((d) => d.id === dateId);
    if (!date) return;
    date.times.push(createTimeSlot(date?.date));
    setStandardDates(dates);
  };

  const removeStandardDate = (dateId: string) => {
    if (datesError) setDatesError(null);
    const dates = [...stardardDates];
    const dateIndex = dates.findIndex((d) => d.id === dateId);
    dates.splice(dateIndex, 1);
    setStandardDates(dates);
  };

  const removeStandardTime = (dateId: string, timeId: string) => {
    const dates = [...stardardDates];
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
    const dates = [...stardardDates];
    const dateSlot = dates.find((d) => d.id === dateId);
    if (!dateSlot) return;
    dateSlot.date = date;

    dateSlot.times.forEach(t => {
      t.startTime = moment(dateSlot.date).set({ hours: t?.startTime?.get('hours'), minutes: t?.startTime?.get('minutes') })
      t.endTime = moment(dateSlot.date).set({ hours: t?.endTime?.get('hours') || 1, minutes: t?.endTime?.get('minutes') })
    })

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
    const dates = [...stardardDates];
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

  const handleMultiDateChange = (
    date: DateType,
    type: 'startDate' | 'endDate'
  ) => {
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

  const handleUploadImage = (file: File | null) => {
    if (file) {
      setUploadedFile(file);
    } else {
      setUploadedFile(null);
    }

    formik.setFieldValue('imageUrl', file);
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
    const isMulti =
      formik.values.accessibilityType === AccessibilityTypeEnum.TRIP;
    if (isMulti && multiDates?.startDate && multiDates?.endDate) {
      return `${moment(multiDates?.startDate).format('LL')} - ${moment(
        multiDates?.endDate
      ).format('LL')}`;
    }

    if (!isMulti && stardardDates[0]?.date) {
      return moment(stardardDates[0]?.times[0].startTime).format('ddd, DD MMMM [at] HH:mm');
    }
  }, [formik.values.accessibilityType, multiDates, stardardDates]);

  const currencySymbol = !!selectedPlace?.city?.country?.currency ? getSymbolFromCurrency(selectedPlace.city.country.currency.toUpperCase()) : '$';
  const isStreamingLinkAvailable =
  formik.values.accessibilityType === AccessibilityTypeEnum.VIRTUAL ||
  formik.values.accessibilityType === AccessibilityTypeEnum.HYBRID;

  return (
    <Page
      title='Create experience'
      className="experience-profile-page"
    >
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
                    formik.touched.accessibilityType &&
                    formik.errors.accessibilityType
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
                    formik.touched.imageUrl && Boolean(formik.errors.imageUrl)
                  }
                  errorText={formik.errors.imageUrl}
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
                  error={
                    formik.touched.operator &&
                    Boolean(formik.errors.operator)
                  }
                  helperText={
                    formik.touched.operator && formik.errors.operator
                  }
                />
                <FormikInput
                  className="experience-item"
                  formik={formik}
                  name="capacityLimit"
                  label="Capacity limit"
                  type='number'
                />
                <CustomSelect
                  className="experience-item"
                  name="accessType"
                  label="Access type"
                  options={accessTypeOptions}
                  value={formik.values.accessType || ''}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.accessType &&
                    Boolean(formik.errors.accessType)
                  }
                  helperText={
                    formik.touched.accessType && formik.errors.accessType
                  }
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
                          startAdornment: <InputAdornment disableTypography sx={{
                            color: theme.palette.custom.main,
                          }} position="start">{currencySymbol}</InputAdornment>,
                        }}
                        label=''
                      />
                    </Stack>
                    {formik.values.accessType ===
                      AccessTypeEnum.PUBLIC && (
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
                          label=''
                          inputProps={{
                            startAdornment: <InputAdornment disableTypography sx={{
                              color: theme.palette.custom.main,
                            }} position="start">{currencySymbol}</InputAdornment>,
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
                border: !!datesError
                  ? `1px solid ${theme.palette.error.main}`
                  : 'none',
                marginBottom: '12px',
              }}
            >
              <Stack sx={{ marginBottom: '24px' }} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                <Typography variant="h2">
                  When
                </Typography>
                {selectedPlace && tzNowDate && <Typography
                    variant="subtitle2"
                  >
                    Chosen place's current time: {tzNowDate .format('YYYY-MM-DD HH:mm')}
                  </Typography>
                }
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
                {formik.values.accessibilityType ==
                  AccessibilityTypeEnum.TRIP && (
                  <>
                    <Stack
                      sx={{ marginBottom: '24px' }}
                      gap={1}
                      direction={'row'}
                    >
                      <CustomDatePicker
                        label="Start date"
                        disablePast
                        value={multiDates.startDate}
                        onChange={(val) =>
                          handleMultiDateChange(val, 'startDate')
                        }
                      />
                      <CustomDatePicker
                        label="End date"
                        disablePast
                        value={multiDates.endDate}
                        minDate={moment(multiDates.startDate).add(1, 'day')}
                        onChange={(val) =>
                          handleMultiDateChange(val, 'endDate')
                        }
                      />
                    </Stack>
                  </>
                )}
                {formik.values.accessibilityType !=
                  AccessibilityTypeEnum.TRIP &&
                  stardardDates.map((d, dateIndex) => (
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
                          onChange={(date) =>
                            handleStandartDateChange(date, d.id)
                          }
                          disablePast
                          minDate={tzNowDate}
                          sx={{ flex: 1 }}
                        />
                        <CustomIconButton
                          disabled={
                            stardardDates?.length <= 1 && dateIndex == 0
                          }
                          type="remove"
                          onClick={() => removeStandardDate(d.id)}
                        />
                        <CustomIconButton
                          type="add"
                          onClick={addStandartSlot}
                        />
                      </Stack>
                      {d?.times?.map((time, timeIndex) => (
                        <TimeSlot
                          key={time.id}
                          disabled={!d?.date}
                          sx={{ marginBottom: '14px' }}
                          disableRemoveBtn={
                            d?.times?.length <= 1 && timeIndex == 0
                          }
                          startValue={
                            time.startTime && d?.date
                              ? moment(d.date).set({ hours: time.startTime.get('hours'), minutes: time.startTime.get('minutes') })
                              : null
                          }
                          endValue={
                            time.endTime && d?.date
                              ? moment(d.date).set({ hours: time.endTime.get('hours'), minutes: time.endTime.get('minutes') })
                              : null
                          }
                          minStartTime={
                            d?.date && d.date.isSame(tzNowDate, 'date')
                              ? tzNowDate
                              : moment(d.date).set({
                                  hours: 0,
                                  minutes: 0,
                                })
                          }
                          minEndTime={
                            d.date?.isSame(tzNowDate, 'date')
                              ? moment(tzNowDate).add(1, 'hour')
                              : moment(d.date).set({
                                  hours: 1,
                                  minutes: 0,
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
                            handleStandartTimeChange(
                              endValue,
                              d.id,
                              time.id,
                              'endTime'
                            )
                          }
                          onAddClick={() => addStandardTime(d.id)}
                          onRemoveClick={() =>
                            removeStandardTime(d.id, time.id)
                          }
                        />
                        ))}
                    </Stack>
                  ))}
              </Stack>
            </WhiteBox>
          </Grid>
          <Grid item xs={4}>
            <ExperiencePreview
              imageUrl={uploadedFile ? window.URL.createObjectURL(uploadedFile) : null}
              name={formik.values.name}
              description={formik.values.description}
              isFree={formik.values.isFree}
              time={selectedDate || 'Experience date'}
              location={selectedPlace?.address || 'Location'}
              externalUrl={isStreamingLinkAvailable ? formik.values.streamingLink : undefined}
              memberPrice={formik.values.memberPrice}
              publicPrice={formik.values.publicPrice}
              currency={currencySymbol}
              isPublicPriceVisible={
                formik.values.accessType === AccessTypeEnum.PUBLIC
              }
            />
            <WhiteBox margin="0 0 12px 0">
              <Button
                variant="outlined"
                color="custom"
                fullWidth
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
    </Page>
  );
};

export default CreateExperience;
