const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const Hackathon = require('../models/Hackathon');
const Course = require('../models/Course');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payment/create-order
const createOrder = async (req, res) => {
  try {
    const { amount, type, itemId } = req.body;
    const options = {
      amount: amount * 100, // in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/payment/verify
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, type, itemId } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Update records based on payment type
    if (type === 'hackathon') {
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { registeredHackathons: itemId } });
      await Hackathon.findByIdAndUpdate(itemId, { $inc: { registeredCount: 1 } });
    } else if (type === 'course') {
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { enrolledCourses: itemId } });
      await Course.findByIdAndUpdate(itemId, { $inc: { totalEnrolled: 1 } });
    }

    res.json({ message: 'Payment verified successfully', paymentId: razorpay_payment_id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, verifyPayment };
