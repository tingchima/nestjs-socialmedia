export interface ChannelRepositoryPort {
  existsChannel(by: { id: number }): Promise<boolean>;
}
