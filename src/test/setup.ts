import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

if (expect && typeof expect.extend === 'function') {
  expect.extend(matchers);
}

afterEach(() => {
  cleanup();
});
