import { ACTION_TYPE } from '../constants/action_type';

export const cancelTask = () => ({
  type: ACTION_TYPE.CANCEL_TASK,
  payload: {},
});
