import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

let posts = []; // Temporary storage for posts

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the Email Sending Service!');
});

// Endpoint to fetch all posts
app.get('/posts', (req, res) => {
  res.json(posts);
});

// Endpoint to add a new post (from the admin panel)
app.post('/posts', (req, res) => {
  const { title, content, date } = req.body;

  if (!title || !content || !date) {
    return res.status(400).json({ message: 'Title, content, and date are required.' });
  }

  const newPost = { id: posts.length + 1, title, content, date };
  posts.push(newPost);

  res.status(201).json(newPost);
});

// POST route for sending emails
app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please provide all required fields (name, email, message).' });
  }

  try {
    // Create the transporter for nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Message from ${name} (${email})`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      replyTo: email,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log('Email service configured for:', process.env.EMAIL_USER);
});
