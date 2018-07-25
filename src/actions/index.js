import { all } from 'redux-saga/effects';
import applicationSaga from './application';
import contentSaga from './content';

export default function* rootSaga() {
  yield all([applicationSaga(), contentSaga()]);
}
