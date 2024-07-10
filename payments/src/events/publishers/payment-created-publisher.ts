import { Subjects, Publisher, PaymentCreatedEvent } from '@aaztickets2/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
