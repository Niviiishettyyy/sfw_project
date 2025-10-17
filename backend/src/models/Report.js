import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['open', 'review', 'resolved', 'rejected'], default: 'open' },
    attachments: [{ type: String }],
    reward: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Report = mongoose.model('Report', reportSchema);

export default Report;
