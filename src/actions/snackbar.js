export const SUMMON_SNACKBAR = 'SUMMON_SNACKBAR';
export const DISMISS_SNACKBAR = 'DISMISS_SNACKBAR';

export const summonSnackbar = (message) => ({
  type: SUMMON_SNACKBAR,
  payload:message,
});

export const dismissSnackbar = () => ({
  type: DISMISS_SNACKBAR,
})
