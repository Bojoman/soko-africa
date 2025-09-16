"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQSection({ 
  faqs, 
  title = "Frequently Asked Questions",
  subtitle = "Find answers to common questions",
  userType = "customer",
  showContactCTA = true,
  maxHeight = "max-h-96",
  className = "",
  onFAQClick = null
}) {
  const [openItems, setOpenItems] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Reset open items when faqs change
  useEffect(() => {
    setOpenItems(new Set());
  }, [faqs]);

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);

    // Call callback if provided
    if (onFAQClick) {
      onFAQClick(faqs[index], index, newOpenItems.has(index));
    }
  };

  // Default FAQs for different user types
  const getDefaultFAQs = (type) => {
    const faqTemplates = {
      customer: [
        {
          question: "How secure is my payment information on your platform?",
          answer: "We use industry-standard SSL encryption and partner with trusted payment processors to ensure your financial data is completely secure. All transactions are processed through PCI-compliant systems with bank-level security measures."
        },
        {
          question: "What makes SokoAfrica different from other African marketplaces?",
          answer: "SokoAfrica focuses exclusively on authentic African products with verified sellers, fair trade practices, and direct support to African communities. We provide end-to-end logistics, quality assurance, and transparent supply chain tracking."
        },
        {
          question: "Can I track my order from Africa to my doorstep?",
          answer: "Yes! Our platform offers real-time tracking from the moment your order is placed until it reaches your door. You'll receive updates at every stage including processing, shipping, customs, and final delivery."
        },
        {
          question: "Is there a limit to the number of products I can order?",
          answer: "No, there's no limit on the number of products you can order. However, some items may have quantity restrictions due to availability or shipping regulations. We'll notify you if any limits apply to your specific order."
        },
        {
          question: "Do you offer customer support and assistance for international buyers?",
          answer: "Absolutely! We provide 24/7 customer support in multiple languages, including English, French, and local African languages. Our team can help with orders, shipping, customs, and any questions about African products."
        }
      ],
      seller: [
        {
          question: "How do I become a verified seller on SokoAfrica?",
          answer: "To become a verified seller, you need to complete our application process, provide business documentation, and undergo our quality verification. We'll review your products and business practices to ensure they meet our standards for authentic African products."
        },
        {
          question: "What are the commission rates for sellers?",
          answer: "Our commission rates vary by product category and volume. Generally, we charge 8-15% commission on sales, with lower rates for high-volume sellers. We also offer promotional rates for new sellers during their first 90 days."
        },
        {
          question: "How do I manage my inventory and orders?",
          answer: "Our seller dashboard provides comprehensive tools for inventory management, order processing, and analytics. You can track sales, manage stock levels, process orders, and communicate with customers all in one place."
        },
        {
          question: "What support do you provide to African sellers?",
          answer: "We offer extensive support including business development guidance, marketing assistance, logistics coordination, and financial services. Our team helps you scale your business and reach global markets effectively."
        },
        {
          question: "How do I handle shipping and logistics?",
          answer: "We provide end-to-end logistics support including packaging guidelines, shipping coordination, customs documentation, and tracking. Our logistics partners ensure your products reach customers safely and on time."
        }
      ],
      partner: [
        {
          question: "What types of partnerships does SokoAfrica offer?",
          answer: "We offer various partnership opportunities including logistics partnerships, payment processing partnerships, marketing collaborations, and technology integrations. Each partnership is tailored to mutual benefits and growth."
        },
        {
          question: "How can I become a logistics partner?",
          answer: "Logistics partners must have established networks in Africa and target markets, proven track records in international shipping, and the capacity to handle our volume requirements. Contact our partnerships team to discuss opportunities."
        },
        {
          question: "What are the benefits of partnering with SokoAfrica?",
          answer: "Partners benefit from access to our growing customer base, shared marketing resources, technology integration, and revenue sharing opportunities. We also provide co-marketing support and business development assistance."
        },
        {
          question: "How do partnership agreements work?",
          answer: "Partnership agreements are customized based on the type of partnership and mutual goals. We typically offer revenue sharing, marketing support, and technology integration in exchange for quality service delivery and growth commitment."
        }
      ]
    };

    return faqTemplates[type] || faqTemplates.customer;
  };

  const faqData = faqs || getDefaultFAQs(userType);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const chevronVariants = {
    closed: { rotate: 0 },
    open: { rotate: 180 }
  };

  const contentVariants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        height: {
          duration: 0.3,
          ease: "easeInOut"
        },
        opacity: {
          duration: 0.2,
          ease: "easeInOut"
        }
      }
    },
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        height: {
          duration: 0.3,
          ease: "easeInOut"
        },
        opacity: {
          duration: 0.2,
          delay: 0.1,
          ease: "easeInOut"
        }
      }
    }
  };

  return (
    <motion.div 
      className={`max-w-4xl mx-auto px-6 py-16 ${className}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Title */}
      <motion.div 
        className="text-center mb-12"
        variants={titleVariants}
      >
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          <span className="text-gray-900">{title.split(' ').slice(0, -1).join(' ')} </span>
          <span className="text-orange-600">{title.split(' ').slice(-1)[0]}</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </motion.div>

      {/* FAQ Items */}
      <motion.div 
        className="space-y-4"
        variants={containerVariants}
      >
        {faqData.map((faq, index) => {
          const isOpen = openItems.has(index);
          
          return (
            <motion.div
              key={index}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Question */}
              <motion.button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset"
                whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                whileTap={{ backgroundColor: "rgba(243, 244, 246, 1)" }}
              >
                <motion.h3 
                  className="text-lg font-semibold text-gray-900 pr-4"
                  initial={false}
                  animate={{ 
                    color: isOpen ? "#ea580c" : "#111827"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {faq.question}
                </motion.h3>
                <div className="flex-shrink-0">
                  <motion.div 
                    className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center"
                    whileHover={{ 
                      backgroundColor: "#ea580c",
                      scale: 1.1,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.div
                      variants={chevronVariants}
                      animate={isOpen ? "open" : "closed"}
                      transition={{ 
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }}
                    >
                      <ChevronDown 
                        size={20} 
                        className="text-white"
                      />
                    </motion.div>
                  </motion.div>
                </div>
              </motion.button>

              {/* Answer */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    variants={contentVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="overflow-hidden"
                  >
                    <motion.div 
                      className="px-6 pb-5"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ 
                        duration: 0.2,
                        delay: 0.1
                      }}
                    >
                      <div className="border-t border-gray-100 pt-4">
                        <motion.p 
                          className="text-gray-700 leading-relaxed"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {faq.answer}
                        </motion.p>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Contact CTA */}
      {showContactCTA && (
        <motion.div 
          className="mt-12 text-center"
          variants={itemVariants}
        >
          <motion.div 
            className="bg-gradient-to-r from-orange-50 to-green-50 rounded-2xl p-8"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              transition: { duration: 0.3 }
            }}
          >
            <motion.h3 
              className="text-2xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Still have questions?
            </motion.h3>
            <motion.p 
              className="text-gray-600 mb-6 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Our {userType === 'seller' ? 'seller' : userType === 'partner' ? 'partnership' : 'customer'} support team is here to help you with any questions.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button 
                className="bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg"
                whileHover={{ 
                  backgroundColor: "#ea580c",
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Support
              </motion.button>
              <motion.button 
                className="border-2 border-orange-600 text-orange-600 font-semibold px-8 py-3 rounded-lg"
                whileHover={{ 
                  backgroundColor: "#ea580c",
                  color: "white",
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                Live Chat
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
