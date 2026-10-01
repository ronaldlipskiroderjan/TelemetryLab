import {
  DomainValidationError,
  requireFinite,
  requireInRange,
  requireNonBlank,
  requireNonNegative,
  requirePositiveInteger,
} from './validation.js';

export type AdditionalChannelValue = number | string | boolean | null;
export type AdditionalChannels = Readonly<
  Record<string, AdditionalChannelValue>
>;

export interface TelemetryPoint {
  readonly time: number;
  readonly distance: number;
  readonly speed: number;
  readonly latitude: number;
  readonly longitude: number;
  readonly rpm: number;
  readonly longitudinalAcceleration: number;
  readonly lateralAcceleration: number;
  readonly lapNumber: number;
  readonly lapTime: number;
  readonly additionalChannels: AdditionalChannels;
}

const normalizedChannelNames = new Set<string>([
  'time',
  'distance',
  'speed',
  'latitude',
  'longitude',
  'rpm',
  'longitudinalAcceleration',
  'lateralAcceleration',
  'lapNumber',
  'lapTime',
]);

function isAdditionalChannelValue(
  value: unknown,
): value is AdditionalChannelValue {
  return (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'boolean' ||
    (typeof value === 'number' && Number.isFinite(value))
  );
}

function copyAdditionalChannels(input: AdditionalChannels): AdditionalChannels {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    throw new DomainValidationError('additionalChannels must be a channel map');
  }

  const entries = Object.entries(input).map(([name, value]) => {
    requireNonBlank(name, 'additional channel name');

    if (normalizedChannelNames.has(name)) {
      throw new DomainValidationError(
        `additional channel ${name} conflicts with a normalized channel`,
      );
    }

    if (!isAdditionalChannelValue(value)) {
      throw new DomainValidationError(
        `additional channel ${name} must contain a finite scalar value or null`,
      );
    }

    return [name, value] as const;
  });

  return Object.freeze(Object.fromEntries(entries));
}

export function createTelemetryPoint(input: TelemetryPoint): TelemetryPoint {
  return Object.freeze({
    time: requireNonNegative(input.time, 'time'),
    distance: requireNonNegative(input.distance, 'distance'),
    speed: requireNonNegative(input.speed, 'speed'),
    latitude: requireInRange(input.latitude, -90, 90, 'latitude'),
    longitude: requireInRange(input.longitude, -180, 180, 'longitude'),
    rpm: requireNonNegative(input.rpm, 'rpm'),
    longitudinalAcceleration: requireFinite(
      input.longitudinalAcceleration,
      'longitudinalAcceleration',
    ),
    lateralAcceleration: requireFinite(
      input.lateralAcceleration,
      'lateralAcceleration',
    ),
    lapNumber: requirePositiveInteger(input.lapNumber, 'lapNumber'),
    lapTime: requireNonNegative(input.lapTime, 'lapTime'),
    additionalChannels: copyAdditionalChannels(input.additionalChannels),
  });
}
