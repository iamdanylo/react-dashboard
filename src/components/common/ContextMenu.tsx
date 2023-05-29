import { FC, useState } from 'react';
import Menu from '@mui/material/Menu';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export type ContextMenuOption = {
  label: string;
  onClick: () => void;
};

type Props = {
  options: ContextMenuOption[];
};

const ContextMenu: FC<Props> = ({ options }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onOptClick = (opt: ContextMenuOption) => {
    opt.onClick();
    handleClose();
  };

  return (
    <Box>
      <Box className="context-menu-button" id="context-menu-button" onClick={handleClick}>
        <Box className="dot"></Box>
        <Box className="dot"></Box>
        <Box className="dot"></Box>
      </Box>
      <Menu
        MenuListProps={{
          'aria-labelledby': 'context-menu-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        className="context-menu"
      >
        {options?.length > 0 &&
          options?.map((opt) => (
            <Box
              key={opt.label}
              className="context-menu-item"
              onClick={(e) => onOptClick(opt)}
            >
              <Typography variant="body2" className="context-menu-label">{opt.label}</Typography>
            </Box>
          ))}
      </Menu>
    </Box>
  );
};

export default ContextMenu;
