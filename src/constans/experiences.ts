import { AccessTypeEnum, AccessibilityTypeEnum, OperatorEnum } from "models/experiences";

export const experiencesTagsOptions = [
  {
    value: 'music',
    label: 'MUSIC',
  },
  {
    value: 'wellness',
    label: 'WELLNESS',
  },
  {
    value: 'spirituality',
    label: 'SPIRITUALITY',
  },
  {
    value: 'food',
    label: 'FOOD',
  },
  {
    value: 'growth',
    label: 'GROWTH',
  },
  {
    value: 'fitness',
    label: 'FITNESS',
  },
  {
    value: 'dinner',
    label: 'DINNER',
  },
  {
    value: 'trip',
    label: 'TRIP',
  },
  {
    value: 'cultural',
    label: 'CULTURAL',
  },
  {
    value: 'drinks',
    label: 'DRINKS',
  },
  {
    value: 'field trip',
    label: 'FIELD TRIP',
  },
  {
    value: 'digital',
    label: 'DIGITAL',
  },
];

export const accessibilityOptions = [
  { value: AccessibilityTypeEnum.HYBRID, label: 'Hybrid' },
  { value: AccessibilityTypeEnum.IN_PERSON, label: 'In person' },
  { value: AccessibilityTypeEnum.TRIP, label: 'Trip' },
  { value: AccessibilityTypeEnum.VIRTUAL, label: 'Virtual' },
];

export const accessTypeOptions = [
  { value: AccessTypeEnum.PRIVATE, label: 'Members & guests' },
  { value: AccessTypeEnum.PUBLIC, label: 'Public' },
];

export const operatorsOptions = [
  { value: OperatorEnum.COMPANY, label: 'Company' },
  { value: OperatorEnum.PARTNER, label: 'Partner' },
];