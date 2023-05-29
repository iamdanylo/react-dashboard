import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';
import { FC } from 'react';
import parse from 'html-react-parser';

type Props = {
  html: string;
  sx?: SxProps<Theme>;
};

const RichTextRenderer: FC<Props> = ({ html, sx }) => {
  const plainText = parse(html);

  return (
    <Box sx={sx} className='reach-text-renderer'>
      {plainText || ''}
    </Box>
  );
};

export default RichTextRenderer;
