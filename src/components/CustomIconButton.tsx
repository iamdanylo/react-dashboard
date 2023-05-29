import { FC } from 'react';
import { closeIcon } from 'assets/svg';
import { plusIcon } from 'assets/svg';
import IconButton from '@mui/material/IconButton';

type ButtonType = 'add' | 'remove';

interface Props {
  className?: string;
  type: ButtonType;
  onClick: () => void;
  disabled?: boolean;
}

const removeConfig = {
  bgColor: 'rgba(252, 228, 227, 0.4)',
  icon: closeIcon,
};

const addConfig = {
  bgColor: 'rgba(193, 242, 182, 0.4)',
  icon: plusIcon,
};

const getTypeConfig = (type: ButtonType) => {
  switch (type) {
    case 'add':
      return addConfig;
    case 'remove':
      return removeConfig;
    default:
      return addConfig;
  }
};

const CustomIconButton: FC<Props> = ({ className, type, onClick, disabled }) => {
  const customClassName = className ?? '';

  const config = getTypeConfig(type);

  return (
    <IconButton
      onClick={onClick}
      className={`${customClassName}`}
      sx={{
        padding: '14px',
        backgroundColor: config.bgColor,
        minWidth: 'auto',
        borderRadius: '11px',
      }}
      disabled={disabled}
    >
      <img src={config.icon} alt="btn-icon" />
    </IconButton>
  );
};

export default CustomIconButton;
