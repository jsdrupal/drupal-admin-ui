import { all } from 'redux-saga/effects';
import applicationSaga from './application';

export default function* rootSaga() {
  yield all([applicationSaga()]);
}
