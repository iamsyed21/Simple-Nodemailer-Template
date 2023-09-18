import express from 'express';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/sendemail', async (req, res) => {
  // Honeypot validation
  if (req.body.honeypot) {
    return res.status(400).json({ message: 'Bot detected' });
  }

  // Email validation
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(req.body.email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Nodemailer setup
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });



  const mailOptions = {
    from: req.body.email,
    to: 'the21codes@gmail.com',
    subject: req.body.subject,
    text: `Name: ${req.body.name}\nEmail: ${req.body.email}\nMessage: ${req.body.message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
