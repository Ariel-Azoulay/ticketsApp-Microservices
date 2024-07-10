import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@aaztickets2/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
