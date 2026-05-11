import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  dept: { type: String, required: true },
  type: { type: String, required: true },
  location: { type: String, required: true },
  link: { type: String, default: '/contact' },
  experience: { type: String },
  salary: { type: String },
  openings: { type: Number },
  description: { type: String },
  responsibilities: [{ type: String }],
  requirements: [{ type: String }],
  benefits: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);
