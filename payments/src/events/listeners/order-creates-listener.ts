import { Listener, OrderCreatedEvent, Subjects } from "@aaztickets2/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const { id, version, userId, status, ticket } = data;

    // Ensure ticket exists and has price property
    const price = ticket?.price;

    const order = Order.build({
      id,
      version,
      userId,
      price,
      status,
    });

    await order.save();
    msg.ack();
  }
}
