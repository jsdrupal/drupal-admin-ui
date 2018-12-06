import { testSaga } from 'redux-saga-test-plan';
import { resetLoading, showLoading } from 'react-redux-loading-bar';

import { loadDblog, DBLOG_FILTER_UPDATED } from './reports';
import api from '../utils/api/api';
import { setErrorMessage } from './application';

it('test empty options', () => {
  testSaga(loadDblog, { payload: {} })
    .next()
    .next("TypeError: Cannot read property 'sort' of undefined")
    .put(setErrorMessage("TypeError: Cannot read property 'sort' of undefined"))
    .next()
    .finish()
    .isDone();
});

it('test with sort', () => {
  testSaga(loadDblog, { payload: { options: { sort: 'type' } } })
    .next()
    .put(resetLoading())
    .next()
    .put(showLoading())
    .next()
    .put({
      type: DBLOG_FILTER_UPDATED,
      payload: { options: { sort: 'type' } },
    })
    .next()
    .call(api, 'dblog:types')
    .next()
    .call(api, 'dblog', {
      queryString: {
        sort: 'type',
        page: {
          limit: 50,
        },
        filter: {},
      },
    })
    .finish();
});

it('test with pager', () => {
  testSaga(loadDblog, { payload: { options: { offset: 51 } } })
    .next()
    .next()
    .next()
    .next()
    .next()
    .call(api, 'dblog', {
      queryString: {
        sort: '',
        page: {
          limit: 50,
          offset: 51,
        },
        filter: {},
      },
    })
    .finish();
});

it('test with sort and severity filter', () => {
  testSaga(loadDblog, {
    payload: { options: { sort: 'type', severities: ['Emergency', 'Alert'] } },
  })
    .next()
    .next()
    .next()
    .next()
    .next()
    .call(api, 'dblog', {
      queryString: {
        sort: 'type',
        page: {
          limit: 50,
        },
        filter: {
          severityGroup: {
            group: {
              conjunction: 'OR',
            },
          },
          severityEmergency: {
            condition: {
              value: 'Emergency',
              path: 'severity',
              memberOf: 'severityGroup',
            },
          },
          severityAlert: {
            condition: {
              value: 'Alert',
              path: 'severity',
              memberOf: 'severityGroup',
            },
          },
        },
      },
    })
    .finish();
});
