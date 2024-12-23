export enum ChannelType {
  ONE_TO_ONE = "ONE_TO_ONE",
  GROUP = "GROUP",
}

export const channelTypeArray = [ChannelType.ONE_TO_ONE, ChannelType.GROUP];

const channelTypeLookup: { [key: string]: ChannelType } = {
  ONE_TO_ONE: ChannelType.ONE_TO_ONE,
  GROUP: ChannelType.GROUP,
};

export function channelTypeFromString(value: string): ChannelType {
  return channelTypeLookup[value];
}
