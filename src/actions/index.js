import { all } from 'redux-saga/effects';
import watchRequestedMenu from './application';
import { watchRequestedRolesWithCancel } from './roles';

export default function* rootSaga() {
  yield all([watchRequestedRolesWithCancel(), watchRequestedMenu()]);
}
