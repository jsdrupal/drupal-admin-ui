import { all } from 'redux-saga/effects';
import watchRequestedMenu from './application';
import { watchRequestedRolesWithCancel } from './roles';
import { watchRequestedContentWithCancel } from './content';

export default function* rootSaga() {
  yield all([watchRequestedRolesWithCancel(), watchRequestedContentWithCancel(), watchRequestedMenu()]);
}
