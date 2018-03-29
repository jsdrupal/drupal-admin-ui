import { all } from 'redux-saga/effects';
import applicationSaga from './application';
import { watchDblogRequests } from './reports';

export default function* rootSaga() {
  yield all([applicationSaga(), watchDblogRequests()]);
}
