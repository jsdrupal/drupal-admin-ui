import { all } from 'redux-saga/effects';
import watchRequestedMenu from './application';
import { watchRequestedRolesWithCancel } from './roles';
import { watchRequestedLoadSimpleConfigWithCancel } from './simple_config';

export default function* rootSaga() {
  yield all([
    watchRequestedRolesWithCancel(),
    watchRequestedLoadSimpleConfigWithCancel(),
    watchRequestedMenu(),
  ]);
}
