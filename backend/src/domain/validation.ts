export class DomainValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainValidationError';
  }
}

export function requireNonBlank(value: string, field: string): string {
  if (value.trim().length === 0) {
    throw new DomainValidationError(`${field} must not be blank`);
  }

  return value;
}

export function requireFinite(value: number, field: string): number {
  if (!Number.isFinite(value)) {
    throw new DomainValidationError(`${field} must be a finite number`);
  }

  return value;
}

export function requireNonNegative(value: number, field: string): number {
  requireFinite(value, field);

  if (value < 0) {
    throw new DomainValidationError(
      `${field} must be greater than or equal to zero`,
    );
  }

  return value;
}

export function requirePositive(value: number, field: string): number {
  requireFinite(value, field);

  if (value <= 0) {
    throw new DomainValidationError(`${field} must be greater than zero`);
  }

  return value;
}

export function requirePositiveInteger(value: number, field: string): number {
  if (!Number.isInteger(value) || value <= 0) {
    throw new DomainValidationError(`${field} must be a positive integer`);
  }

  return value;
}

export function requireInRange(
  value: number,
  minimum: number,
  maximum: number,
  field: string,
): number {
  requireFinite(value, field);

  if (value < minimum || value > maximum) {
    throw new DomainValidationError(
      `${field} must be between ${minimum} and ${maximum}`,
    );
  }

  return value;
}

export function copyValidDate(value: Date, field: string): Date {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    throw new DomainValidationError(`${field} must be a valid date`);
  }

  return new Date(value.getTime());
}
