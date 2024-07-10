import { Publisher, OrderCreatedEvent, Subjects } from '@aaztickets2/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
