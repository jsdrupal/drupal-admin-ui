import { all } from 'redux-saga/effects';
import applicationSaga from './application';
import contentSaga from './content';
import { watchDblogRequests } from './reports';
import { watchRequestedRolesWithCancel } from './roles';

export default function* rootSaga() {
  yield all([
    applicationSaga(),
    contentSaga(),
    watchDblogRequests(),
    watchRequestedRolesWithCancel(),
  ]);
}
