const Razorpay = require('razorpay');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { amount, currency = 'INR' } = req.body || {};
    if (!amount || amount < 100) return res.status(400).json({ error: 'Amount must be at least 100 paise.' });
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    const order = await razorpay.orders.create({
      amount, currency, receipt: `rcm_${Date.now()}`
    });
    res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to create order.' });
  }
};