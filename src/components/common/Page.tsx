import { FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { arrowLeftIcon } from 'assets/svg';

interface Props {
  onBackClick?: () => void;
  title?: string;
  className?: string;
  children: any;
};

const Page: FC<Props> = ({ onBackClick, title, className, children }) => {
  const customClassName = className ?? '';
  return (
    <Box className={`page ${customClassName}`}>
      <Box className="page-header">
        {title && !onBackClick && <Typography variant='h1' className="page-title">{title}</Typography>}
        {onBackClick && (
          <Box onClick={onBackClick} className="page-back-btn">
            <img src={arrowLeftIcon} alt="" className="back-icon" />
            <Typography className='back-text' variant='body1'>Back</Typography>
          </Box>
        )}
      </Box>
      <Box className="page-content">
        {children}
      </Box>
    </Box>
  );
};

export default Page;
