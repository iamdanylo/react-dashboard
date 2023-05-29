import { FC, useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { shareIcon } from 'assets/svg';
import Tooltip from '@mui/material/Tooltip';

interface Props {
  title: string;
  inputValue: string;
  sx?: SxProps<Theme>;
}

const CopyClickboardInput: FC<Props> = ({ title, inputValue, sx }) => {
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const handleCopy = async (text: string) => {
    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(text);
    } else {
      // for the older browsers
      document.execCommand('copy', true, text);
    }
  };

  const handleCopyClick = async (copyText: string) => {
    await handleCopy(copyText);
    setIsLinkCopied(true);
    setTimeout(() => {
      setIsLinkCopied(false);
    }, 1500);
  };

  return (
    <Stack sx={sx} direction="row" alignItems="center" justifyContent="space-between">
      <Typography sx={{ fontWeight: 600 }} variant="subtitle2">
        {title}
      </Typography>
      <OutlinedInput
        type={'text'}
        readOnly
        value={inputValue}
        sx={{
          height: '45px',
          fontWeight: 300,
          fontSize: '8px',
          lineHeight: '10px',
          borderRadius: '8px',
        }}
        endAdornment={
          <InputAdornment position="end">
            <Tooltip
              PopperProps={{
                disablePortal: true,
              }}
              open={isLinkCopied}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              placement="top"
              title={'Copied'}
            >
              <IconButton
                aria-label="copy to clickboard"
                onClick={() => handleCopyClick(inputValue)}
                edge="end"
                sx={{
                  backgroundColor: '#E8E8FF',
                  borderRadius: '0px 7.5px 7.5px 0px',
                  height: '45px',
                  right: '-1px',
                }}
              >
                <img src={shareIcon} alt="" />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        }
      />
    </Stack>
  );
};

export default CopyClickboardInput;
