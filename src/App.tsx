import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Check, Mail, Phone, MapPin, BookOpen, Users, Briefcase, TrendingUp, Award, Filter} from 'lucide-react';
import './App.css';
// Context for global state
interface AppContextType {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  enquiryOpen: boolean;
  openEnquiry: (course?: typeof mockCourses[0]) => void;
  closeEnquiry: () => void;
  selectedCourse: typeof mockCourses[0] | null;
  setSelectedCourse: (course: typeof mockCourses[0] | null) => void;
  courses: typeof mockCourses;
  addCourse: (course: typeof mockCourses[0]) => void;
  updateCourse: (course: typeof mockCourses[0]) => void;
  deleteCourse: (courseId: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

// ADMIN PIN - Change this to your desired PIN
const ADMIN_PIN = 'Salient@123';

// Mock course data from brochure
const mockCourses = [
  {
    id: 1,
    slug: 'data-science-genai-crash',
    title: 'Data Science & GenAI Crash Course',
    category: 'Data Science & AI',
    level: 'Beginner',
    duration: '2 Months',
    priceText: 'INR 30,000',
    status: 'Enrolling Now',
    shortDescription: 'Fast-paced, beginner-friendly introduction to Data Science and AI',
    fullDescription: 'A comprehensive crash course covering Excel, SQL, Python, Power BI/Tableau, basic statistics, and foundational machine learning. Perfect for those looking to start their journey in data analytics.',
    curriculum: [
      { title: 'Excel & SQL Fundamentals', topics: ['Data cleaning', 'Analysis', 'Dashboards', 'Querying'] },
      { title: 'Python for Data Science', topics: ['Variables, loops, functions', 'NumPy & Pandas', 'Matplotlib'] },
      { title: 'Statistics & EDA', topics: ['Descriptive statistics', 'Hypothesis testing', 'Exploratory analysis'] },
      { title: 'ML Basics', topics: ['Regression', 'Classification', 'Model evaluation'] }
    ],
    projects: ['2-3 mini projects', 'Real dataset analysis'],
    tools: ['Excel', 'SQL', 'Python', 'Power BI', 'Tableau'],
    outcomes: ['Job-ready for Analyst Assistant roles', 'Course Completion Certificate'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop'
  },
  {
    id: 2,
    slug: 'data-science-genai-certificate',
    title: 'Data Science & GenAI Certificate Program',
    category: 'Data Science & AI',
    level: 'Intermediate',
    duration: '4 Months',
    priceText: 'INR 65,000',
    status: 'Enrolling Now',
    shortDescription: 'Structured program with moderate depth in Data Science and Generative AI',
    fullDescription: 'Master the complete data science pipeline from analytics to GenAI. Build real projects including an AI chatbot and comprehensive portfolio.',
    curriculum: [
      { title: 'Data & Analytics Fundamentals', topics: ['Excel', 'SQL', 'Power BI/Tableau', 'Data storytelling'] },
      { title: 'Python & Statistics', topics: ['Python for DS', 'NumPy/Pandas', 'Statistical analysis', 'EDA'] },
      { title: 'Machine Learning', topics: ['Regression & Classification', 'Feature engineering', 'Model evaluation'] },
      { title: 'Deep Learning & NLP', topics: ['Neural networks', 'Text preprocessing', 'Sentiment analysis'] },
      { title: 'GenAI & LLMs', topics: ['Transformers', 'Prompt engineering', 'RAG workflows'] },
      { title: 'Capstone Project', topics: ['AI Chatbot', 'Portfolio creation'] }
    ],
    projects: ['4-6 practical projects', 'AI Chatbot', 'Capstone project'],
    tools: ['Python', 'SQL', 'Power BI', 'TensorFlow', 'PyTorch', 'LangChain'],
    outcomes: ['Job-ready for Data Analyst & ML Trainee roles', 'Professional Certification'],
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format&fit=crop'
  },
  {
    id: 3,
    slug: 'data-science-genai-diploma',
    title: 'Data Science & GenAI Diploma Program',
    category: 'Data Science & AI',
    level: 'Advanced',
    duration: '7 Months',
    priceText: 'INR 90,000',
    status: 'Enrolling Now',
    shortDescription: 'Advanced, in-depth, industry-ready comprehensive program',
    fullDescription: 'Our flagship program offering dual certification and internship letter. Comprehensive coverage from fundamentals to advanced GenAI applications with 10+ projects.',
    curriculum: [
      { title: 'Core Foundations', topics: ['Excel, SQL, Python', 'Statistics & EDA', 'Power BI/Tableau'] },
      { title: 'Machine Learning', topics: ['Supervised learning', 'Unsupervised learning', 'Feature engineering'] },
      { title: 'Advanced ML', topics: ['Decision Trees', 'Random Forest', 'XGBoost', 'Time Series'] },
      { title: 'Deep Learning', topics: ['Neural networks', 'CNN/RNN', 'Transfer learning'] },
      { title: 'NLP & Text Analytics', topics: ['Text preprocessing', 'Sentiment analysis', 'Classification'] },
      { title: 'GenAI & LLMs', topics: ['Transformers', 'Prompt engineering', 'Fine-tuning', 'RAG workflows'] },
      { title: 'Deployment', topics: ['ML/DL projects', 'AI Chatbot', 'Portfolio'] }
    ],
    projects: ['10+ projects', 'AI Chatbot', 'Capstone project', 'Industry simulation'],
    tools: ['Python', 'SQL', 'TensorFlow', 'PyTorch', 'LangChain', 'Hugging Face', 'OpenAI API'],
    outcomes: ['Job-ready for Data Scientist, ML Engineer, AI Engineer roles', 'Dual Certification + Internship Letter'],
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop'
  },
  {
    id: 4,
    slug: 'generative-ai-prompt-engineering',
    title: 'Generative AI & Prompt Engineering',
    category: 'Generative AI & LLM Programs',
    level: 'Intermediate',
    duration: '3 Months',
    priceText: 'Coming Soon',
    status: 'Launching Soon',
    shortDescription: 'Master prompt engineering and GenAI applications',
    fullDescription: 'Deep dive into prompt engineering, LLM applications, and building GenAI solutions for real-world use cases.',
    curriculum: [
      { title: 'GenAI Fundamentals', topics: ['LLM basics', 'Transformer architecture', 'API usage'] },
      { title: 'Prompt Engineering', topics: ['Advanced techniques', 'Chain-of-thought', 'Few-shot learning'] },
      { title: 'RAG Applications', topics: ['Vector databases', 'Document retrieval', 'Context management'] }
    ],
    projects: ['Chatbot applications', 'RAG systems', 'Custom GenAI tools'],
    tools: ['OpenAI API', 'LangChain', 'ChromaDB', 'Pinecone'],
    outcomes: ['GenAI Developer ready', 'Certificate of Completion'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop'
  },
  {
    id: 5,
    slug: 'ai-healthcare',
    title: 'AI in Healthcare & Life Sciences',
    category: 'Industry-Specific AI Programs',
    level: 'Advanced',
    duration: '5 Months',
    priceText: 'Coming Soon',
    status: 'Under Development',
    shortDescription: 'Apply AI to healthcare challenges and medical data',
    fullDescription: 'Specialized program focusing on AI applications in healthcare including medical imaging, patient data analysis, and clinical decision support systems.',
    curriculum: [
      { title: 'Healthcare AI Fundamentals', topics: ['Medical data types', 'Privacy & compliance', 'Domain knowledge'] },
      { title: 'Medical Imaging', topics: ['Computer vision', 'Image classification', 'Segmentation'] },
      { title: 'Clinical Applications', topics: ['Predictive models', 'Risk assessment', 'Treatment optimization'] }
    ],
    projects: ['Medical image analysis', 'Patient outcome prediction', 'Clinical decision support'],
    tools: ['Python', 'TensorFlow', 'Medical imaging libraries', 'FHIR APIs'],
    outcomes: ['Healthcare AI Specialist', 'Industry Certificate'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop'
  },
  {
    id: 6,
    slug: 'computer-vision',
    title: 'Computer Vision & Autonomous Systems',
    category: 'DeepTech & Emerging Technologies',
    level: 'Advanced',
    duration: '6 Months',
    priceText: 'Coming Soon',
    status: 'Planned',
    shortDescription: 'Build intelligent vision systems and autonomous applications',
    fullDescription: 'Advanced program covering computer vision, object detection, tracking, and autonomous system development.',
    curriculum: [
      { title: 'Computer Vision Basics', topics: ['Image processing', 'Feature extraction', 'Classical CV'] },
      { title: 'Deep Learning for Vision', topics: ['CNNs', 'Object detection', 'Segmentation', 'Tracking'] },
      { title: 'Autonomous Systems', topics: ['Sensor fusion', 'Path planning', 'Real-time processing'] }
    ],
    projects: ['Object detection system', 'Visual tracking', 'Autonomous navigation'],
    tools: ['OpenCV', 'PyTorch', 'YOLO', 'ROS'],
    outcomes: ['Computer Vision Engineer ready', 'Advanced Certification'],
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop'
  }
];

// Stats from brochure
const stats = [
  { value: 30, prefix: '', suffix: '%+', label: 'YoY Growth in AI & Data Roles' },
  { value: 11, prefix: '', suffix: 'M+', label: 'New AI & Data Jobs Globally' },
  { value: 1, prefix: '', suffix: 'T', label: 'AI Market by 2030' },
  { value: 40, prefix: '', suffix: '%', label: 'Higher Salaries for Certified Professionals' }
];

// Animated counter component
const Counter = ({ end, duration = 2, prefix = '', suffix = '' }: { end: number; duration?: number; prefix?: string; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{prefix}{count}{suffix}</span>;
};

// Header Component
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentPage, setCurrentPage, openEnquiry } = useApp();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', page: 'home' },
    { label: 'Courses', page: 'courses' },
    { label: 'About', page: 'about' },
    { label: 'FAQs', page: 'faqs' },
    { label: 'Contact', page: 'contact' },
    
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <motion.div
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => setCurrentPage('home')}
          >
            <img
              className="w-28 h-24 object-contain mr-2 inline-block"
              src='./logo.png'
              alt='Salient Learnings Logo'
            />
           
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => setCurrentPage(item.page)}
                className={`text-sm font-medium transition-colors ${
                  currentPage === item.page
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {item.label}
              </button>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openEnquiry()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Speak to an Advisor
            </motion.button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4"
            >
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => {
                    setCurrentPage(item.page);
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left py-2 px-4 ${
                    currentPage === item.page
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  openEnquiry();
                  setIsOpen(false);
                }}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg mt-2"
              >
                Speak to an Advisor
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

// Hero Section
const Hero = () => {
  const { setCurrentPage, openEnquiry } = useApp();

  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
       <motion.h1
  className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 
             bg-linear-to-r from-blue-900 via-purple-900 to-pink-900 
             bg-clip-text text-transparent
             leading-[1.15] pb-2"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2, duration: 0.8 }}
>
  Salient Learnings
</motion.h1>

          
          <motion.p
            className="text-xl md:text-2xl text-gray-700 mb-4 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Building Future-Ready Talent in AI, Data & Deep Technologies
          </motion.p>
          
          <motion.p
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Mentor-led, hands-on programs in Data Science, AI, Generative AI & Industry-Focused DeepTech, designed for real careers—not just certificates.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage('courses')}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              Explore Programs
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openEnquiry()}
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Speak to an Advisor
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
              className="bg-white rounded-xl p-6 shadow-lg text-center"
            >
              <div className="text-4xl font-bold text-blue-600 mb-2">
                <Counter
                  end={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Why Salient Section
const WhySalient = () => {
  const pillars = [
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Mentor-Led Guidance',
      description: 'Learn directly from industry practitioners who simplify complex concepts and accelerate skill growth.'
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Hands-On Learning',
      description: 'Work on real datasets, industry projects, and AI-driven tasks that simulate actual workplace scenarios.'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Adaptive Paths',
      description: 'Personalized modules tailored to each learner\'s pace, goals, and strengths.'
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: 'Community Culture',
      description: 'Engage with peers, mentors, and experts in an interactive environment that promotes innovation.'
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Why Salient Learnings
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your ideal learning partner for AI and data science excellence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-blue-600 mb-4">{pillar.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">{pillar.title}</h3>
              <p className="text-gray-600">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Course Card Component
const CourseCard = ({ course, onLearnMore, onEnquiry }: { course: typeof mockCourses[0]; onLearnMore: (course: typeof mockCourses[0]) => void; onEnquiry: (course: typeof mockCourses[0]) => void }) => {
  const statusColors: Record<string, string> = {
    'Enrolling Now': 'bg-green-100 text-green-800',
    'Launching Soon': 'bg-blue-100 text-blue-800',
    'Under Development': 'bg-yellow-100 text-yellow-800',
    'Planned': 'bg-gray-100 text-gray-800'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[course.status] || 'bg-gray-100 text-gray-800'}`}>
            {course.status}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-3">
          <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
            {course.category}
          </span>
        </div>
        
        <h3 className="text-xl font-bold mb-2 text-gray-900">{course.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{course.shortDescription}</p>
        
        <div className="flex flex-wrap gap-2 mb-4 text-sm text-gray-500">
          <span className="flex items-center">
            <Award className="w-4 h-4 mr-1" /> {course.level}
          </span>
          <span>•</span>
          <span>{course.duration}</span>
          <span>•</span>
          <span className="font-semibold text-blue-600">{course.priceText}</span>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => onLearnMore(course)}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Learn More
          </button>
          <button
            onClick={() => onEnquiry(course)}
            className="flex-1 border-2 border-blue-600 text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Enquiry
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Course Detail Modal
const CourseDetailModal = ({ course, onClose }: { course: typeof mockCourses[0] | null; onClose: () => void }) => {
  if (!course) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-64 object-cover rounded-t-2xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto">
          <div className="mb-4">
            <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
              {course.category}
            </span>
          </div>
          
          <h2 className="text-3xl font-bold mb-4 text-gray-900">{course.title}</h2>
          
          <div className="flex flex-wrap gap-4 mb-6 text-sm">
            <span className="flex items-center text-gray-600">
              <Award className="w-5 h-5 mr-2 text-blue-600" /> {course.level}
            </span>
            <span className="text-gray-600">{course.duration}</span>
            <span className="font-semibold text-blue-600">{course.priceText}</span>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Overview</h3>
            <p className="text-gray-600 leading-relaxed">{course.fullDescription}</p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Curriculum</h3>
            <div className="space-y-4">
              {course.curriculum.map((module, index) => (
                <div key={index} className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{module.title}</h4>
                  <ul className="space-y-1">
                    {module.topics.map((topic, idx) => (
                      <li key={idx} className="text-gray-600 flex items-start">
                        <Check className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-1" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Projects & Capstone</h3>
            <ul className="space-y-2">
              {course.projects.map((project, index) => (
                <li key={index} className="flex items-start text-gray-600">
                  <Check className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  {project}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Tools & Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {course.tools.map((tool, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Career Outcomes</h3>
            <ul className="space-y-2">
              {course.outcomes.map((outcome, index) => (
                <li key={index} className="flex items-start text-gray-600">
                  <Award className="w-5 h-5 mr-2 text-purple-600 flex-shrink-0 mt-0.5" />
                  {outcome}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                onClose();
                // This would open enquiry modal in actual implementation
              }}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Apply Now
            </button>
            <a
              href="mailto:info@salientlearnings.com"
              className="flex-1 border-2 border-blue-600 text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
            >
              Contact Advisor
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Enquiry Modal
const EnquiryModal = ({ isOpen, onClose, selectedCourse = null }: { isOpen: boolean; onClose: () => void; selectedCourse?: any }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    program: selectedCourse?.title || '',
    message: '',
    contactMethod: 'email',
  });
 // const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (selectedCourse) {
      setFormData(prev => ({ ...prev, program: selectedCourse.title }));
    }
  }, [selectedCourse]);

  // const handleSubmit = async (e: { preventDefault: () => void; }) => {
  //   e.preventDefault();
    
  //   // Mock API call
  //   console.log('Enquiry submitted:', formData);
    
  //   // Show success message
  //   setSubmitted(true);
  //   setTimeout(() => {
  //     setSubmitted(false);
  //     onClose();
  //     setFormData({
  //       name: '',
  //       email: '',
  //       phone: '',
  //       program: '',
  //       message: '',
  //       contactMethod: 'email'
  //     });
  //   }, 2000);
  // };

  if (!isOpen) return null;

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Get in Touch</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

       
          <form action="https://formspree.io/f/xanogwrj"
                   method="POST"
                    className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                id="phone"
                      name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="+91-XXXXXXXXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program Interested In
              </label>
              <input
                type="text"
                id="program"
                    name="program"
                value={formData.program}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Select a program"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Contact Method
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="email"
                     id="contactMethod"
                      name="contactMethod"
                    checked={formData.contactMethod === 'email'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Email
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="phone"
                    id="contactMethod"
                      name="contactMethod"
                    checked={formData.contactMethod === 'phone'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Phone
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
              id="message"
                    name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                placeholder="Tell us about your goals..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Submit Enquiry
            </button>

            <p className="text-xs text-gray-500 text-center">
              Or email us directly at{' '}
              <a href="mailto:info@salientlearnings.com" className="text-blue-600 hover:underline">
                info@salientlearnings.com
              </a>
            </p>
          </form>
              </motion.div>
    </motion.div>
  );
};

// Courses Page
const CoursesPage = () => {
  const { openEnquiry, setSelectedCourse, courses } = useApp();
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<typeof mockCourses[0] | null>(null);
  const [filters, setFilters] = useState({
    level: 'All',
    category: 'All',
    status: 'All'
  });

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const categories = ['All', 'Data Science & AI', 'Generative AI & LLM Programs', 'Industry-Specific AI Programs', 'DeepTech & Emerging Technologies'];
  const statuses = ['All', 'Enrolling Now', 'Launching Soon', 'Under Development', 'Planned'];

  const filteredCourses = courses.filter(course => {
    if (filters.level !== 'All' && course.level !== filters.level) return false;
    if (filters.category !== 'All' && course.category !== filters.category) return false;
    if (filters.status !== 'All' && course.status !== filters.status) return false;
    return true;
  });

  const handleLearnMore = (course: typeof mockCourses[0]) => {
    setSelectedCourseDetail(course);
  };

  const handleEnquiry = (course: { id: number; slug: string; title: string; category: string; level: string; duration: string; priceText: string; status: string; shortDescription: string; fullDescription: string; curriculum: { title: string; topics: string[]; }[]; projects: string[]; tools: string[]; outcomes: string[]; image: string; } | null) => {
    setSelectedCourse(course);
    openEnquiry();
  };

  return (
    <div className="pt-24 pb-20 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Explore Our Programs
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our comprehensive range of AI and Data Science programs designed for every skill level
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select
                value={filters.level}
                onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <CourseCard
                course={course}
                onLearnMore={handleLearnMore}
                onEnquiry={handleEnquiry}
              />
            </motion.div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No courses found matching your filters.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedCourseDetail && (
          <CourseDetailModal
            course={selectedCourseDetail}
            onClose={() => setSelectedCourseDetail(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// About Page
const AboutPage = () => {
  return (
    <div className="pt-24 pb-20 px-4 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">About Salient Learnings</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Salient Learnings is a future-focused education platform dedicated to building industry-ready talent in AI, Data Science, Generative AI & Deep Technologies through mentor-led, hands-on learning.
          </p>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Vision</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            To become a leading AI & DeepTech talent ecosystem, shaping innovators, professionals, and technology leaders globally.
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Mission</h2>
          <ul className="space-y-3 text-lg text-gray-600">
            <li className="flex items-start">
              <Check className="w-6 h-6 mr-3 text-blue-600 flex-shrink-0 mt-1" />
              Bridge academia and industry with practical, outcome-focused learning
            </li>
            <li className="flex items-start">
              <Check className="w-6 h-6 mr-3 text-blue-600 flex-shrink-0 mt-1" />
              Deliver project-driven education that prepares learners for real-world challenges
            </li>
            <li className="flex items-start">
              <Check className="w-6 h-6 mr-3 text-blue-600 flex-shrink-0 mt-1" />
              Enable real employability and foster innovation in emerging technologies
            </li>
          </ul>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-2 text-gray-900">Krishna Kanth T R</h3>
              <p className="text-blue-600 font-medium mb-3">Director - Strategy & Growth</p>
              <a
                href="https://www.linkedin.com/in/krishna-kanth-t-r/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                LinkedIn Profile →
              </a>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-2 text-gray-900">Jagadish Gadi Reddy</h3>
              <p className="text-blue-600 font-medium mb-3">Director - Academics & Delivery</p>
              <a
                href="https://www.linkedin.com/in/jagadishgadireddy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                LinkedIn Profile →
              </a>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

// FAQs Page
const FAQsPage = () => {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const faqs = [
    {
      category: 'Program FAQs',
      questions: [
        {
          q: 'Who can enroll in these programs?',
          a: 'Our programs are designed for aspiring data scientists, working professionals looking to upskill, fresh graduates, and anyone interested in AI and data science. No prior coding experience is required for beginner courses.'
        },
        {
          q: 'Do I need prior coding knowledge?',
          a: 'For our Crash Course and Certificate programs, no prior coding knowledge is required. We start from basics. For advanced programs, some programming familiarity is helpful but not mandatory.'
        },
        {
          q: 'Are these programs beginner-friendly?',
          a: 'Yes! We offer programs for all skill levels - from complete beginners to advanced practitioners. Our adaptive learning paths ensure personalized progression.'
        }
      ]
    },
    {
      category: 'Learning & Delivery',
      questions: [
        {
          q: 'Are classes online or hybrid?',
          a: 'All our programs are delivered online with live, instructor-led sessions. This allows flexibility while maintaining high engagement through real-time interaction.'
        },
        {
          q: 'What is the time commitment?',
          a: 'Time commitment varies by program: Crash Course (2 months), Certificate (4 months), Diploma (7 months). Typically 10-15 hours per week including classes, assignments, and projects.'
        },
        {
          q: 'What is the mentorship model?',
          a: 'You get direct access to industry practitioners who guide you through concepts, projects, and career development. Mentors provide personalized feedback and support throughout your journey.'
        }
      ]
    },
    {
      category: 'Careers & Certification',
      questions: [
        {
          q: 'Do you provide placement assistance?',
          a: 'Yes! We offer structured career support including resume building, interview preparation, mock interviews, and access to our hiring network of partner companies.'
        },
        {
          q: 'What type of certificate will I receive?',
          a: 'Depending on your program: Course Completion Certificate (Crash Course), Professional Certification (Certificate Program), or Dual Certification with Internship Letter (Diploma Program).'
        },
        {
          q: 'What are the career outcomes?',
          a: 'Our graduates transition into roles like Data Analyst, Business Analyst, ML Engineer, Data Scientist, and AI Engineer. Certified professionals typically see 20-40% salary increases.'
        }
      ]
    },
    {
      category: 'Payments',
      questions: [
        {
          q: 'Are installment options available?',
          a: 'Yes, we offer flexible payment plans to make your upskilling journey affordable and stress-free. Contact us to discuss payment options that suit your needs.'
        },
        {
          q: 'What is your refund policy?',
          a: 'We offer a satisfaction guarantee. If you\'re not satisfied within the first two weeks, you can request a full refund. Contact our support team for details.'
        }
      ]
    }
  ];

  return (
    <div className="pt-24 pb-20 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about our programs
          </p>
        </motion.div>

        <div className="space-y-8">
          {faqs.map((section, sectionIndex) => (
            <motion.div
              key={sectionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-900">{section.category}</h2>
              <div className="space-y-3">
                {section.questions.map((faq, faqIndex) => {
                  const globalIndex = `${sectionIndex}-${faqIndex}`;
                  const isOpen = openIndex === globalIndex;

                  return (
                    <div
                      key={faqIndex}
                      className="bg-white rounded-xl shadow-md overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900">{faq.q}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-500 transition-transform ${
                            isOpen ? 'transform rotate-180' : ''
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="px-6 pb-4 text-gray-600">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Contact Page
const ContactPage = () => {
  const { openEnquiry } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    program: '',
    message: ''
  });
 // const [submitted, setSubmitted] = useState(false);

  // const handleSubmit = (e: { preventDefault: () => void; }) => {
  //   e.preventDefault();
  //   console.log('Contact form submitted:', formData);
  //   setSubmitted(true);
  //   setTimeout(() => {
  //     setSubmitted(false);
  //     setFormData({ name: '', email: '', phone: '', program: '', message: '' });
  //   }, 3000);
  // };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="pt-24 pb-20 px-4 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600">
            We're here to help you start your learning journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Get in Touch</h2>
            <p className="text-gray-600 mb-8">
              Whether you're exploring our programs, seeking clarity about the learning journey, or looking for personalized recommendations, our team is always here to help.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-lg p-3 mr-4">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                  <a
                    href="tel:+919966357297"
                    className="text-blue-600 hover:underline"
                  >
                    +91-9966357297
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 rounded-lg p-3 mr-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <a
                    href="mailto:info@salientlearnings.com"
                    className="text-blue-600 hover:underline"
                  >
                    info@salientlearnings.com
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 rounded-lg p-3 mr-4">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                  <p className="text-gray-600">KPHB, Hyderabad</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">Quick Enquiry</h3>
              <p className="text-gray-600 mb-4">
                Need immediate assistance? Click below to open our enquiry form.
              </p>
              <button
                onClick={() => openEnquiry()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors w-full"
              >
                Open Enquiry Form
              </button>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-50 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Send us a Message</h2>

            
              <form action="https://formspree.io/f/mzdpzzql"
                   method="POST"
                    className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                      name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                      name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="+91-XXXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Program Interest
                  </label>
                  <input
                    type="text"
                    id="program"
                    name="program"
                    value={formData.program}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Which program are you interested in?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                  id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                    placeholder="Tell us about your learning goals..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Send Message
                </button>
              </form>
            
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Home Page
const HomePage = () => {
  return (
    <div>
      <Hero />
      <WhySalient />
      
      {/* Featured Program Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Featured Program
            </h2>
            <p className="text-xl text-gray-600">
              Our comprehensive Data Science & AI certification program
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-5xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-64 md:h-auto">
                <img
                  src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format&fit=crop"
                  alt="Data Science & AI"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-bold mb-4 text-gray-900">
                  Data Science & AI Certification
                </h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start text-gray-600">
                    <Check className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                    Complete pipeline: Analytics → ML → DL → GenAI
                  </li>
                  <li className="flex items-start text-gray-600">
                    <Check className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                    Build real projects including an AI Chatbot
                  </li>
                  <li className="flex items-start text-gray-600">
                    <Check className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                    Job-oriented outcomes with placement support
                  </li>
                  <li className="flex items-start text-gray-600">
                    <Check className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                    Mentor-led learning with industry practitioners
                  </li>
                </ul>
                <a href = "/DSAI_Generic_Brochure.pdf" download>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {}}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors w-full"
                >
                  Download Full Curriculum
                </motion.button>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Learning Experience Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              The Salient Learning Experience
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Maximizing engagement through personalized guidance and practical application
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Personalized Mentorship',
                description: 'Get one-on-one guidance from experienced practitioners who understand your goals',
                icon: <Users className="w-12 h-12" />
              },
              {
                title: 'Continuous Assessment',
                description: 'Track your progress with regular evaluations and milestone achievements',
                icon: <TrendingUp className="w-12 h-12" />
              },
              {
                title: 'LMS Access',
                description: 'All learning materials, assignments, and resources in one seamless platform',
                icon: <BookOpen className="w-12 h-12" />
              },
              {
                title: 'Placement Support',
                description: 'Career guidance, interview prep, and access to hiring opportunities',
                icon: <Briefcase className="w-12 h-12" />
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="text-blue-600 mr-4">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Footer Component
const Footer = () => {
  const { setCurrentPage } = useApp();

  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <img
              className="w-28 h-18 object-contain mr-2 inline-block"
              src='./logo.png'
              alt='Salient Learnings Logo'
            />
            <p className="text-gray-400">
              Building future-ready talent in AI, Data & Deep Technologies
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Programs</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button onClick={() => setCurrentPage('courses')} className="hover:text-white transition-colors">
                  Data Science & AI
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('courses')} className="hover:text-white transition-colors">
                  Generative AI
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('courses')} className="hover:text-white transition-colors">
                  Industry AI
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('courses')} className="hover:text-white transition-colors">
                  DeepTech
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button onClick={() => setCurrentPage('about')} className="hover:text-white transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('faqs')} className="hover:text-white transition-colors">
                  FAQs
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('contact')} className="hover:text-white transition-colors">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <a href="tel:+919966357297" className="hover:text-white transition-colors">
                  +91-9966357297
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <a href="mailto:info@salientlearnings.com" className="hover:text-white transition-colors">
                  info@salientlearnings.com
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-1" />
                <span>KPHB, Hyderabad</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Salient Learnings. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  // Admin state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Courses state - starts with mock data but can be modified
  const [courses, setCourses] = useState(mockCourses);

  const openEnquiry = (course: any = null) => {
    setSelectedCourse(course);
    setEnquiryOpen(true);
  };

  const closeEnquiry = () => {
    setEnquiryOpen(false);
    setSelectedCourse(null);
  };

  // Admin functions
  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    setCurrentPage("admin-dashboard");
    // update URL too
    window.history.pushState({}, "", "/admin-dashboard");
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentPage("home");
    window.history.pushState({}, "", "/");
  };

  const addCourse = (course: any) => {
    setCourses([...courses, course]);
  };

  const updateCourse = (updatedCourse: any) => {
    setCourses(
      courses.map((course: any) =>
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
  };

  const deleteCourse = (courseId: any) => {
    setCourses(courses.filter((course: any) => course.id !== courseId));
  };

  /**
   * Central navigation helper.
   * Accepts either a page name like 'home' or a path like '/admin'.
   * Updates state and browser history.
   */
  const navigateTo = useCallback(
    (routeOrPath: string) => {
      if (!routeOrPath) return;

      // normalize: if starts with '/', remove it
      let route = routeOrPath.startsWith("/")
        ? routeOrPath.slice(1)
        : routeOrPath;

      // map empty route or root to 'home'
      if (route === "" || route === "/") route = "home";

      // allow visitors to use routes like '/admin' or '/courses'
      const validPages = [
        "home",
        "courses",
        "about",
        "faqs",
        "contact",
        "admin",
        "admin-dashboard",
      ];

      if (!validPages.includes(route)) {
        // fallback to home if unknown
        route = "home";
      }

      // if admin route and already authenticated, go to admin-dashboard
      if (route === "admin" && isAdminAuthenticated) {
        setCurrentPage("admin-dashboard");
        window.history.pushState({}, "", "/admin-dashboard");
        return;
      }

      setCurrentPage(route);

      // Update browser URL for nicer UX
      if (route === "home") {
        window.history.pushState({}, "", "/");
      } else {
        window.history.pushState({}, "", `/${route}`);
      }
    },
    [isAdminAuthenticated]
  );

  /**
   * On mount: handle direct URL visits like https://site.com/admin
   * and listen for back/forward (popstate)
   */
  useEffect(() => {
    const handleInitialPath = () => {
      const path = window.location.pathname || "/";
      // call navigateTo with the current path (e.g. '/admin')
      navigateTo(path === "/" ? "home" : path);
    };

    handleInitialPath();

    const onPopState = () => {
      const path = window.location.pathname || "/";
      navigateTo(path === "/" ? "home" : path);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [navigateTo]);

  /**
   * Keep your admin logic: if user is on 'admin' but is authenticated,
   * redirect to admin-dashboard automatically.
   * (This ensures typing '/admin' after login works smoothly.)
   */
  useEffect(() => {
    if (currentPage === "admin" && isAdminAuthenticated) {
      setCurrentPage("admin-dashboard");
      window.history.pushState({}, "", "/admin-dashboard");
    }
    // note: we DO NOT redirect unauthenticated admin attempts here;
    // we keep the 'admin' login page available.
  }, [currentPage, isAdminAuthenticated]);

  const contextValue = {
    currentPage,
    setCurrentPage,
    // expose navigateTo so Header/search can call navigateTo(query)
    navigateTo,
    enquiryOpen,
    openEnquiry,
    closeEnquiry,
    selectedCourse,
    setSelectedCourse,
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    // hint for Header: hide admin link in header UI (Header can read this from context)
    hideAdminLink: true,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-white">
        {/* Show header only if not on admin pages */}
        {currentPage !== "admin" &&
          currentPage !== "admin-dashboard" && <Header />}

        <main>
          <AnimatePresence mode="wait">
            {currentPage === "home" && <HomePage key="home" />}
            {currentPage === "courses" && <CoursesPage key="courses" />}
            {currentPage === "about" && <AboutPage key="about" />}
            {currentPage === "faqs" && <FAQsPage key="faqs" />}
            {currentPage === "contact" && <ContactPage key="contact" />}
            {currentPage === "admin" && !isAdminAuthenticated && (
              <AdminLogin key="admin-login" onLogin={handleAdminLogin} />
            )}
            {currentPage === "admin-dashboard" && isAdminAuthenticated && (
              <AdminDashboard
                key="admin-dashboard"
                onLogout={handleAdminLogout}
                // pass admin helpers to dashboard if it needs them
                addCourse={addCourse}
                updateCourse={updateCourse}
                deleteCourse={deleteCourse}
                courses={courses}
              />
            )}
          </AnimatePresence>
        </main>

        {/* Show footer only if not on admin pages */}
        {currentPage !== "admin" && currentPage !== "admin-dashboard" && (
          <Footer />
        )}

        <AnimatePresence>
          {enquiryOpen && (
            <EnquiryModal
              isOpen={enquiryOpen}
              onClose={closeEnquiry}
              selectedCourse={selectedCourse}
            />
          )}
        </AnimatePresence>
      </div>
    </AppContext.Provider>
  );
};

export default App;

// ==================== ADMIN COMPONENTS START ====================

// Admin Login Component
const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      onLogin();
      setError('');
    } else {
      setError('Invalid PIN. Please try again.');
      setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Access</h2>
          <p className="text-gray-600">Enter your PIN to access the admin panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Access PIN
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter  PIN"
              maxLength={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-center text-2xl tracking-widest"
              autoFocus
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Access Admin Panel
          </button>
        </form>

        
      </motion.div>
    </div>
  );
};

// Course Form Component (for Add/Edit)
const CourseForm = ({ course, onSave, onCancel }: { course: typeof mockCourses[0] | null; onSave: (course: typeof mockCourses[0]) => void; onCancel: () => void }) => {
  const [formData, setFormData] = useState(
    course || {
      id: 0,
      slug: '',
      title: '',
      category: 'Data Science & AI',
      level: 'Beginner',
      duration: '',
      priceText: '',
      status: 'Enrolling Now',
      shortDescription: '',
      fullDescription: '',
      curriculum: [{ title: '', topics: [''] }],
      projects: [''],
      tools: [''],
      outcomes: [''],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop'
    }
  );

  const categories = ['Data Science & AI', 'Generative AI & LLM Programs', 'Industry-Specific AI Programs', 'DeepTech & Emerging Technologies'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const statuses = ['Enrolling Now', 'Launching Soon', 'Under Development', 'Planned'];

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      id: formData.id || Date.now(),
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    };
    onSave(dataToSave);
  };

  const addCurriculumModule = () => {
    setFormData({
      ...formData,
      curriculum: [...formData.curriculum, { title: '', topics: [''] }]
    });
  };

  const removeCurriculumModule = (index: number) => {
    const newCurriculum = formData.curriculum.filter((_, i) => i !== index);
    setFormData({ ...formData, curriculum: newCurriculum });
  };

  const updateCurriculumModule = (index: number, field: string, value: string) => {
    const newCurriculum = [...formData.curriculum];
  (newCurriculum[index] as any)[field] = value;
    setFormData({ ...formData, curriculum: newCurriculum });
  };

  const addTopic = (moduleIndex: number) => {
    const newCurriculum = [...formData.curriculum];
    newCurriculum[moduleIndex].topics.push('');
    setFormData({ ...formData, curriculum: newCurriculum });
  };

  const updateTopic = (moduleIndex: number, topicIndex: number, value: string) => {
    const newCurriculum = [...formData.curriculum];
    newCurriculum[moduleIndex].topics[topicIndex] = value;
    setFormData({ ...formData, curriculum: newCurriculum });
  };

  const removeTopic = (moduleIndex: number, topicIndex: number) => {
    const newCurriculum = [...formData.curriculum];
    newCurriculum[moduleIndex].topics = newCurriculum[moduleIndex].topics.filter((_, i) => i !== topicIndex);
    setFormData({ ...formData, curriculum: newCurriculum });
  };

  const addArrayItem = (field: 'projects' | 'tools' | 'outcomes') => {
    const currentArray = formData[field];
    setFormData({ ...formData, [field]: [...currentArray, ''] });
  };

  const updateArrayItem = (field: 'projects' | 'tools' | 'outcomes', index: number, value: string) => {
    const currentArray = formData[field];
    const newArray = [...currentArray];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const removeArrayItem = (field: 'projects' | 'tools' | 'outcomes', index: number) => {
    const currentArray = formData[field];
    const newArray = currentArray.filter((_: any, i: any) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-8 max-h-[80vh] overflow-y-auto"
    >
      <h3 className="text-2xl font-bold mb-6 text-gray-900">
        {course ? 'Edit Course' : 'Add New Course'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Level *
            </label>
            <select
              required
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            >
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration *
            </label>
            <input
              type="text"
              required
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="e.g., 3 Months"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price *
            </label>
            <input
              type="text"
              required
              value={formData.priceText}
              onChange={(e) => setFormData({ ...formData, priceText: e.target.value })}
              placeholder="e.g., INR 50,000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL
          </label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Description *
          </label>
          <textarea
            required
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Description *
          </label>
          <textarea
            required
            value={formData.fullDescription}
            onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Curriculum */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Curriculum Modules
            </label>
            <button
              type="button"
              onClick={addCurriculumModule}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Add Module
            </button>
          </div>
          
          {formData.curriculum.map((module, moduleIndex) => (
            <div key={moduleIndex} className="mb-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <input
                  type="text"
                  value={module.title}
                  onChange={(e) => updateCurriculumModule(moduleIndex, 'title', e.target.value)}
                  placeholder="Module Title"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="button"
                  onClick={() => removeCurriculumModule(moduleIndex)}
                  className="ml-2 text-red-600 hover:text-red-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="ml-4 space-y-2">
                {module.topics.map((topic, topicIndex) => (
                  <div key={topicIndex} className="flex gap-2">
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => updateTopic(moduleIndex, topicIndex, e.target.value)}
                      placeholder="Topic"
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeTopic(moduleIndex, topicIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addTopic(moduleIndex)}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  + Add Topic
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Projects */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">Projects</label>
            <button
              type="button"
              onClick={() => addArrayItem('projects')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Add Project
            </button>
          </div>
          {formData.projects.map((project, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={project}
                onChange={(e) => updateArrayItem('projects', index, e.target.value)}
                placeholder="Project description"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="button"
                onClick={() => removeArrayItem('projects', index)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Tools */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">Tools & Technologies</label>
            <button
              type="button"
              onClick={() => addArrayItem('tools')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Add Tool
            </button>
          </div>
          {formData.tools.map((tool, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={tool}
                onChange={(e) => updateArrayItem('tools', index, e.target.value)}
                placeholder="Tool name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="button"
                onClick={() => removeArrayItem('tools', index)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Outcomes */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">Career Outcomes</label>
            <button
              type="button"
              onClick={() => addArrayItem('outcomes')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Add Outcome
            </button>
          </div>
          {formData.outcomes.map((outcome, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={outcome}
                onChange={(e) => updateArrayItem('outcomes', index, e.target.value)}
                placeholder="Career outcome"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="button"
                onClick={() => removeArrayItem('outcomes', index)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-4 border-t">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {course ? 'Update Course' : 'Add Course'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};

// Admin Dashboard Component
const AdminDashboard = ({ onLogout, addCourse, updateCourse, deleteCourse, courses }: { onLogout: () => void; addCourse: (course: any) => void; updateCourse: (updatedCourse: any) => void; deleteCourse: (courseId: any) => void; courses: typeof mockCourses }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<typeof mockCourses[0] | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<typeof mockCourses[0] | null>(null);

  const handleSaveCourse = (courseData: { title: any; id?: number; slug?: string; category?: string; level?: string; duration?: string; priceText?: string; status?: string; shortDescription?: string; fullDescription?: string; curriculum?: { title: string; topics: string[]; }[]; projects?: string[]; tools?: string[]; outcomes?: string[]; image?: string; }) => {
    if (editingCourse) {
      updateCourse({ ...courseData, id: editingCourse.id, slug: editingCourse.slug });
    } else {
      const newCourse = {
        ...courseData,
        id: Date.now(),
        slug: courseData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      };
      addCourse(newCourse);
    }
    setShowForm(false);
    setEditingCourse(null);
  };

  const handleEdit = (courseId: number) => {
    setEditingCourse(courseId ? courses.find(c => c.id === courseId) || null : null);
    setShowForm(true);
  };

  const handleDelete = (courseId: number) => {
    deleteCourse(courseId);
    setDeleteConfirm(null);
  };

  const handleAddNew = () => {
    setEditingCourse(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Admin Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage courses and content</p>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">{courses.length}</div>
            <div className="text-gray-600">Total Courses</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {courses.filter(c => c.status === 'Enrolling Now').length}
            </div>
            <div className="text-gray-600">Active Courses</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {courses.filter(c => c.status === 'Launching Soon').length}
            </div>
            <div className="text-gray-600">Coming Soon</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {courses.filter(c => c.status === 'Planned').length}
            </div>
            <div className="text-gray-600">Planned</div>
          </div>
        </div>

        {/* Add Course Button */}
        {!showForm && (
          <div className="mb-8">
            <button
              onClick={handleAddNew}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span className="text-xl">+</span> Add New Course
            </button>
          </div>
        )}

        {/* Course Form */}
        {showForm && (
          <div className="mb-8">
            <CourseForm
              course={editingCourse}
              onSave={handleSaveCourse}
              onCancel={() => {
                setShowForm(false);
                setEditingCourse(null);
              }}
            />
          </div>
        )}

        {/* Courses List */}
        {!showForm && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">All Courses</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-12 h-12 rounded-lg object-cover mr-3"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{course.title}</div>
                            <div className="text-sm text-gray-500">{course.duration}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{course.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {course.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          course.status === 'Enrolling Now' ? 'bg-green-100 text-green-800' :
                          course.status === 'Launching Soon' ? 'bg-blue-100 text-blue-800' :
                          course.status === 'Under Development' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {course.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.priceText}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(course as any)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(course)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => setDeleteConfirm(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Course?</h3>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to delete "<strong>{deleteConfirm.title}</strong>"? This action cannot be undone.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(deleteConfirm.id)}
                      className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ==================== ADMIN COMPONENTS END ====================