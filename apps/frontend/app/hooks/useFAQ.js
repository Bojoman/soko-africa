"use client";
import { useState, useEffect, useCallback } from 'react';

export function useFAQ(userType = 'customer', apiEndpoint = '/api/faqs') {
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Default FAQs for different user types
  const getDefaultFAQs = useCallback((type) => {
    const faqTemplates = {
      customer: [
        {
          id: 'customer-1',
          question: "How secure is my payment information on your platform?",
          answer: "We use industry-standard SSL encryption and partner with trusted payment processors to ensure your financial data is completely secure. All transactions are processed through PCI-compliant systems with bank-level security measures.",
          category: 'security',
          priority: 1
        },
        {
          id: 'customer-2',
          question: "What makes SokoAfrica different from other African marketplaces?",
          answer: "SokoAfrica focuses exclusively on authentic African products with verified sellers, fair trade practices, and direct support to African communities. We provide end-to-end logistics, quality assurance, and transparent supply chain tracking.",
          category: 'general',
          priority: 2
        },
        {
          id: 'customer-3',
          question: "Can I track my order from Africa to my doorstep?",
          answer: "Yes! Our platform offers real-time tracking from the moment your order is placed until it reaches your door. You'll receive updates at every stage including processing, shipping, customs, and final delivery.",
          category: 'shipping',
          priority: 3
        },
        {
          id: 'customer-4',
          question: "Is there a limit to the number of products I can order?",
          answer: "No, there's no limit on the number of products you can order. However, some items may have quantity restrictions due to availability or shipping regulations. We'll notify you if any limits apply to your specific order.",
          category: 'orders',
          priority: 4
        },
        {
          id: 'customer-5',
          question: "Do you offer customer support and assistance for international buyers?",
          answer: "Absolutely! We provide 24/7 customer support in multiple languages, including English, French, and local African languages. Our team can help with orders, shipping, customs, and any questions about African products.",
          category: 'support',
          priority: 5
        }
      ],
      seller: [
        {
          id: 'seller-1',
          question: "How do I become a verified seller on SokoAfrica?",
          answer: "To become a verified seller, you need to complete our application process, provide business documentation, and undergo our quality verification. We'll review your products and business practices to ensure they meet our standards for authentic African products.",
          category: 'onboarding',
          priority: 1
        },
        {
          id: 'seller-2',
          question: "What are the commission rates for sellers?",
          answer: "Our commission rates vary by product category and volume. Generally, we charge 8-15% commission on sales, with lower rates for high-volume sellers. We also offer promotional rates for new sellers during their first 90 days.",
          category: 'pricing',
          priority: 2
        },
        {
          id: 'seller-3',
          question: "How do I manage my inventory and orders?",
          answer: "Our seller dashboard provides comprehensive tools for inventory management, order processing, and analytics. You can track sales, manage stock levels, process orders, and communicate with customers all in one place.",
          category: 'management',
          priority: 3
        },
        {
          id: 'seller-4',
          question: "What support do you provide to African sellers?",
          answer: "We offer extensive support including business development guidance, marketing assistance, logistics coordination, and financial services. Our team helps you scale your business and reach global markets effectively.",
          category: 'support',
          priority: 4
        },
        {
          id: 'seller-5',
          question: "How do I handle shipping and logistics?",
          answer: "We provide end-to-end logistics support including packaging guidelines, shipping coordination, customs documentation, and tracking. Our logistics partners ensure your products reach customers safely and on time.",
          category: 'logistics',
          priority: 5
        }
      ],
      partner: [
        {
          id: 'partner-1',
          question: "What types of partnerships does SokoAfrica offer?",
          answer: "We offer various partnership opportunities including logistics partnerships, payment processing partnerships, marketing collaborations, and technology integrations. Each partnership is tailored to mutual benefits and growth.",
          category: 'types',
          priority: 1
        },
        {
          id: 'partner-2',
          question: "How can I become a logistics partner?",
          answer: "Logistics partners must have established networks in Africa and target markets, proven track records in international shipping, and the capacity to handle our volume requirements. Contact our partnerships team to discuss opportunities.",
          category: 'logistics',
          priority: 2
        },
        {
          id: 'partner-3',
          question: "What are the benefits of partnering with SokoAfrica?",
          answer: "Partners benefit from access to our growing customer base, shared marketing resources, technology integration, and revenue sharing opportunities. We also provide co-marketing support and business development assistance.",
          category: 'benefits',
          priority: 3
        },
        {
          id: 'partner-4',
          question: "How do partnership agreements work?",
          answer: "Partnership agreements are customized based on the type of partnership and mutual goals. We typically offer revenue sharing, marketing support, and technology integration in exchange for quality service delivery and growth commitment.",
          category: 'agreements',
          priority: 4
        }
      ]
    };

    return faqTemplates[type] || faqTemplates.customer;
  }, []);

  // Fetch FAQs from API
  const fetchFAQs = useCallback(async () => {
    if (!apiEndpoint) {
      setFaqs(getDefaultFAQs(userType));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiEndpoint}?userType=${userType}`);
      if (!response.ok) {
        throw new Error('Failed to fetch FAQs');
      }
      
      const data = await response.json();
      if (data.success) {
        setFaqs(data.faqs || getDefaultFAQs(userType));
      } else {
        throw new Error(data.error || 'Failed to fetch FAQs');
      }
    } catch (err) {
      setError(err.message);
      setFaqs(getDefaultFAQs(userType)); // Fallback to default
    } finally {
      setIsLoading(false);
    }
  }, [apiEndpoint, userType, getDefaultFAQs]);

  // Load FAQs on mount or when dependencies change
  useEffect(() => {
    fetchFAQs();
  }, [fetchFAQs]);

  // Get FAQs by category
  const getFAQsByCategory = useCallback((category) => {
    return faqs.filter(faq => faq.category === category);
  }, [faqs]);

  // Search FAQs
  const searchFAQs = useCallback((query) => {
    if (!query) return faqs;
    
    const lowercaseQuery = query.toLowerCase();
    return faqs.filter(faq => 
      faq.question.toLowerCase().includes(lowercaseQuery) ||
      faq.answer.toLowerCase().includes(lowercaseQuery)
    );
  }, [faqs]);

  // Get FAQ by ID
  const getFAQById = useCallback((id) => {
    return faqs.find(faq => faq.id === id);
  }, [faqs]);

  // Submit new FAQ
  const submitFAQ = useCallback(async (faqData) => {
    if (!apiEndpoint) {
      throw new Error('API endpoint not configured');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userType,
          ...faqData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit FAQ');
      }

      const data = await response.json();
      if (data.success) {
        // Refresh FAQs after successful submission
        await fetchFAQs();
        return data;
      } else {
        throw new Error(data.error || 'Failed to submit FAQ');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiEndpoint, userType, fetchFAQs]);

  // Refresh FAQs
  const refreshFAQs = useCallback(() => {
    fetchFAQs();
  }, [fetchFAQs]);

  return {
    faqs,
    isLoading,
    error,
    getFAQsByCategory,
    searchFAQs,
    getFAQById,
    submitFAQ,
    refreshFAQs,
    userType
  };
}
