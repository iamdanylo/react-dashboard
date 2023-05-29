import { FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Status } from 'models/member';

interface Props {
  status: Status | null;
  className?: string;
}

const StatusBadge: FC<Props> = ({ className, status }) => {
  const customClassName = className ?? '';
  const label = status?.replace('_', ' ');
  return (
    <Box className={`status-badge ${status} ${customClassName}`}>
      <Typography className="status-badge-label" variant="body2">
        {label || ''}
      </Typography>
    </Box>
  );
};

export default StatusBadge;
