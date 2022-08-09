import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { colors } from '../constants';

export const paperStyle: CSSProperties = {
  backgroundColor: colors.tableBackground,
  margin: 'auto',
  marginTop: 25,
  fontSize: 15,
  color: 'white',
  display: 'flex',
  textAlign: 'left',
  borderRadius: '10px 10px 10px 10px',
};

export const maxSearchResultStyle = {
  width: '50%',
};

export const minSearchResultStyle = {
  width: '75%',
};

export const searchResultPosterStyle = {
  padding: 10,
};

export const searchResultNoPosterStyle: CSSProperties = {
  width: 106.7,
  height: 160,
  margin: 10,
  textAlign: 'center',
  border: 'solid',
};
