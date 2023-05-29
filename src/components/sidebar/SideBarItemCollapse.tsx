import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import { RouteType } from 'constans/sideBarRoutes';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { iconArrow } from 'assets/svg';

type Props = {
  item: RouteType;
  isOpen: boolean;
  activeRoute: string;
};

const SidebarItemCollapse = ({ item, isOpen, activeRoute }: Props) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen, item]);

  if (!item) return null;

  const handleClick = () => {
    if (!item?.sublinks?.length) return;
    navigate(item?.sublinks[0]?.path);
  };

  return (
    <>
      <ListItemButton
        className={`sidebar-link sidebar-link-collapse ${
          isOpen ? 'active' : ''
        }`}
        onClick={handleClick}
        sx={{
          '&: hover': {
            backgroundColor: isOpen ? '#1E1E70' : 'transparent',
          },
          backgroundColor: isOpen ? '#1E1E70' : 'transparent',
          borderRadius: '12px',
        }}
      >
        {item?.icon && <img className="sidebar-link-icon" src={item.icon} />}
        <ListItemText
          disableTypography
          primary={
            <Typography
              sx={{ color: isOpen ? '#fff' : '#1E1E70' }}
              variant="body2"
            >
              {item.label}
            </Typography>
          }
        />
        {open && <img className="sidebar-arrow" src={iconArrow} alt="icon" />}
      </ListItemButton>
      <Collapse in={open} timeout="auto">
        <List className="sidebar-sublinks">
          {item.sublinks?.map((route) => {
            const isActive = activeRoute == route.path;
            return (
              <ListItemButton
                component={Link}
                className="sidebar-sublink"
                key={route.path}
                to={route.path}
                sx={{
                  '&: hover': {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                <ListItemText
                  disableTypography
                  primary={
                    <Typography
                      className={`sidebar-sublink-text ${isActive ? 'active' : ''}`}
                      variant="body2"
                    >
                      {route.label}
                    </Typography>
                  }
                />
              </ListItemButton>
            );
          })}
        </List>
      </Collapse>
    </>
  );
};

export default SidebarItemCollapse;
