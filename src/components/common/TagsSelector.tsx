import React from 'react';
import styled from '@emotion/styled';
import { CustomSelect } from 'components';
import { SelectOptionType } from 'components/common/CustomSelect';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar, { avatarClasses } from '@mui/material/Avatar';
import { closeIcon } from 'assets/svg';

type Props = {
  options: SelectOptionType[];
  name: string;
  label: string;
  formik: any;
  fullWidth?: boolean;
  className?: string;
  id?: string;
};

export const StyledDeleteIcon = styled(Avatar)(() => ({
  [`&.${avatarClasses.root}`]: {
    width: '10px',
    height: '10px',
    marginLeft: '14px',
    cursor: 'pointer',
    transition: 'all ease-in 0.2s',
    '&:hover': {
      transform: 'rotate(180deg)',
    },
  },
}));

const TagsSelector: React.FC<Props> = ({
  options,
  name,
  label,
  formik,
  fullWidth = true,
  className = '',
  id = '',
}) => {
  const selectedTags: string[] = formik.values[name];

  const handleRemoveTag = (tag: string) => {
    const result = selectedTags.filter((e) => e !== tag);
    formik.setFieldValue(name, result);
  };

  const findTagLabel = (value: string) => {
    return options.find((e) => e.value === value)?.label;
  };

  return (
    <Stack width="100%">
      <CustomSelect
        fullWidth={fullWidth}
        className={className}
        id={id}
        name={name}
        label={label}
        options={options}
        value={selectedTags}
        onChange={formik.handleChange}
        error={formik.touched[name] && Boolean(formik.errors[name])}
        helperText={formik.touched[name] && formik.errors[name]}
        multiple
      />
      <Stack direction="row" flexWrap="wrap" marginTop={3}>
        {selectedTags.length
          ? selectedTags.map((tag) => (
              <Stack
                key={tag}
                sx={{ backgroundColor: '#FBFBFF' }}
                borderRadius="11px"
                padding="5px 11px"
                direction="row"
                alignItems="center"
                margin="0 8px 8px 0"
              >
                <Typography
                  sx={{ fontWeight: '400', fontSize: '12px' }}
                  variant="body1"
                  component="p"
                >
                  {findTagLabel(tag)}
                </Typography>
                <StyledDeleteIcon
                  src={closeIcon}
                  alt="remove tag"
                  title="remove tag"
                  onClick={() => handleRemoveTag(tag)}
                />
              </Stack>
            ))
          : null}
      </Stack>
    </Stack>
  );
};

export default TagsSelector;
