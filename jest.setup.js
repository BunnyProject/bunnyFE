import {jest} from '@jest/globals';
jest.mock('react-native-gesture-handler', () => ({}));
jest.mock('react-native-reanimated', () => ({}));
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
); 