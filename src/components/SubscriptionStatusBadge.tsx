import { FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SubscriptionStatus } from "models/subscription";


interface Props {
  status: SubscriptionStatus | null;
  className?: string;
}

const SubscriptionStatusBadge: FC<Props> = ({ className, status }) => {
  const customClassName = className ?? '';
  const label = status?.replace('_', ' ');
  return (
    <Box className={`subscription-status-badge ${status} ${customClassName}`}>
      <Typography className="status-badge-label" variant="body2">
        {label || ''}
      </Typography>
    </Box>
  );
};

export default SubscriptionStatusBadge;
