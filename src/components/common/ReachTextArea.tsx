import { FC } from 'react';
import Box from '@mui/material/Box';
import ReactQuill from 'react-quill';
import { SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

type Props = {
  value: string;
  onChange: (value: string) => void;
  sx?: SxProps<Theme>;
  hasError?: boolean;
  errorText?: string;
  placeholder?: string;
};

const ReachTextArea: FC<Props> = ({
  value,
  onChange,
  sx,
  hasError,
  errorText,
  placeholder,
}) => {
  return (
    <Box className={`reach-text-wrap ${hasError ? 'error' : ''}`} sx={sx}>
      <ReactQuill
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={{
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
          ],
        }}
      />
      {hasError && (
        <Typography sx={{ margin: '4px 14px 0 14px' }} color="error" variant="caption">
          {errorText || ''}
        </Typography>
      )}
    </Box>
  );
};

export default ReachTextArea;
