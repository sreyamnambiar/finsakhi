import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Video } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';

interface CourseSection {
  title: string;
  points: string[];
}

interface Course {
  id: number;
  title: string;
  description: string;
  color: string;
  videoUrl?: string;
  sections: CourseSection[];
}

const courses: Course[] = [
  {
    id: 1,
    title: 'Saving Money - Overview',
    description: 'Learn effective saving strategies',
    color: 'from-blue-500 to-blue-600',
    videoUrl: '/how_to_use_upi.mp4',
    sections: [
      {
        title: 'Why Saving is Important',
        points: [
          'Build emergency funds for unexpected expenses',
          'Achieve financial goals like buying a house or education',
          'Secure your retirement future',
          'Reduce financial stress and anxiety',
        ],
      },
      {
        title: 'Effective Saving Strategies',
        points: [
          'Start with the 50/30/20 rule: 50% needs, 30% wants, 20% savings',
          'Automate your savings with recurring deposits',
          'Cut unnecessary expenses and track your spending',
          'Use savings accounts with higher interest rates',
        ],
      },
      {
        title: 'Types of Savings Accounts',
        points: [
          'Regular Savings Account: Basic account with minimal balance',
          'Salary Account: No minimum balance requirement',
          'Senior Citizen Account: Higher interest rates for seniors',
          'Zero Balance Account: No maintenance charges',
        ],
      },
      {
        title: 'Tax Benefits on Savings',
        points: [
          'Section 80C: Deductions up to ₹1.5 lakh on savings',
          'PPF (Public Provident Fund): Tax-free returns',
          'ELSS Funds: Tax saving mutual funds',
          'National Savings Certificate: Government-backed savings',
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'UPI Transaction',
    description: 'Digital payment made easy',
    color: 'from-green-500 to-green-600',
    videoUrl: '/how_to_use_upi.mp4',
    sections: [
      {
        title: 'What is UPI?',
        points: [
          'UPI stands for Unified Payments Interface',
          'Instant money transfer between bank accounts',
          'Available 24/7, no bank holidays',
          'Free or minimal charges for transactions',
        ],
      },
      {
        title: 'How to Use UPI',
        points: [
          'Download any UPI app (Google Pay, PhonePe, Paytm)',
          'Link your bank account',
          'Create your unique UPI ID',
          'Set a secure UPI PIN',
          'Start sending and receiving money instantly',
        ],
      },
      {
        title: 'Safety Tips',
        points: [
          'Never share your UPI PIN with anyone',
          'Verify receiver details before sending money',
          'Use strong passwords and enable biometric authentication',
          'Keep your app updated',
        ],
      },
      {
        title: 'Common UPI Transactions',
        points: [
          'Send money to friends and family',
          'Pay for online shopping',
          'Pay utility bills (electricity, water, phone)',
          'Book tickets and make reservations',
          'Scan QR codes at shops and restaurants',
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Home Loan Process',
    description: 'Step-by-step guide to home loans',
    color: 'from-purple-500 to-purple-600',
    sections: [
      {
        title: 'Understanding Home Loans',
        points: [
          'Home loans help you buy property with borrowed money',
          'You repay in monthly installments (EMI)',
          'Interest rates can be fixed or floating',
          'Loan tenure typically ranges from 10-30 years',
        ],
      },
      {
        title: 'Eligibility Requirements',
        points: [
          'Age: 21-65 years',
          'Stable income source',
          'Good credit score (above 750)',
          'Required documents: ID proof, address proof, income proof',
        ],
      },
      {
        title: 'Home Loan Process',
        points: [
          'Check eligibility and calculate affordable EMI',
          'Compare interest rates from different banks',
          'Submit application with required documents',
          'Property verification by bank',
          'Loan approval and disbursement',
        ],
      },
      {
        title: 'Tax Benefits',
        points: [
          'Section 80C: Deduction on principal repayment up to ₹1.5 lakh',
          'Section 24: Deduction on interest up to ₹2 lakh',
          'First-time buyers: Additional deduction of ₹50,000',
        ],
      },
    ],
  },
  {
    id: 4,
    title: 'How to open a bank account',
    description: 'Easy account opening process',
    color: 'from-orange-500 to-orange-600',
    sections: [
      {
        title: 'Types of Bank Accounts',
        points: [
          'Savings Account: For personal savings',
          'Current Account: For business transactions',
          'Fixed Deposit: Lock money for higher interest',
          'Recurring Deposit: Save regularly with fixed deposits',
        ],
      },
      {
        title: 'Documents Required',
        points: [
          'Identity Proof: Aadhaar, PAN card, Passport',
          'Address Proof: Utility bill, Rent agreement',
          'Passport-sized photographs',
          'Initial deposit amount',
        ],
      },
      {
        title: 'Account Opening Process',
        points: [
          'Visit bank branch or apply online',
          'Fill application form with personal details',
          'Submit required documents',
          'Complete KYC (Know Your Customer) verification',
          'Receive account number and passbook',
        ],
      },
      {
        title: 'Banking Services',
        points: [
          'ATM/Debit card for cash withdrawal',
          'Internet banking for online transactions',
          'Mobile banking app',
          'Cheque book for payments',
          'SMS alerts for transactions',
        ],
      },
    ],
  },
  {
    id: 5,
    title: 'What is a Secured Credit Card and how does it work?',
    description: 'Build your credit with secured cards',
    color: 'from-pink-500 to-pink-600',
    sections: [
      {
        title: 'What is a Secured Credit Card?',
        points: [
          'Credit card backed by a fixed deposit',
          'Helps build credit history',
          'Lower risk for banks',
          'Credit limit based on deposit amount',
        ],
      },
      {
        title: 'Benefits',
        points: [
          'Easy approval even with no credit history',
          'Build credit score over time',
          'Earn interest on your deposit',
          'Upgrade to regular credit card later',
        ],
      },
      {
        title: 'How to Apply',
        points: [
          'Open fixed deposit with bank',
          'Apply for secured credit card',
          'Get card with limit 70-90% of deposit',
          'Use card responsibly and pay bills on time',
          'After 1-2 years, upgrade to unsecured card',
        ],
      },
      {
        title: 'Important Points',
        points: [
          'Your deposit remains locked until card is closed',
          'Same terms as regular credit cards apply',
          'Late payments still affect credit score',
          'Interest on deposit continues to accrue',
        ],
      },
    ],
  },
  {
    id: 6,
    title: 'What is a Mutual Fund - Overview',
    description: 'Invest in mutual funds wisely',
    color: 'from-red-500 to-red-600',
    sections: [
      {
        title: 'Understanding Mutual Funds',
        points: [
          'Pool of money from multiple investors',
          'Managed by professional fund managers',
          'Invested in stocks, bonds, or other securities',
          'Suitable for both beginners and experienced investors',
        ],
      },
      {
        title: 'Types of Mutual Funds',
        points: [
          'Equity Funds: Invest in stocks (higher risk, higher returns)',
          'Debt Funds: Invest in bonds (lower risk, stable returns)',
          'Hybrid Funds: Mix of equity and debt',
          'Index Funds: Track market indices',
        ],
      },
      {
        title: 'How to Invest',
        points: [
          'Complete KYC verification',
          'Choose fund based on goals and risk appetite',
          'Start with SIP (Systematic Investment Plan)',
          'Monitor performance regularly',
          'Stay invested for long term',
        ],
      },
      {
        title: 'Key Benefits',
        points: [
          'Professional management of investments',
          'Diversification reduces risk',
          'Start with small amounts (₹500 per month)',
          'Liquidity: Can redeem anytime',
          'Tax benefits on ELSS funds',
        ],
      },
    ],
  },
];

const CourseDetail = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const course = courses.find((c) => c.id === Number(courseId));

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Course not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      {/* Header */}
      <motion.header
        className="px-6 pt-8 pb-6 flex items-center gap-3 bg-white/80 backdrop-blur-sm sticky top-0 z-40 shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => navigate('/learn')}
          className="p-2 hover:bg-pink-100 rounded-lg transition"
        >
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            {course.title}
          </h1>
          <p className="text-sm text-gray-600">{course.description}</p>
        </div>
      </motion.header>

      <div className="px-4 py-6">
        <div className="max-w-5xl mx-auto space-y-8">
        {/* Video Section */}
        {course.videoUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 rounded-3xl overflow-hidden shadow-xl border border-rose-100 max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-rose-50 via-white to-rose-50 p-4">
              <video
                width="100%"
                height="auto"
                controls
                controlsList="nodownload"
                className="w-full aspect-video rounded-2xl"
                onError={(e) => {
                  console.error('Video loading error:', e);
                }}
              >
                <source src={course.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="p-6 bg-gradient-to-r from-pink-50 to-rose-50">
              <div className="flex items-center gap-3 text-pink-600">
                <Video className="w-5 h-5" />
                <span className="font-semibold">Video Tutorial Available</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Course Content */}
        <div className="space-y-6 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-pink-600" />
            Course Content
          </h2>

          {course.sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b-2 border-pink-200">
                {idx + 1}. {section.title}
              </h3>
              <ul className="space-y-3">
                {section.points.map((point, pointIdx) => (
                  <li key={pointIdx} className="flex items-start gap-3 text-gray-700">
                    <span className="text-pink-500 font-bold text-xl mt-0.5">•</span>
                    <span className="flex-1 text-base leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Complete Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate('/learn')}
          className="w-full max-w-3xl mx-auto bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition shadow-xl block"
        >
          Complete & Return to Lessons
        </motion.button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default CourseDetail;
