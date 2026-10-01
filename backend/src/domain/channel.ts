import {
  DomainValidationError,
  requireNonBlank,
  requirePositive,
} from './validation.js';

export const ChannelProvenance = {
  DIRECT: 'DIRECT',
  DERIVED: 'DERIVED',
} as const;

export type ChannelProvenance =
  (typeof ChannelProvenance)[keyof typeof ChannelProvenance];

export interface ChannelMetadata {
  readonly provenance: ChannelProvenance;
  readonly sourceChannel?: string;
  readonly unit?: string;
  readonly samplingRate?: number;
  readonly derivationMethod?: string;
}

export interface TelemetryChannel {
  readonly name: string;
  readonly metadata: ChannelMetadata;
}

function optionalNonBlank(
  value: string | undefined,
  field: string,
): string | undefined {
  return value === undefined ? undefined : requireNonBlank(value, field);
}

export function createChannelMetadata(input: ChannelMetadata): ChannelMetadata {
  if (
    input.provenance !== ChannelProvenance.DIRECT &&
    input.provenance !== ChannelProvenance.DERIVED
  ) {
    throw new DomainValidationError('provenance must be DIRECT or DERIVED');
  }

  const sourceChannel = optionalNonBlank(input.sourceChannel, 'sourceChannel');
  const unit = optionalNonBlank(input.unit, 'unit');
  const derivationMethod = optionalNonBlank(
    input.derivationMethod,
    'derivationMethod',
  );

  if (
    input.provenance === ChannelProvenance.DERIVED &&
    derivationMethod === undefined
  ) {
    throw new DomainValidationError(
      'derivationMethod is required for a derived channel',
    );
  }

  if (
    input.provenance === ChannelProvenance.DIRECT &&
    derivationMethod !== undefined
  ) {
    throw new DomainValidationError(
      'derivationMethod is only valid for a derived channel',
    );
  }

  return Object.freeze({
    provenance: input.provenance,
    ...(sourceChannel === undefined ? {} : { sourceChannel }),
    ...(unit === undefined ? {} : { unit }),
    ...(input.samplingRate === undefined
      ? {}
      : { samplingRate: requirePositive(input.samplingRate, 'samplingRate') }),
    ...(derivationMethod === undefined ? {} : { derivationMethod }),
  });
}

export function createTelemetryChannel(
  input: TelemetryChannel,
): TelemetryChannel {
  return Object.freeze({
    name: requireNonBlank(input.name, 'channel name'),
    metadata: createChannelMetadata(input.metadata),
  });
}
