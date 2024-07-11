import request from "supertest";
import { app } from "../../app"; // Assuming your Express app instance is exported as 'app'
import { Order } from "../../models/order";
import { OrderStatus } from "@aaztickets2/common";
import mongoose from "mongoose";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

jest.mock("../../stripe");

describe("POST /api/payments", () => {
  it("returns a 404 if the order does not exist", async () => {
    const orderId = new mongoose.Types.ObjectId().toHexString(); // Generate a valid ObjectId

    await request(app)
      .post("/api/payments")
      .set("Cookie", global.signing())
      .send({ token: "valid-token", orderId })
      .expect(404);
  });

  it("returns a 401 when purchasing an order that doesn't belong to the user", async () => {
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      userId: "user-1", // Ensure this userId is different from the currentUser's id
      version: 0,
      price: 100,
      status: OrderStatus.Created,
    });
    await order.save();

    await request(app)
      .post("/api/payments")
      .set("Cookie", global.signing()) // Simulate a different user
      .send({ token: "valid-token", orderId: order.id })
      .expect(401);
  });

  it("returns a 400 when purchasing a cancelled order", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      version: 0,
      price: 20,
      userId,
      status: OrderStatus.Cancelled, // Cancelled order
    });
    await order.save();

    await request(app)
      .post("/api/payments")
      .set("Cookie", global.signing(userId))
      .send({ token: "valid-token", orderId: order.id })
      .expect(400);
  });

  it("returns a 201 with valid inputs", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      userId,
      version: 0,
      price: 20,
      status: OrderStatus.Created,
    });
    await order.save();

    await request(app)
      .post("/api/payments")
      .set("Cookie", global.signing(userId))
      .send({
        token: "tok_visa",
        orderId: order.id,
      })
      .expect(201);

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

    expect(chargeOptions).toBeDefined();
    expect(chargeOptions!.currency).toEqual("usd");
    expect(chargeOptions!.source).toEqual("tok_visa");
    expect(chargeOptions!.amount).toEqual(20 * 100);

    const payment = await Payment.findOne({
      orderId: order.id,
      stripeId: "ch_12345", // Check for the stripeId from the mock
    });

    expect(payment).not.toBeNull();
  });
});
