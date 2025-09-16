import { NextResponse } from 'next/server';

// Mock FAQ data - in production, this would come from a database
const faqData = {
  customer: [
    {
      id: 'customer-1',
      question: "How secure is my payment information on your platform?",
      answer: "We use industry-standard SSL encryption and partner with trusted payment processors to ensure your financial data is completely secure. All transactions are processed through PCI-compliant systems with bank-level security measures.",
      category: 'security',
      priority: 1,
      tags: ['payment', 'security', 'encryption']
    },
    {
      id: 'customer-2',
      question: "What makes SokoAfrica different from other African marketplaces?",
      answer: "SokoAfrica focuses exclusively on authentic African products with verified sellers, fair trade practices, and direct support to African communities. We provide end-to-end logistics, quality assurance, and transparent supply chain tracking.",
      category: 'general',
      priority: 2,
      tags: ['marketplace', 'authentic', 'african']
    },
    {
      id: 'customer-3',
      question: "Can I track my order from Africa to my doorstep?",
      answer: "Yes! Our platform offers real-time tracking from the moment your order is placed until it reaches your door. You'll receive updates at every stage including processing, shipping, customs, and final delivery.",
      category: 'shipping',
      priority: 3,
      tags: ['tracking', 'shipping', 'delivery']
    },
    {
      id: 'customer-4',
      question: "Is there a limit to the number of products I can order?",
      answer: "No, there's no limit on the number of products you can order. However, some items may have quantity restrictions due to availability or shipping regulations. We'll notify you if any limits apply to your specific order.",
      category: 'orders',
      priority: 4,
      tags: ['orders', 'quantity', 'limits']
    },
    {
      id: 'customer-5',
      question: "Do you offer customer support and assistance for international buyers?",
      answer: "Absolutely! We provide 24/7 customer support in multiple languages, including English, French, and local African languages. Our team can help with orders, shipping, customs, and any questions about African products.",
      category: 'support',
      priority: 5,
      tags: ['support', 'international', 'languages']
    }
  ],
  seller: [
    {
      id: 'seller-1',
      question: "How do I become a verified seller on SokoAfrica?",
      answer: "To become a verified seller, you need to complete our application process, provide business documentation, and undergo our quality verification. We'll review your products and business practices to ensure they meet our standards for authentic African products.",
      category: 'onboarding',
      priority: 1,
      tags: ['verification', 'application', 'quality']
    },
    {
      id: 'seller-2',
      question: "What are the commission rates for sellers?",
      answer: "Our commission rates vary by product category and volume. Generally, we charge 8-15% commission on sales, with lower rates for high-volume sellers. We also offer promotional rates for new sellers during their first 90 days.",
      category: 'pricing',
      priority: 2,
      tags: ['commission', 'rates', 'pricing']
    },
    {
      id: 'seller-3',
      question: "How do I manage my inventory and orders?",
      answer: "Our seller dashboard provides comprehensive tools for inventory management, order processing, and analytics. You can track sales, manage stock levels, process orders, and communicate with customers all in one place.",
      category: 'management',
      priority: 3,
      tags: ['dashboard', 'inventory', 'orders']
    },
    {
      id: 'seller-4',
      question: "What support do you provide to African sellers?",
      answer: "We offer extensive support including business development guidance, marketing assistance, logistics coordination, and financial services. Our team helps you scale your business and reach global markets effectively.",
      category: 'support',
      priority: 4,
      tags: ['support', 'business', 'development']
    },
    {
      id: 'seller-5',
      question: "How do I handle shipping and logistics?",
      answer: "We provide end-to-end logistics support including packaging guidelines, shipping coordination, customs documentation, and tracking. Our logistics partners ensure your products reach customers safely and on time.",
      category: 'logistics',
      priority: 5,
      tags: ['shipping', 'logistics', 'packaging']
    }
  ],
  partner: [
    {
      id: 'partner-1',
      question: "What types of partnerships does SokoAfrica offer?",
      answer: "We offer various partnership opportunities including logistics partnerships, payment processing partnerships, marketing collaborations, and technology integrations. Each partnership is tailored to mutual benefits and growth.",
      category: 'types',
      priority: 1,
      tags: ['partnerships', 'logistics', 'technology']
    },
    {
      id: 'partner-2',
      question: "How can I become a logistics partner?",
      answer: "Logistics partners must have established networks in Africa and target markets, proven track records in international shipping, and the capacity to handle our volume requirements. Contact our partnerships team to discuss opportunities.",
      category: 'logistics',
      priority: 2,
      tags: ['logistics', 'shipping', 'networks']
    },
    {
      id: 'partner-3',
      question: "What are the benefits of partnering with SokoAfrica?",
      answer: "Partners benefit from access to our growing customer base, shared marketing resources, technology integration, and revenue sharing opportunities. We also provide co-marketing support and business development assistance.",
      category: 'benefits',
      priority: 3,
      tags: ['benefits', 'revenue', 'marketing']
    },
    {
      id: 'partner-4',
      question: "How do partnership agreements work?",
      answer: "Partnership agreements are customized based on the type of partnership and mutual goals. We typically offer revenue sharing, marketing support, and technology integration in exchange for quality service delivery and growth commitment.",
      category: 'agreements',
      priority: 4,
      tags: ['agreements', 'revenue', 'customization']
    }
  ]
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userType = searchParams.get('userType') || 'customer';
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let faqs = faqData[userType] || faqData.customer;

    // Filter by category if provided
    if (category) {
      faqs = faqs.filter(faq => faq.category === category);
    }

    // Search functionality
    if (search) {
      const searchLower = search.toLowerCase();
      faqs = faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchLower) ||
        faq.answer.toLowerCase().includes(searchLower) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort by priority
    faqs.sort((a, b) => a.priority - b.priority);

    return NextResponse.json({
      success: true,
      faqs,
      total: faqs.length,
      userType,
      filters: {
        category,
        search
      }
    });

  } catch (error) {
    console.error('FAQ API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch FAQs',
        faqs: faqData.customer // Fallback to customer FAQs
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userType, question, answer, category, priority, tags } = body;

    // In production, this would save to a database
    // For now, we'll just return a success response
    console.log('New FAQ submission:', { userType, question, answer, category, priority, tags });

    return NextResponse.json({
      success: true,
      message: 'FAQ submitted successfully',
      id: `new-${Date.now()}`
    });

  } catch (error) {
    console.error('FAQ Submission Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit FAQ' 
      },
      { status: 500 }
    );
  }
}
