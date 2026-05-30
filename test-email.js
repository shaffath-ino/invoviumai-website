import { sendEmail } from './server/utils/sendEmail.js';

const testEmail = async () => {
  const result = await sendEmail('tvenkateshwaran14@gmail.com', 'Test Email from Backend', '123456');
  console.log('Result:', result);
};

testEmail().catch(err => console.error('Script Error:', err));
