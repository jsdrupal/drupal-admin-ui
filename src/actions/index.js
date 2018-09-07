import { all } from 'redux-saga/effects';
import applicationSaga from './application';
import contentSaga from './content';
import schemaSaga from './schema';
import { watchDblogRequests } from './reports';
import { watchRequestedRolesWithCancel } from './roles';
import taxonomySaga from './taxonomy';

export default function* rootSaga() {
  yield all([
    applicationSaga(),
    contentSaga(),
    watchDblogRequests(),
    watchRequestedRolesWithCancel(),
    schemaSaga(),
    taxonomySaga(),
  ]);
}
