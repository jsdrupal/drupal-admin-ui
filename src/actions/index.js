import { all } from 'redux-saga/effects';
import watchRequestedMenu from './application';
import { watchRequestedRolesWithCancel } from './roles';
import {
  watchRequestedLoadSimpleConfigWithCancel,
  watchPostedSimpleConfigWithCancel,
} from './simpleConfig';

export default function* rootSaga() {
  yield all([
    watchRequestedRolesWithCancel(),
    watchRequestedLoadSimpleConfigWithCancel(),
    watchPostedSimpleConfigWithCancel(),
    watchRequestedMenu(),
  ]);
}
