import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { colors } from '../constants';

export const headerStyle = {
  width: '100%',
  height: 55,
  backgroundColor: colors.tableHeaderRowBackground,
  display: 'flex',
  alignItems: 'center',
};

export const headerLinkStyle: CSSProperties = {
  paddingLeft: 10,
  paddingRight: 10,
  fontFamily: 'Graphik-Semibold-Web,sans-serif',
  fontWeight: 'bold',
  textDecoration: 'none',
  color: 'white',
};

export const headerSearchStyle = {
  paddingRight: 10,
  color: 'white',
  marginLeft: 'auto',
};

export const headerCurrentLinkStyle = {
  textDecoration: 'underline',
  textDecorationThickness: 2.5,
  textUnderlineOffset: '.5em',
};
