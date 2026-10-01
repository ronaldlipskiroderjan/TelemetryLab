import { describe, expect, it } from 'vitest';

import {
  ChannelProvenance,
  createLap,
  createTelemetrySession,
  createTrack,
  createVehicle,
} from '../../src/domain/index.js';

describe('TelemetrySession', () => {
  it('represents a source and vehicle independently from their implementations', () => {
    const sessionDate = new Date('2026-09-20T14:00:00.000Z');
    const session = createTelemetrySession({
      id: 'session-1',
      userId: 'user-1',
      name: 'Afternoon practice',
      vehicleId: 'vehicle-1',
      trackId: 'track-1',
      sessionDate,
      source: 'generic-csv-logger',
      createdAt: new Date('2026-09-21T09:30:00.000Z'),
      channels: [
        {
          name: 'speed',
          metadata: {
            provenance: ChannelProvenance.DIRECT,
            sourceChannel: 'GPS Speed',
            unit: 'km/h',
          },
        },
      ],
    });

    sessionDate.setUTCFullYear(2030);

    expect(session.sessionDate.toISOString()).toBe('2026-09-20T14:00:00.000Z');
    expect(session.source).toBe('generic-csv-logger');
    expect(session.channels[0]?.metadata.provenance).toBe('DIRECT');
  });

  it('rejects ambiguous duplicate channel definitions', () => {
    expect(() =>
      createTelemetrySession({
        id: 'session-1',
        name: 'Practice',
        sessionDate: new Date('2026-09-20T14:00:00.000Z'),
        source: 'logger',
        createdAt: new Date('2026-09-21T09:30:00.000Z'),
        channels: [
          { name: 'speed', metadata: { provenance: ChannelProvenance.DIRECT } },
          { name: 'speed', metadata: { provenance: ChannelProvenance.DIRECT } },
        ],
      }),
    ).toThrow('duplicate telemetry channel speed');
  });
});

describe('Lap', () => {
  it('keeps the lap associated with its session', () => {
    expect(
      createLap({
        id: 'lap-4',
        sessionId: 'session-1',
        lapNumber: 4,
        lapTime: 52.118,
        distance: 1_284.5,
      }),
    ).toEqual({
      id: 'lap-4',
      sessionId: 'session-1',
      lapNumber: 4,
      lapTime: 52.118,
      distance: 1_284.5,
    });
  });

  it('rejects an invalid lap number', () => {
    expect(() =>
      createLap({
        id: 'lap-0',
        sessionId: 'session-1',
        lapNumber: 0,
        lapTime: 0,
        distance: 0,
      }),
    ).toThrow('lapNumber must be a positive integer');
  });
});

describe('Vehicle and Track', () => {
  it('keeps vehicle classification open to different vehicle types', () => {
    expect(
      createVehicle({
        id: 'vehicle-1',
        name: 'Prototype 01',
        category: 'prototype',
      }),
    ).toEqual({ id: 'vehicle-1', name: 'Prototype 01', category: 'prototype' });
  });

  it('requires a positive track length when one is known', () => {
    expect(() =>
      createTrack({ id: 'track-1', name: 'Circuit X', length: 0 }),
    ).toThrow('track length must be greater than zero');
  });
});
