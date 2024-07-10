import { Publisher, Subjects, TicketUpdatedEvent } from '@aaztickets2/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
