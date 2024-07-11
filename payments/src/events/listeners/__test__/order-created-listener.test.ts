import { OrderCreatedEvent, OrderStatus } from "@aaztickets2/common";
import { OrderCreatedListener } from "../order-creates-listener";
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
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: new Date().toISOString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 11,
    },
  };

  const msg: Partial<Message> = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

describe("OrderCreatedListener", () => {
  it("replicates order info", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg as Message);

    const order = await Order.findById(data.id);

    expect(order).toBeDefined();
    expect(order!.price).toEqual(data.ticket.price);
    expect(order!.status).toEqual(data.status);
  });

  it("acks the message", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg as Message);

    expect(msg.ack).toHaveBeenCalled();
  });
});
