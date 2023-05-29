import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { RouteType } from 'constans/sideBarRoutes';
import { Link } from 'react-router-dom';

type Props = {
  item: RouteType;
  isActive: boolean;
};

const SidebarItem = ({ item, isActive }: Props) => {
  if (!item) return null;

  return (
    <ListItemButton
      component={Link}
      className={`sidebar-link ${isActive ? 'active' : ''}`}
      to={item.path}
      sx={{
        '&: hover': {
          backgroundColor: isActive ? '#1E1E70' : 'transparent',
        },
        backgroundColor: isActive ? '#1E1E70' : 'transparent',
        borderRadius: '12px',
      }}
    >
      {item?.icon && (
        <img className="sidebar-link-icon" src={item.icon} alt="icon" />
      )}
      <ListItemText
        disableTypography
        primary={
          <Typography
            sx={{ color: isActive ? '#fff' : '#1E1E70' }}
            variant="body2"
          >
            {item.label}
          </Typography>
        }
      />
    </ListItemButton>
  );
};

export default SidebarItem;
