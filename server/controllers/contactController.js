import { sendContactEmail } from '../utils/sendEmail.js';

export const submitContact = async (req, res) => {
  const { entity, email, subject, reqs } = req.body;

  if (!entity || !email || !subject || !reqs) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const success = await sendContactEmail(entity, email, subject, reqs);
    if (!success) {
      return res.status(500).json({ error: 'Failed to send contact request via email provider.' });
    }
    res.status(200).json({ message: 'Request sent successfully. Our team will contact you shortly.' });
  } catch (error) {
    console.error('Contact submit error:', error);
    res.status(500).json({ error: 'Server error while processing contact request' });
  }
};
