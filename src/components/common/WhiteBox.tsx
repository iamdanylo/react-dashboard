import { FC } from 'react';
import Stack from '@mui/material/Stack';
import { SxProps, Theme } from '@mui/material/styles';

interface Props {
  className?: string;
  children: any;
  width?: string;
  height?: string;
  margin?: string;
  sx?: SxProps<Theme>;
}

const WhiteBox: FC<Props> = ({
  className,
  children,
  width = 'auto',
  height = 'auto',
  margin,
  sx,
}) => {
  const customClassName = className ?? '';
  return (
    <Stack
      className={`white-box ${customClassName}`}
      width={width}
      height={height}
      margin={margin}
      sx={sx}
    >
      {children}
    </Stack>
  );
};

export default WhiteBox;
