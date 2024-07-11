import { OrderCancelledEvent, OrderStatus } from "@aaztickets2/common";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper"; // Example import for NATS wrapper
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";

// Mock the queueGroupName function
jest.mock("../queue-group-name", () => {
  return {
    queueGroupName: "test-queue-group",
  };
});

// Mock natsWrapper
jest.mock("../../../nats-wrapper");

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: "sadasd",
    version: 0,
  });

  await order.save();

  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id: "asdasdsad",
    },
  };

  const msg: Partial<Message> = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

describe("OrderCancelledListener", () => {
  it("updates the status of the order", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg as Message);

    const updatedOrder = await Order.findById(data.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  });

  it("acks the message", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg as Message);

    expect(msg.ack).toHaveBeenCalled();
  });
});
