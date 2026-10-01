import { describe, expect, it } from 'vitest';

import {
  ChannelProvenance,
  createChannelMetadata,
  createTelemetryChannel,
} from '../../src/domain/index.js';

describe('telemetry channel metadata', () => {
  it('keeps the audit information for a derived channel', () => {
    const channel = createTelemetryChannel({
      name: 'distance',
      metadata: {
        provenance: ChannelProvenance.DERIVED,
        sourceChannel: 'gpsPosition',
        unit: 'm',
        samplingRate: 20,
        derivationMethod: 'cumulative haversine distance',
      },
    });

    expect(channel).toEqual({
      name: 'distance',
      metadata: {
        provenance: 'DERIVED',
        sourceChannel: 'gpsPosition',
        unit: 'm',
        samplingRate: 20,
        derivationMethod: 'cumulative haversine distance',
      },
    });
  });

  it('requires derived values to describe how they were calculated', () => {
    expect(() =>
      createChannelMetadata({
        provenance: ChannelProvenance.DERIVED,
      }),
    ).toThrow('derivationMethod is required for a derived channel');
  });

  it('rejects contradictory or invalid sampling metadata', () => {
    expect(() =>
      createChannelMetadata({
        provenance: ChannelProvenance.DIRECT,
        derivationMethod: 'interpolation',
      }),
    ).toThrow('derivationMethod is only valid for a derived channel');

    expect(() =>
      createChannelMetadata({
        provenance: ChannelProvenance.DIRECT,
        samplingRate: 0,
      }),
    ).toThrow('samplingRate must be greater than zero');
  });
});
