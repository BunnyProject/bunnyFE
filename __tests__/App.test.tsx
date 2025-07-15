/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: import explicitly to use the types shipped with jest.
import {it, expect, jest} from '@jest/globals';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

import * as bunnyApi from '../src/api/bunnyApi';

jest.mock('../src/api/bunnyApi');

const mockedBunnyApi = bunnyApi as jest.Mocked<typeof bunnyApi>;

it('renders correctly with mocked API', async () => {
  // getTodayBunny와 getHomeSalary를 mock 처리
  mockedBunnyApi.getTodayBunny.mockResolvedValue({
    resultType: 'SUCCESS',
    success: {
      minMoney: 123,
      workingTime: '09:00:00',
      quttingTime: '18:00:00',
    },
  });
  mockedBunnyApi.getHomeSalary.mockResolvedValue({
    resultType: 'SUCCESS',
    success: {
      minMoney: 164,
      hourMoney: 9860,
      secondMoney: 3,
    },
  });

  const tree = renderer.create(<App />);
  expect(tree).toBeTruthy();
});

// jest.setup.js
jest.mock('react-native-gesture-handler', () => ({}));
jest.mock('react-native-reanimated', () => ({}));
