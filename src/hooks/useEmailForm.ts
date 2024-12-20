import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { sendEmail } from '../services/emailService';
import type { EmailForm } from '../types/email.types';

const initialState: EmailForm = {
  name: '',
  email: '',
  message: '',
};

export const useEmailForm = () => {
  const [formData, setFormData] = useState<EmailForm>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();

  // Extract 'plan' parameter from the URL and pre-fill the message
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(hash.split('?')[1]);
      const plan = searchParams.get('plan');
      
      if (plan) {
        setFormData((prev) => ({
          ...prev,
          message: `Hello, I am interested in the ${plan} plan.`,
        }));
      }
    };

    // Initial check
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Try sending the email using the `sendEmail` service
      const response = await sendEmail(formData);

      if (response.status === 200) {
        toast.success('Message sent successfully!');
        setFormData(initialState); // Reset form on success
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('Error sending email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
};
