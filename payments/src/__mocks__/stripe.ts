export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({ id: 'ch_12345', currency: 'usd', source: 'tok_visa', amount: 2000 }),
  },
};
