import styled from '@emotion/styled';
import TableRow from '@mui/material/TableRow';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&.table-row': {
    transition: 'all 0.3s ease',
  },
  '&.table-row:hover': {
    boxShadow: 'rgb(156 156 184 / 15%) 0px 12px 24px',
    cursor: 'pointer',
  },
  '&:nth-of-type(odd)': {
    backgroundColor: 'transparent',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default StyledTableRow;
