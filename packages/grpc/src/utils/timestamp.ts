export type Timestamp = {
  seconds: number;
  nanos: number;
};

export function dateToProtobufTimestamp(date: Date): Timestamp {
  return {
    seconds: Math.floor(date.getTime() / 1000),
    nanos: date.getMilliseconds() * 1000000,
  };
}

export function protobufTimestampToDate(by: Timestamp): Date {
  const milliseconds = by.seconds * 1000 + Math.floor(by.nanos / 1000000);
  return new Date(milliseconds);
}
