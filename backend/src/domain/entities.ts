import { createTelemetryChannel, type TelemetryChannel } from './channel.js';
import {
  copyValidDate,
  DomainValidationError,
  requireNonBlank,
  requireNonNegative,
  requirePositive,
  requirePositiveInteger,
} from './validation.js';

export interface TelemetrySession {
  readonly id: string;
  readonly userId?: string;
  readonly name: string;
  readonly vehicleId?: string;
  readonly trackId?: string;
  readonly sessionDate: Date;
  readonly source: string;
  readonly createdAt: Date;
  readonly channels: readonly TelemetryChannel[];
}

export interface Lap {
  readonly id: string;
  readonly sessionId: string;
  readonly lapNumber: number;
  readonly lapTime: number;
  readonly distance: number;
}

export interface Vehicle {
  readonly id: string;
  readonly name: string;
  readonly category?: string;
}

export interface Track {
  readonly id: string;
  readonly name: string;
  readonly length?: number;
}

function optionalNonBlank(
  value: string | undefined,
  field: string,
): string | undefined {
  return value === undefined ? undefined : requireNonBlank(value, field);
}

function copyChannels(
  channels: readonly TelemetryChannel[],
): readonly TelemetryChannel[] {
  const channelNames = new Set<string>();
  const copiedChannels = channels.map((channel) => {
    const copiedChannel = createTelemetryChannel(channel);

    if (channelNames.has(copiedChannel.name)) {
      throw new DomainValidationError(
        `duplicate telemetry channel ${copiedChannel.name}`,
      );
    }

    channelNames.add(copiedChannel.name);
    return copiedChannel;
  });

  return Object.freeze(copiedChannels);
}

export function createTelemetrySession(
  input: TelemetrySession,
): TelemetrySession {
  const userId = optionalNonBlank(input.userId, 'userId');
  const vehicleId = optionalNonBlank(input.vehicleId, 'vehicleId');
  const trackId = optionalNonBlank(input.trackId, 'trackId');

  return Object.freeze({
    id: requireNonBlank(input.id, 'session id'),
    ...(userId === undefined ? {} : { userId }),
    name: requireNonBlank(input.name, 'session name'),
    ...(vehicleId === undefined ? {} : { vehicleId }),
    ...(trackId === undefined ? {} : { trackId }),
    sessionDate: copyValidDate(input.sessionDate, 'sessionDate'),
    source: requireNonBlank(input.source, 'source'),
    createdAt: copyValidDate(input.createdAt, 'createdAt'),
    channels: copyChannels(input.channels),
  });
}

export function createLap(input: Lap): Lap {
  return Object.freeze({
    id: requireNonBlank(input.id, 'lap id'),
    sessionId: requireNonBlank(input.sessionId, 'sessionId'),
    lapNumber: requirePositiveInteger(input.lapNumber, 'lapNumber'),
    lapTime: requireNonNegative(input.lapTime, 'lapTime'),
    distance: requireNonNegative(input.distance, 'distance'),
  });
}

export function createVehicle(input: Vehicle): Vehicle {
  const category = optionalNonBlank(input.category, 'vehicle category');

  return Object.freeze({
    id: requireNonBlank(input.id, 'vehicle id'),
    name: requireNonBlank(input.name, 'vehicle name'),
    ...(category === undefined ? {} : { category }),
  });
}

export function createTrack(input: Track): Track {
  return Object.freeze({
    id: requireNonBlank(input.id, 'track id'),
    name: requireNonBlank(input.name, 'track name'),
    ...(input.length === undefined
      ? {}
      : { length: requirePositive(input.length, 'track length') }),
  });
}
