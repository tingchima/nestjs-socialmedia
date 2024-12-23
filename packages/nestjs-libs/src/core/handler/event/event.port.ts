export interface EventBusPort {
  sendEvent<Event extends object>(event: Event): Promise<void>;
}
