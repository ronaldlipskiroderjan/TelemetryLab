import { describe, expect, it } from 'vitest';

import { createTelemetryPoint } from '../../src/domain/index.js';

const validPoint = {
  time: 12.482,
  distance: 354.8,
  speed: 91.4,
  latitude: -25,
  longitude: -49,
  rpm: 10_420,
  longitudinalAcceleration: -0.72,
  lateralAcceleration: 1.43,
  lapNumber: 4,
  lapTime: 52.118,
  additionalChannels: {
    throttlePosition: 84.2,
    gear: 4,
    pitLimiterActive: false,
    driverMarker: 'corner-entry',
    tireTemperature: null,
  },
};

describe('TelemetryPoint', () => {
  it('preserves every recognized extra channel and isolates the normalized point', () => {
    const point = createTelemetryPoint(validPoint);

    expect(point.additionalChannels).toEqual(validPoint.additionalChannels);
    expect(Object.isFrozen(point)).toBe(true);
    expect(Object.isFrozen(point.additionalChannels)).toBe(true);

    validPoint.additionalChannels.gear = 5;

    expect(point.additionalChannels.gear).toBe(4);
  });

  it.each([
    ['latitude', { latitude: 90.1 }, 'latitude must be between -90 and 90'],
    [
      'longitude',
      { longitude: -180.1 },
      'longitude must be between -180 and 180',
    ],
    ['lap number', { lapNumber: 0 }, 'lapNumber must be a positive integer'],
    ['speed', { speed: -0.1 }, 'speed must be greater than or equal to zero'],
  ])('rejects an invalid %s', (_field, changes, expectedMessage) => {
    expect(() => createTelemetryPoint({ ...validPoint, ...changes })).toThrow(
      expectedMessage,
    );
  });

  it('rejects an extra channel that conflicts with a normalized channel', () => {
    expect(() =>
      createTelemetryPoint({
        ...validPoint,
        additionalChannels: { speed: 90, brakePressure: 20 },
      }),
    ).toThrow('additional channel speed conflicts with a normalized channel');
  });

  it('rejects non-finite extra channel values', () => {
    expect(() =>
      createTelemetryPoint({
        ...validPoint,
        additionalChannels: { brakePressure: Number.NaN },
      }),
    ).toThrow(
      'additional channel brakePressure must contain a finite scalar value or null',
    );
  });
});
