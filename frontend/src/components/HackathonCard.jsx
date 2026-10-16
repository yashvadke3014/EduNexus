import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const HackathonCard = ({ hackathon, onPaymentSuccess }) => {
  const { user } = useAuth();
  const [paying, setPaying] = useState(false);

  const handleRegisterFree = async () => {
    if (!user) return alert('Please login first!');
    alert(`✅ Registered for ${hackathon.title}!`);
  };

  const handlePaidRegister = async () => {
    if (!user) return alert('Please login first!');
    setPaying(true);
    try {
      const { data } = await axios.post('/api/payment/create-order', {
        amount: hackathon.registrationFee,
        type: 'hackathon',
        itemId: hackathon._id,
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: data.amount,
        currency: 'INR',
        name: 'EduNexus',
        description: `Registration — ${hackathon.title}`,
        order_id: data.orderId,
        handler: async (response) => {
          await axios.post('/api/payment/verify', {
            ...response,
            type: 'hackathon',
            itemId: hackathon._id,
          });
          alert('✅ Payment successful! You are now registered.');
          if (onPaymentSuccess) onPaymentSuccess();
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: '#4F46E5' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('Payment failed: ' + err.message);
    } finally {
      setPaying(false);
    }
  };

  const statusColor = {
    Upcoming: 'tag-purple',
    Ongoing: 'tag-green',
    Completed: 'tag-orange',
  }[hackathon.status] || 'tag-gray';

  return (
    <div className={`card ${hackathon.status === 'Completed' && hackathon.winners?.length ? 'winner-card' : ''}`}>
      <div className="card-top" style={{ background: 'linear-gradient(90deg, #4F46E5, #7C3AED)' }} />
      <div className="card-body">
        <div className="tags">
          <span className={`tag ${statusColor}`}>{hackathon.status}</span>
          <span className="tag tag-blue">{hackathon.mode}</span>
          {hackathon.registrationFee === 0 && <span className="tag tag-green">FREE</span>}
        </div>
        <div className="card-title">{hackathon.title}</div>
        <div className="card-subtitle">{hackathon.organizer}</div>
        <div className="card-meta">
          {hackathon.prizePool && <span>🏆 Prize: <strong>{hackathon.prizePool}</strong></span>}
          {hackathon.registrationDeadline && (
            <span>⏰ Deadline: {new Date(hackathon.registrationDeadline).toDateString()}</span>
          )}
        </div>
        <div className="tags">
          {hackathon.branches?.slice(0, 3).map(b => (
            <span key={b} className="tag tag-cyan">{b}</span>
          ))}
        </div>

        {hackathon.status === 'Completed' && hackathon.winners?.length > 0 && (
          <div className="winner-podium">
            {hackathon.winners.map(w => (
              <div key={w.position} className="podium-item">
                <span>{w.position === 1 ? '🥇' : w.position === 2 ? '🥈' : '🥉'}</span>
                <div>
                  <div className="podium-name">{w.teamName}</div>
                  <div className="podium-prize">{w.prize}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {hackathon.status !== 'Completed' && (
          <div className="card-footer">
            <span className={hackathon.registrationFee === 0 ? 'price-free' : 'price-paid'}>
              {hackathon.registrationFee === 0 ? 'FREE' : `₹${hackathon.registrationFee}`}
            </span>
            {hackathon.registrationFee === 0 ? (
              <button className="btn btn-filled" onClick={handleRegisterFree}>Register Free</button>
            ) : (
              <button className="btn btn-filled" onClick={handlePaidRegister} disabled={paying}>
                {paying ? 'Processing…' : 'Pay & Register'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HackathonCard;
