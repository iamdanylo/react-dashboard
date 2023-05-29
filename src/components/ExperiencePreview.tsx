import { FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { ReachTextRenderer, WhiteBox } from 'components';
import {
  imagePlaceholder,
  walletIcon,
  clockIcon,
  locationIcon,
  externalLinkIcon,
} from 'assets/svg';
import { convertLinkToHttps } from 'utils/helpers/externalLinks';

interface Props {
  imageUrl: string | null;
  name: string;
  description: string;
  time: string;
  location: string;
  externalUrl?: string;
  memberPrice: string;
  publicPrice: string;
  isFree: boolean;
  currency: string | undefined;
  isPublicPriceVisible: boolean;
}

const mb = { marginBottom: '12px' };
const detailedInfoStyle = { marginLeft: '10px' };

const ExperiencePreview: FC<Props> = ({
  imageUrl,
  name,
  description,
  time,
  location,
  externalUrl,
  memberPrice,
  publicPrice,
  isFree,
  currency,
  isPublicPriceVisible,
}) => {
  const publicPriceText = currency + (publicPrice ?? 0) + ' (Public)';
  const memberPriceText = currency + (memberPrice ?? 0) + ' (Members & Guests)'

  const pricingText = isFree
    ? 'Free event'
    : memberPriceText + (isPublicPriceVisible ? ` ${publicPriceText}` : '');

  return (
    <WhiteBox className="experience-preview" margin="0 0 12px 0">
      <Typography sx={{ marginBottom: '18px' }} variant="h2">
        Preview
      </Typography>
      <Stack>
        <img
          className="experience-img"
          src={imageUrl || imagePlaceholder}
          alt="event-image"
        />
        <Box sx={{ padding: '16px' }}>
          <Typography sx={mb} variant="h4">
            {name || 'Experience name'}
          </Typography>
          <ReachTextRenderer sx={mb} html={description} />
          <Stack sx={mb} direction={'row'} alignItems={'center'}>
            <img src={clockIcon} alt="time-icon" />
            <Typography sx={detailedInfoStyle} variant="body2">
              {time || 'Experience time'}
            </Typography>
          </Stack>
          <Stack sx={mb} direction={'row'} alignItems={'center'}>
            <img src={locationIcon} alt="location-icon" />
            <Typography sx={detailedInfoStyle} variant="body2">
              {location || 'Experience location'}
            </Typography>
          </Stack>
          {externalUrl && (
            <Stack sx={mb} direction={'row'} alignItems={'center'}>
              <img src={externalLinkIcon} alt="external-icon" />
              <Typography sx={detailedInfoStyle} variant="body2">
                <a href={convertLinkToHttps(externalUrl)} target='_blank' rel="noreferrer">
                  Streaming link
                </a>
              </Typography>
            </Stack>
          )}
          {pricingText?.trim()?.length > 0 && (
            <Stack direction={'row'} alignItems={'center'}>
              <img src={walletIcon} alt="wallet-icon" />
              <Typography sx={detailedInfoStyle} variant="body2">
                {pricingText}
              </Typography>
            </Stack>
          )}
        </Box>
      </Stack>
    </WhiteBox>
  );
};

export default ExperiencePreview;
