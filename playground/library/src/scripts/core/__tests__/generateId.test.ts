/**
 * @jest-environment jsdom
 */

import generateId from 'scripts/core/generateId';

describe('generateId', () => {
  let windowSpy = jest.spyOn(window, 'window', 'get');

  beforeEach(() => {
    windowSpy.mockClear();
  });

  test('should generate a unique id - node environment', () => {
    windowSpy = jest.spyOn(window, 'window', 'get');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    windowSpy.mockImplementation(() => undefined as any);
    expect(generateId().length).toBe(40);
  });

  test('should generate a unique id - browser environment', () => {
    windowSpy.mockImplementation(() => ({
      crypto: {
        getRandomValues: (): number[] => [15616516, 4651848654, 549875987, 87897985],
      },
    }) as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(generateId().length).toBe(40);
  });
});
