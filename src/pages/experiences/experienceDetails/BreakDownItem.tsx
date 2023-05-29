import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

type BreakdownItemProps = {
  title: string;
  amount: string;
  sx?: SxProps<Theme>;
  dotColor?: string;
};

const BreakdownItem: React.FC<BreakdownItemProps> = ({ title, amount, sx, dotColor }) => {
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      direction="row"
      sx={{
        height: '39px',
        border: '0.5px solid #E8E8FF',
        borderRadius: '8px',
        ...sx,
      }}
    >
      {dotColor && (
        <Box
          sx={{ width: '4px', height: '4px', borderRadius: '100%', bgcolor: dotColor }}
        />
      )}
      <Typography
        sx={{ marginRight: '8px', marginLeft: dotColor ? '8px' : 0 }}
        variant="subtitle2"
      >
        {title}
      </Typography>
      <Typography variant="subtitle1">{amount}</Typography>
    </Stack>
  );
};

export default BreakdownItem;
