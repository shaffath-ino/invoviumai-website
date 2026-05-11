import { sendEmail } from './server/utils/sendEmail.js';

sendEmail('test@example.com', 'Test OTP', '123456')
  .then(res => console.log('Result:', res))
  .catch(err => console.error('Script Error:', err));
