import { Injectable } from "@nestjs/common";
import { EventBus, IEvent } from "@nestjs/cqrs";

import { EventBusPort } from "@repo/nestjs-libs";

@Injectable()
export class CqrsEventBusAdapter implements EventBusPort {
  constructor(private readonly eventBus: EventBus) {}

  public async sendEvent<Event>(event: Event): Promise<void> {
    return this.eventBus.publish(event as IEvent);
  }
}
