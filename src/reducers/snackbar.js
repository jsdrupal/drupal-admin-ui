import { SUMMON_SNACKBAR, DISMISS_SNACKBAR } from '../actions/snackbar';

export const initialState = {
  message: '',
  open: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SUMMON_SNACKBAR: {
      return {
        ...state,
        message:action.payload,
        open: true,
      };
    }
    case DISMISS_SNACKBAR: {
      return {
        ...state,
        message: '',
        open: false,
      };
    }

    default:
      return state;
  }
};
