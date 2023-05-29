import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ContextMenu from 'components/common/ContextMenu';
import theme from 'theme';

type MenuOption = {
  label: string;
  onClick: () => void;
};

type PersonItemProps = {
  name: string;
  options?: MenuOption[];
};

const PersonItem: React.FC<PersonItemProps> = ({ name, options }) => (
  <Stack
    key={name}
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    sx={{ marginBottom: '16px' }}
  >
    <Stack direction="row" alignItems="center">
      <Box
        sx={{
          borderRadius: '100%',
          width: '8px',
          height: '8px',
          backgroundColor: theme.palette.custom.main,
          marginLeft: '14px',
        }}
      />
      <Typography
        sx={{
          color: theme.palette.custom.main,
          marginLeft: '22px',
          lineHeight: '21px',
        }}
        variant="caption"
      >
        {name ? name : '-'}
      </Typography>
    </Stack>
    {options && options?.length > 0 && <ContextMenu options={options} />}
  </Stack>
);

export default PersonItem;
