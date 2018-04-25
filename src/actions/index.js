import { all } from 'redux-saga/effects';
import applicationSaga from './application';
import { watchDblogRequests } from './reports';
import { watchRequestedRolesWithCancel } from './roles';
import { watchRequestedPermissionsWithCancel } from './permissions';

export default function* rootSaga() {
  yield all([
    applicationSaga(),
    watchDblogRequests(),
    watchRequestedRolesWithCancel(),
    watchRequestedPermissionsWithCancel(),
  ]);
}
