import { Subjects, Publisher, OrderCancelledEvent } from '@aaztickets2/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
