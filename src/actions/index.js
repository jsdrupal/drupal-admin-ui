import { all } from 'redux-saga/effects';
import watchRequestedMenu from './application';
import { watchDblogRequests } from './reports';
import { watchRequestedRolesWithCancel } from './roles';
import { watchRequestedPermissionsWithCancel } from './permissions';

export default function* rootSaga() {
  yield all([
    watchRequestedRolesWithCancel(),
    watchRequestedPermissionsWithCancel(),
    watchDblogRequests(),
  ]);
}
