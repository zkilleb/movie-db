import { colors } from '../constants';

export const subHeaderStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginLeft: 'auto',
};

export const leftSubHeaderStyle = {
  display: 'flex',
  justifyContent: 'flex-start',
  paddingLeft: 20,
};

export const parentHeaderStyle = {
  display: 'flex',
};

export const tableFieldStyle = {
  justifyContent: 'flex-end',
  paddingRight: 20,
  color: 'white',
  '& label.Mui-focused': {
    color: 'white',
  },
  '& .MuiInput-underline:before': {
    borderBottomColor: 'white',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'white',
  },
};

export const tableHeaderTextStyle = {
  fontSize: 30,
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
};

export const pdfIconStyle = {
  paddingRight: 20,
  marginTop: 20,
  color: 'white',
};

export const tableHeaderContentStyle = {
  display: 'flex',
  justifyContent: 'center',
};

export const tableHeaderStyle = {
  color: 'white',
  fontSize: 30,
  display: 'flex',
};

export const tableStyle = {
  backgroundColor: colors.tableBackground,
  width: '95%',
  marginTop: 10,
  margin: 'auto',
};

export const headerRowStyle = {
  backgroundColor: colors.tableHeaderRowBackground,
};

export const tableContainerStyle = {
  overflow: 'hidden',
};

export const tableFooterStyle = {
  color: 'white',
};

export const uploadButtonStyle = {
  display: 'flex',
  width: '50%',
  margin: 'auto',
};
