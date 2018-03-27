import { all } from 'redux-saga/effects';
import { watchRequestedRoles, watchRequestedMenu } from './application';

export default function* rootSaga() {
  yield all([watchRequestedRoles(), watchRequestedMenu()]);
}
