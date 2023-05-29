import List from '@mui/material/List';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import sizeConfigs from './sizeConfig';
import appRoutes from 'constans/sideBarRoutes';
import SidebarItem from './SideBarItem';
import SideBarItemCollapse from './SideBarItemCollapse';
import { useLocation, useNavigate } from 'react-router-dom';
import { logo } from 'assets/svg';
import Toolbar from '@mui/material/Toolbar';
import { logOutIcon } from 'assets/svg/sidebar';
import Typography from '@mui/material/Typography';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <Drawer
      className="sidebar"
      variant="permanent"
      sx={{
        width: sizeConfigs.sidebar.width,
        flexShrink: 0,
        height: '100%',
        '& .MuiDrawer-paper': {
          width: sizeConfigs.sidebar.width,
          boxSizing: 'border-box',
          borderRight: '0px',
        },
      }}
    >
      <Toolbar className="sidebar-logo-wrap">
        <img className="sidebar-logo" src={logo} alt="logo" />
      </Toolbar>
      <Box className="sidebar-nav-wrap">
        <List className="sidebar-links-wrap">
          {appRoutes.map((route) =>
            route.sublinks ? (
              <SideBarItemCollapse
                activeRoute={location.pathname}
                isOpen={route?.sublinks
                  ?.map((s) => s.path)
                  ?.includes(location.pathname) || location.pathname.includes(route.path)}
                item={route}
                key={route.label}
              />
            ) : (
              <SidebarItem
                isActive={route.path === location.pathname}
                item={route}
                key={route.label}
              />
            )
          )}
        </List>
        <Box className="sidebar-logout" onClick={handleLogOut}>
          <img src={logOutIcon} alt="log out" />
          <Typography variant="body2">Log out</Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
