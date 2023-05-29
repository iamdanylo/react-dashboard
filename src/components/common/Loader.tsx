import React, { FC } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import Stack from '@mui/material/Stack';

type Props = {
  color?: string;
  height?: number;
  width?: number;
};

const ReactLoader: FC<Props> = ({
  color = '#4c4ca0',
  height = 150,
  width = 250,
}) => {
  return (
    <Stack width="100%" alignItems="center">
      <ThreeDots color={color} height={width} width={height} />
    </Stack>
  );
};

export default ReactLoader;
