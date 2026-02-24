import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import { sendEmail } from '../services/emailService';
import type { EmailForm } from '../types/email.types';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const initialState: FormData = {
  name: '',
  email: '',
  message: '',
};

export const useEmailForm = () => {
  const [formData, setFormData] = useState<FormData>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const location = useLocation();
  const { language } = useLanguage();
  const t = translations[language].contact.form;

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(hash.split('?')[1]);
      const plan = searchParams.get('plan');
      
      if (plan) {
        setFormData((prev) => ({
          ...prev,
          message: `${t.planMessage} ${plan}.`,
        }));
      }
    };

    // Initial check
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [t]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await sendEmail(formData);

      if (response.status === 200) {
        toast.success(t.success);
        setFormData(initialState);
        setIsSuccess(true);
      } else {
        toast.error(t.error);
      }
    } catch (error) {
      toast.error(t.error);
      console.error('Error sending email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    isSuccess,
    handleChange,
    handleSubmit,
  };
};
