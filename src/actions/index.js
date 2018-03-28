import { all } from 'redux-saga/effects';
import watchRequestedMenu from './application';
import watchRequestedRoles from './roles';

export default function* rootSaga() {
  yield all([watchRequestedRoles(), watchRequestedMenu()]);
}
