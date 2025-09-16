"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Search, Filter, X } from 'lucide-react';

export default function EnhancedFAQSection({ 
  faqs, 
  title = "Frequently Asked Questions",
  subtitle = "Find answers to common questions",
  userType = "customer",
  showSearch = true,
  showCategories = true,
  className = ""
}) {
  const [openItems, setOpenItems] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredFAQs, setFilteredFAQs] = useState([]);

  // Get unique categories from FAQs
  const categories = ['all', ...new Set(faqs?.map(faq => faq.category).filter(Boolean))];

  // Filter FAQs based on search and category
  useEffect(() => {
    let filtered = faqs || [];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        (faq.tags && faq.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    setFilteredFAQs(filtered);
  }, [faqs, searchQuery, selectedCategory]);

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  const searchVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.2
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
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1]
        },
        opacity: {
          duration: 0.3,
          ease: "easeInOut"
        }
      }
    },
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        height: {
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1]
        },
        opacity: {
          duration: 0.3,
          delay: 0.1,
          ease: "easeInOut"
        }
      }
    }
  };

  return (
    <motion.div 
      className={`max-w-5xl mx-auto px-6 py-16 ${className}`}
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

      {/* Search and Filter */}
      {(showSearch || showCategories) && (
        <motion.div 
          className="mb-8 space-y-4"
          variants={searchVariants}
        >
          {showSearch && (
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          )}

          {showCategories && categories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Results Count */}
      {searchQuery && (
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-gray-600">
            {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''} found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </motion.div>
      )}

      {/* FAQ Items */}
      <motion.div 
        className="space-y-4"
        variants={containerVariants}
      >
        <AnimatePresence mode="wait">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index) => {
              const isOpen = openItems.has(index);
              
              return (
                <motion.div
                  key={`${faq.id || index}-${selectedCategory}-${searchQuery}`}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                  variants={itemVariants}
                  layout
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.9,
                    transition: { duration: 0.2 }
                  }}
                >
                  {/* Question */}
                  <motion.button
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset"
                    whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                    whileTap={{ backgroundColor: "rgba(243, 244, 246, 1)" }}
                  >
                    <div className="flex-1 pr-4">
                      <motion.h3 
                        className="text-lg font-semibold text-gray-900"
                        initial={false}
                        animate={{ 
                          color: isOpen ? "#ea580c" : "#111827"
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {faq.question}
                      </motion.h3>
                      {faq.category && (
                        <motion.span 
                          className="inline-block mt-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          {faq.category}
                        </motion.span>
                      )}
                    </div>
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
                            stiffness: 400,
                            damping: 25
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
                            duration: 0.3,
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
                            {faq.tags && faq.tags.length > 0 && (
                              <motion.div 
                                className="flex flex-wrap gap-2 mt-4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                              >
                                {faq.tags.map((tag, tagIndex) => (
                                  <span 
                                    key={tagIndex}
                                    className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          ) : (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-gray-400 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No FAQs found</h3>
              <p className="text-gray-600">
                {searchQuery 
                  ? `No results found for "${searchQuery}". Try a different search term.`
                  : 'No FAQs available in this category.'
                }
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
