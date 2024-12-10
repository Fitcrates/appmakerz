import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { sendEmail } from '../services/emailService';
import type { EmailForm } from '../types/email.types';

const initialState: EmailForm = {
  name: '',
  email: '',
  message: ''
};

export const useEmailForm = () => {
  const [formData, setFormData] = useState<EmailForm>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await sendEmail(formData);
      
      if (response.status === 200) {
        toast.success('Thank you! Your message has been sent successfully.');
        setFormData(initialState);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast.error('Sorry, there was a problem sending your message. Please try again.');
      console.error('Contact form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return {
    formData,
    isSubmitting,
    handleSubmit,
    handleChange
  };
};