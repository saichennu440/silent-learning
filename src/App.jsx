import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Check, Mail, Phone, MapPin, BookOpen, Users, Briefcase, TrendingUp, Award, Star, Move} from 'lucide-react';
import CourseDetailPage from './CourseDetailPage.jsx';
import TermsPage from './terms/TermsPage.jsx';
import PrivacyPolicy from './terms/PrivacyPolicy.jsx';
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import './App.css';


import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { 
  fetchCourses, 
  createCourse, 
  updateCourse as updateCourseDB, 
  deleteCourse as deleteCourseDB 
} from './services/coursesService';
import {supabase, testConnection } from './config/supabase';


const AppContext = createContext(null);

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export { useApp };


// ADMIN PIN - Change this to your desired PIN
const ADMIN_PIN = 'Salient@123';

//mock data//Mock course data from brochure
// const mockCourses = [
//   {
//     id: 1,
//     slug: 'data-science-genai-crash',
//     title: 'Data Science & GenAI Crash Course',
//     category: 'Data Science & AI',
//     level: 'Beginner',
//     duration: '2 Months',
//     priceText: 'INR 30,000',
//     status: 'Enrolling Now',
//     shortDescription: 'Fast-paced, beginner-friendly introduction to Data Science and AI',
//     fullDescription: 'A comprehensive crash course covering Excel, SQL, Python, Power BI/Tableau, basic statistics, and foundational machine learning. Perfect for those looking to start their journey in data analytics.',
//     curriculum: [
//       { title: 'Excel & SQL Fundamentals', topics: ['Data cleaning', 'Analysis', 'Dashboards', 'Querying'] },
//       { title: 'Python for Data Science', topics: ['Variables, loops, functions', 'NumPy & Pandas', 'Matplotlib'] },
//       { title: 'Statistics & EDA', topics: ['Descriptive statistics', 'Hypothesis testing', 'Exploratory analysis'] },
//       { title: 'ML Basics', topics: ['Regression', 'Classification', 'Model evaluation'] }
//     ],
//     projects: ['2-3 mini projects', 'Real dataset analysis'],
//     tools: ['Excel', 'SQL', 'Python', 'Power BI', 'Tableau'],
//     outcomes: ['Job-ready for Analyst Assistant roles', 'Course Completion Certificate'],
//     image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop'
//   },
//   {
//     id: 2,
//     slug: 'data-science-genai-certificate',
//     title: 'Data Science & GenAI Certificate Program',
//     category: 'Data Science & AI',
//     level: 'Intermediate',
//     duration: '4 Months',
//     priceText: 'INR 65,000',
//     status: 'Enrolling Now',
//     shortDescription: 'Structured program with moderate depth in Data Science and Generative AI',
//     fullDescription: 'Master the complete data science pipeline from analytics to GenAI. Build real projects including an AI chatbot and comprehensive portfolio.',
//     curriculum: [
//       { title: 'Data & Analytics Fundamentals', topics: ['Excel', 'SQL', 'Power BI/Tableau', 'Data storytelling'] },
//       { title: 'Python & Statistics', topics: ['Python for DS', 'NumPy/Pandas', 'Statistical analysis', 'EDA'] },
//       { title: 'Machine Learning', topics: ['Regression & Classification', 'Feature engineering', 'Model evaluation'] },
//       { title: 'Deep Learning & NLP', topics: ['Neural networks', 'Text preprocessing', 'Sentiment analysis'] },
//       { title: 'GenAI & LLMs', topics: ['Transformers', 'Prompt engineering', 'RAG workflows'] },
//       { title: 'Capstone Project', topics: ['AI Chatbot', 'Portfolio creation'] }
//     ],
//     projects: ['4-6 practical projects', 'AI Chatbot', 'Capstone project'],
//     tools: ['Python', 'SQL', 'Power BI', 'TensorFlow', 'PyTorch', 'LangChain'],
//     outcomes: ['Job-ready for Data Analyst & ML Trainee roles', 'Professional Certification'],
//     image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format&fit=crop'
//   },
//   {
//     id: 3,
//     slug: 'data-science-genai-diploma',
//     title: 'Data Science & GenAI Diploma Program',
//     category: 'Data Science & AI',
//     level: 'Advanced',
//     duration: '7 Months',
//     priceText: 'INR 90,000',
//     status: 'Enrolling Now',
//     shortDescription: 'Advanced, in-depth, industry-ready comprehensive program',
//     fullDescription: 'Our flagship program offering dual certification and internship letter. Comprehensive coverage from fundamentals to advanced GenAI applications with 10+ projects.',
//     curriculum: [
//       { title: 'Core Foundations', topics: ['Excel, SQL, Python', 'Statistics & EDA', 'Power BI/Tableau'] },
//       { title: 'Machine Learning', topics: ['Supervised learning', 'Unsupervised learning', 'Feature engineering'] },
//       { title: 'Advanced ML', topics: ['Decision Trees', 'Random Forest', 'XGBoost', 'Time Series'] },
//       { title: 'Deep Learning', topics: ['Neural networks', 'CNN/RNN', 'Transfer learning'] },
//       { title: 'NLP & Text Analytics', topics: ['Text preprocessing', 'Sentiment analysis', 'Classification'] },
//       { title: 'GenAI & LLMs', topics: ['Transformers', 'Prompt engineering', 'Fine-tuning', 'RAG workflows'] },
//       { title: 'Deployment', topics: ['ML/DL projects', 'AI Chatbot', 'Portfolio'] }
//     ],
//     projects: ['10+ projects', 'AI Chatbot', 'Capstone project', 'Industry simulation'],
//     tools: ['Python', 'SQL', 'TensorFlow', 'PyTorch', 'LangChain', 'Hugging Face', 'OpenAI API'],
//     outcomes: ['Job-ready for Data Scientist, ML Engineer, AI Engineer roles', 'Dual Certification + Internship Letter'],
//     image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop'
//   },
//   {
//     id: 4,
//     slug: 'generative-ai-prompt-engineering',
//     title: 'Generative AI & Prompt Engineering',
//     category: 'Generative AI & LLM Programs',
//     level: 'Intermediate',
//     duration: '3 Months',
//     priceText: 'Coming Soon',
//     status: 'Launching Soon',
//     shortDescription: 'Master prompt engineering and GenAI applications',
//     fullDescription: 'Deep dive into prompt engineering, LLM applications, and building GenAI solutions for real-world use cases.',
//     curriculum: [
//       { title: 'GenAI Fundamentals', topics: ['LLM basics', 'Transformer architecture', 'API usage'] },
//       { title: 'Prompt Engineering', topics: ['Advanced techniques', 'Chain-of-thought', 'Few-shot learning'] },
//       { title: 'RAG Applications', topics: ['Vector databases', 'Document retrieval', 'Context management'] }
//     ],
//     projects: ['Chatbot applications', 'RAG systems', 'Custom GenAI tools'],
//     tools: ['OpenAI API', 'LangChain', 'ChromaDB', 'Pinecone'],
//     outcomes: ['GenAI Developer ready', 'Certificate of Completion'],
//     image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop'
//   },
//   {
//     id: 5,
//     slug: 'ai-healthcare',
//     title: 'AI in Healthcare & Life Sciences',
//     category: 'Industry-Specific AI Programs',
//     level: 'Advanced',
//     duration: '5 Months',
//     priceText: 'Coming Soon',
//     status: 'Under Development',
//     shortDescription: 'Apply AI to healthcare challenges and medical data',
//     fullDescription: 'Specialized program focusing on AI applications in healthcare including medical imaging, patient data analysis, and clinical decision support systems.',
//     curriculum: [
//       { title: 'Healthcare AI Fundamentals', topics: ['Medical data types', 'Privacy & compliance', 'Domain knowledge'] },
//       { title: 'Medical Imaging', topics: ['Computer vision', 'Image classification', 'Segmentation'] },
//       { title: 'Clinical Applications', topics: ['Predictive models', 'Risk assessment', 'Treatment optimization'] }
//     ],
//     projects: ['Medical image analysis', 'Patient outcome prediction', 'Clinical decision support'],
//     tools: ['Python', 'TensorFlow', 'Medical imaging libraries', 'FHIR APIs'],
//     outcomes: ['Healthcare AI Specialist', 'Industry Certificate'],
//     image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop'
//   },
//   {
//     id: 6,
//     slug: 'computer-vision',
//     title: 'Computer Vision & Autonomous Systems',
//     category: 'DeepTech & Emerging Technologies',
//     level: 'Advanced',
//     duration: '6 Months',
//     priceText: 'Coming Soon',
//     status: 'Planned',
//     shortDescription: 'Build intelligent vision systems and autonomous applications',
//     fullDescription: 'Advanced program covering computer vision, object detection, tracking, and autonomous system development.',
//     curriculum: [
//       { title: 'Computer Vision Basics', topics: ['Image processing', 'Feature extraction', 'Classical CV'] },
//       { title: 'Deep Learning for Vision', topics: ['CNNs', 'Object detection', 'Segmentation', 'Tracking'] },
//       { title: 'Autonomous Systems', topics: ['Sensor fusion', 'Path planning', 'Real-time processing'] }
//     ],
//     projects: ['Object detection system', 'Visual tracking', 'Autonomous navigation'],
//     tools: ['OpenCV', 'PyTorch', 'YOLO', 'ROS'],
//     outcomes: ['Computer Vision Engineer ready', 'Advanced Certification'],
//     image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop'
//   }
// ];

// Stats from brochure
const stats = [
  { value: 30, prefix: '', suffix: '%+', label: 'YoY Growth in AI & Data Roles' },
  { value: 11, prefix: '', suffix: 'M', label: 'New AI & Data Jobs Globally' },
  { value: 1, prefix: '', suffix: 'T', label: 'AI Market by 2030' },
  { value: 40, prefix: '', suffix: '%', label: 'Higher Salaries for Certified Professionals' }
];

// Animated counter component
const Counter = ({ end, duration = 2, prefix = '', suffix = '' }) => {
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
  const [coursesOpen, setCoursesOpen] = useState(false); // desktop hover state
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false); // mobile sublist
  const [scrolled, setScrolled] = useState(false);
  const { currentPage, navigateTo, openEnquiry, courses, openCourseDetail } = useApp();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', page: 'home' },
    { label: 'Technologies', page: 'courses' },
    // { label: 'About', page: 'about' },
    { label: 'FAQs', page: 'faqs' },
    { label: 'Contact', page: 'contact' },
  ];

   const handleCourseClick = (course) => {
    // Open the course detail page (routes to /coursedetail/:slugOrId)
    if (!course) {
      // fallback: go to courses listing
      navigateTo('courses');
      window.history.pushState({}, '', '/courses');
    } else {
      openCourseDetail(course);
    }

    // close menus
    setIsOpen(false);
    setMobileCoursesOpen(false);
    setCoursesOpen(false);

    // scroll to top for UX if needed
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isOpen ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <motion.div
            className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigateTo('home')}

          >
            <img
              className="w-28 h-24 object-contain mr-2 inline-block"
              src="/logo.png"
              alt="Salient Learnings Logo"
            />
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              if (item.page === 'courses') {
                return (
                  <div
                    key={item.page}
                    className="relative"
                    onMouseEnter={() => setCoursesOpen(true)}
                    onMouseLeave={() => setCoursesOpen(false)}
                  >
                    <button
                      onClick={() => navigateTo('courses')}
                      className={`text-sm font-medium transition-colors ${
                        currentPage === item.page
                          ? 'text-blue-600'
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                      aria-haspopup="true"
                      aria-expanded={coursesOpen}
                    >
                      {item.label}
                    </button>

                    {/* Courses dropdown */}
                    <AnimatePresence>
                      {coursesOpen && courses && courses.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 mt-3 w-80 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50"
                        >
                          <div className="p-3 max-h-72 overflow-y-auto">
                            {courses.slice(0, 8).map((course) => (
                              <button
                                key={course.id}
                                onClick={() => handleCourseClick(course)}
                                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 flex flex-col"
                              >
                                <span className="font-semibold text-gray-800 text-sm">
                                  {course.title}
                                </span>
                                <span className="text-xs text-gray-500 truncate">
                                  {course.shortDescription ?? course.subtitle ?? ''}
                                </span>
                              </button>
                            ))}

                            {/* optional "View all courses" link */}
                            <div className="mt-2 border-t pt-2">
                              <button
                                onClick={() => {
                                  navigateTo('courses');
                                  setCoursesOpen(false);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:underline"
                              >
                                View all courses
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              // other nav items
              return (
                <button
                  key={item.page}
                  onClick={() => {
                    navigateTo(item.page);
                    setCoursesOpen(false);
                  }}
                  className={`text-sm font-medium transition-colors ${
                    currentPage === item.page
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

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
            aria-label="Toggle menu"
            
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
              {navItems.map((item) => {
                if (item.page === 'courses') {
                  return (
                    <div key={item.page} className="w-full">
                      <button
                        onClick={() => setMobileCoursesOpen(!mobileCoursesOpen)}
                        className={`w-full text-left py-2 px-4 flex justify-between items-center ${
                          currentPage === item.page ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                        }`}
                      >
                        <span>{item.label}</span>
                        <span className="text-sm">{mobileCoursesOpen ? '−' : '+'}</span>
                      </button>

                      {mobileCoursesOpen && courses && courses.length > 0 && (
                        <div className="pl-6 pr-4 pb-2 space-y-1">
                          {courses.map((course) => (
                            <button
                              key={course.id}
                              onClick={() => handleCourseClick(course)}
                              className="block w-full text-left py-2 px-2 text-gray-700 rounded-md hover:bg-gray-50"
                            >
                              <div className="font-medium text-sm">{course.title}</div>
                              <div className="text-xs text-gray-500 truncate">{course.shortDescription ?? ''}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    key={item.page}
                    onClick={() => {
                      navigateTo(item.page);
                      setIsOpen(false);
                      setMobileCoursesOpen(false);
                    }}
                    className={`block w-full text-left py-2 px-4 ${
                      currentPage === item.page ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}

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
  const { navigateTo, openEnquiry } = useApp();

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
             bg-blue-900 
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
            className="text-lg md:text-xl text-gray-800 mb-8 max-w-3xl mx-auto"
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
              onClick={() => navigateTo('courses')}
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
              <div className="text-sm text-gray-800">{stat.label}</div>
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900">
            Why Salient Learnings
          </h2>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto">
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
              <p className="text-gray-800">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Course Card Component
const CourseCard = ({ course, onLearnMore, onEnquiry }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);

  // Normalize durations for robustness:
  // - If course.durations is an array of strings, convert to { label, priceText }
  // - If missing, fallback to legacy fields (course.duration / course.priceText)
  const durations = React.useMemo(() => {
    if (!course) return [];
    if (Array.isArray(course.durations) && course.durations.length > 0) {
      return course.durations.map((d) =>
        typeof d === 'string'
          ? { label: d, priceText: course.priceText || '' }
          : { label: d.label || '', priceText: d.priceText || '' }
      );
    }
    // fallback single option
    return [{ label: course.duration || '', priceText: course.priceText || '' }];
  }, [course]);

  // Reset selected index when course changes
  useEffect(() => {
    setSelectedIdx(0);
  }, [course?.id]);

  const current = durations[selectedIdx] || { label: course?.duration || '', priceText: course?.priceText || '' };

  const statusColors = {
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
          src={course?.image}
          alt={course?.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              statusColors[course?.status] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {course?.status}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-3">
          <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
            {course?.category}
          </span>
        </div>

        <h3 className="text-xl font-bold mb-2 text-gray-900">{course?.title}</h3>
        <p className="text-gray-800 mb-4 line-clamp-2">{course?.shortDescription}</p>

        <div className="flex flex-wrap gap-2 mb-4 text-sm text-gray-500 items-center">
          <span className="flex items-center">
            <Award className="w-4 h-4 mr-1" /> {course?.level}
          </span>

          <span>•</span>

          {/* Duration display / selector */}
          {durations.length > 1 ? (
            <div className="flex items-center gap-2">
              <select
                aria-label="Select duration"
                value={selectedIdx}
                onChange={(e) => setSelectedIdx(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded-md text-sm"
              >
                {durations.map((d, idx) => (
                  <option key={idx} value={idx}>
                    {d.label || `Option ${idx + 1}`}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <span>{current.label || '—'}</span>
          )}

          <span>•</span>

          <span className="text-xl font-semibold text-blue-600">₹{current.priceText || '—'}</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              // pass selected duration index as second arg (backwards-compatible)
              if (typeof onLearnMore === 'function') onLearnMore(course, selectedIdx);
            }}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Learn More
          </button>
          <button
            onClick={() => {
              if (typeof onEnquiry === 'function') onEnquiry(course, selectedIdx);
            }}
            className="flex-1 border-2 border-blue-600 text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Enquiry
          </button>
        </div>
      </div>
    </motion.div>
  );
};


// // Course Detail Modal
// const CourseDetailModal = ({ course, selectedDurationIndex = 0, onClose }) => {
//   if (!course) return null;
//  const { navigateTo, openEnquiry } = useApp();
// const [selectedIdx, setSelectedIdx] = useState(0);
//  const durations = React.useMemo(() => {
//     if (!course) return [];
//     if (Array.isArray(course.durations) && course.durations.length > 0) {
//       return course.durations.map((d) =>
//         typeof d === 'string'
//           ? { label: d, priceText: course.priceText || '' }
//           : { label: d.label || '', priceText: d.priceText || '' }
//       );
//     }
//     // fallback single option
//     return [{ label: course.duration || '', priceText: course.priceText || '' }];
//   }, [course]);

//   const current = durations[selectedIdx] || { label: course?.duration || '', priceText: course?.priceText || '' };
//   // helper to safely read price
// const currentDuration =
//   course?.durations?.[selectedDurationIndex]
//   || course?.durations?.[0]
//   || null;


//   const displayedDuration = currentDuration?.label || course?.duration || '—';
//   const displayedPrice = currentDuration?.priceText || course?.priceText || '—';

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
//       onClick={onClose}
//     >
//       <motion.div
//         initial={{ scale: 0.9, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0.9, opacity: 0 }}
//         transition={{ type: 'spring', damping: 25 }}
//         className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="relative">
//           <img
//             src={course.image}
//             alt={course.title}
//             className="w-full h-64 object-cover rounded-t-2xl"
//           />
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         <div className="p-8 max-h-[70vh] overflow-y-auto">
//           <div className="mb-4">
//             <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
//               {course.category}
//             </span>
//           </div>

//           <h2 className="text-3xl font-bold mb-4 text-blue-900">{course.title}</h2>

//           <div className="flex flex-wrap gap-2 mb-4 text-sm text-gray-500 items-center">
//           <span className="flex items-center">
//             <Award className="w-4 h-4 mr-1" /> {course?.level}
//           </span>

//           <span>•</span>

//           {/* Duration display / selector */}
//           {durations.length > 1 ? (
//             <div className="flex items-center gap-2">
//               <select
//                 aria-label="Select duration"
//                 value={selectedIdx}
//                 onChange={(e) => setSelectedIdx(Number(e.target.value))}
//                 className="px-2 py-1 border border-gray-300 rounded-md text-sm"
//               >
//                 {durations.map((d, idx) => (
//                   <option key={idx} value={idx}>
//                     {d.label || `Option ${idx + 1}`}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           ) : (
//             <span>{current.label || '—'}</span>
//           )}

//           <span>•</span>

//           <span className="text-xl font-semibold text-blue-600">₹{current.priceText || '—'}</span>
//         </div>

//           <div className="mb-8">
//             <h3 className="text-xl font-bold mb-3 text-gray-900">Overview</h3>
//             <p className="text-gray-800 leading-relaxed">{course.fullDescription}</p>
//           </div>

//           <div className="mb-8">
//             <h3 className="text-xl font-bold mb-4 text-gray-900">Curriculum</h3>
//             <div className="space-y-4">
//               {course.curriculum.map((module, index) => (
//                 <div key={index} className="border-l-4 border-blue-600 pl-4">
//                   <h4 className="font-semibold text-gray-900 mb-2">{module.title}</h4>
//                   <ul className="space-y-1">
//                     {module.topics.map((topic, idx) => (
//                       <li key={idx} className="text-gray-800 flex items-start">
//                         <Check className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-1" />
//                         {topic}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="mb-8">
//             <h3 className="text-xl font-bold mb-3 text-gray-900">Projects & Capstone</h3>
//             <ul className="space-y-2">
//               {course.projects.map((project, index) => (
//                 <li key={index} className="flex items-start text-gray-800">
//                   <Check className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
//                   {project}
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="mb-8">
//             <h3 className="text-xl font-bold mb-3 text-gray-900">Tools & Technologies</h3>
//             <div className="flex flex-wrap gap-2">
//               {course.tools.map((tool, index) => (
//                 <span
//                   key={index}
//                   className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
//                 >
//                   {tool}
//                 </span>
//               ))}
//             </div>
//           </div>

//           <div className="mb-8">
//             <h3 className="text-xl font-bold mb-3 text-gray-900">Career Outcomes</h3>
//             <ul className="space-y-2">
//               {course.outcomes.map((outcome, index) => (
//                 <li key={index} className="flex items-start text-gray-800">
//                   <Award className="w-5 h-5 mr-2 text-purple-600 flex-shrink-0 mt-0.5" />
//                   {outcome}
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="flex gap-4">
//             <button
//               onClick={() =>openEnquiry() }
               
//                 // This would open enquiry modal in actual implementation
              
//               className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
//             >
//               Apply Now
//             </button>
//             <button
//             onClick={() => openEnquiry()}
//             className="flex-1 border-2 border-blue-600 text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors"
//           >
//               Contact Advisor
//             </button>
//           </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };


const EnquiryModal = ({ isOpen, onClose, selectedCourse = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    program: selectedCourse?.title || '',
    message: '',
    contactMethod: 'Whatsapp',
  });

  const [submitted, setSubmitted] = useState(false);

  // validation / whatsapp check state
  const [phoneWarning, setPhoneWarning] = useState(''); // shows if letters were typed
  const [whatsappStatus, setWhatsappStatus] = useState('unknown'); // 'unknown' | 'checking' | 'available' | 'not_available'
  const [whatsappNote, setWhatsappNote] = useState(''); // user-facing note
  const debounceRef = React.useRef(null);

  useEffect(() => {
    if (selectedCourse) {
      setFormData(prev => ({ ...prev, program: selectedCourse.title }));
    }
  }, [selectedCourse]);

  // reset minor states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSubmitted(false);
      setPhoneWarning('');
      setWhatsappStatus('unknown');
      setWhatsappNote('');
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Helper: strip non-digit characters
  const digitsOnly = (value) => (value || '').replace(/\D+/g, '');

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone input: strip non-digits into state, but detect letters to show warning.
    if (name === 'phone') {
      const hasLetters = /[A-Za-z]/.test(value);
      if (hasLetters) {
        setPhoneWarning('Only numbers allowed. Letters were removed automatically.');
      } else {
        setPhoneWarning('');
      }

      const cleaned = digitsOnly(value);
      setFormData(prev => ({ ...prev, phone: cleaned }));

      // reset whatsapp status while user types
      setWhatsappStatus('unknown');
      setWhatsappNote('');

      // No button: auto-check after debounce if Whatsapp selected
      // clear previous timer
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        if (formData.contactMethod === 'Whatsapp' || (name === 'phone' && formData.contactMethod === 'Whatsapp')) {
          // call checker with the latest cleaned value (use cleaned)
          autoCheckWhatsapp(cleaned);
        }
      }, 700); // 700ms debounce

      return;
    }

    // Whatsapp input: strip non-digit characters
    if (name === 'whatsapp') {
      const cleaned = digitsOnly(value);
      setFormData(prev => ({ ...prev, whatsapp: cleaned }));
      return;
    }

    // Contact method change: if changed to Whatsapp and phone present, auto-check
    if (name === 'contactMethod') {
      setFormData(prev => ({ ...prev, [name]: value }));
      setWhatsappStatus('unknown');
      setWhatsappNote('');

      if (value === 'Whatsapp' && formData.phone) {
        // debounce a tiny bit to avoid race
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          autoCheckWhatsapp(formData.phone);
        }, 350);
      }
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Auto-check function (tries server-side endpoint first, falls back to heuristic)
  // const autoCheckWhatsapp = async (phone) => {
  //   // phone should be digits-only already
  //   if (!phone || phone.length < 6) {
  //     setWhatsappStatus('not_available');
  //     setWhatsappNote('Enter a valid phone number to check WhatsApp.');
  //     return;
  //   }

  //   setWhatsappStatus('checking');
  //   setWhatsappNote('Checking WhatsApp availability...');

  //   // Try a server-side check if you have one. Expected: GET /api/check-whatsapp?phone=... -> { available: true/false }
  //   try {
  //     const res = await fetch(`/api/check-whatsapp?phone=${encodeURIComponent(phone)}`, { method: 'GET' });
  //     if (res.ok) {
  //       const json = await res.json();
  //       if (typeof json.available === 'boolean') {
  //         if (json.available) {
  //           setWhatsappStatus('available');
  //           setWhatsappNote('WhatsApp available for this number.');
  //         } else {
  //           setWhatsappStatus('not_available');
  //           setWhatsappNote('WhatsApp not available for this number.');
  //         }
  //         return;
  //       }
  //       // unexpected shape -> fallthrough to heuristic
  //     }
  //   } catch (err) {
  //     // no server endpoint or network error -> fallback to heuristic
  //   }

  //   // Heuristic fallback (best-effort): consider >=10 digits as likely available
  //   if (phone.length >= 10) {
  //     setWhatsappStatus('available');
  //     setWhatsappNote('WhatsApp likely available (heuristic).');
  //   } else {
  //     setWhatsappStatus('not_available');
  //     setWhatsappNote('WhatsApp likely not available for this number (heuristic).');
  //   }
  // };

  // Final submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Phone must be digits-only and non-empty
    if (!/^\d+$/.test(formData.phone) || formData.phone.length < 6) {
      setPhoneWarning('Please enter a valid phone number (digits only).');
      return;
    }

     // Phone must be digits-only and non-empty
    if (!/^\d+$/.test(formData.whatsapp) || formData.whatsapp.length < 6) {
      setPhoneWarning('Please enter a valid phone number (digits only).');
      return;
    }

    try {
      const payload = { ...formData };
      if (formData.contactMethod === 'Whatsapp') payload.whatsappCheck = whatsappStatus;

      const response = await fetch("https://formspree.io/f/mzdpzzql", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitted(true);
        window.dispatchEvent(new CustomEvent("enquiry-submitted-success"));

        setTimeout(() => {
          setSubmitted(false);
          onClose();
          setFormData({
            name: "",
            email: "",
            phone: "",
            whatsapp: "",
            program: "",
            message: "",
            contactMethod: "Whatsapp",
          });
          setPhoneWarning('');
          setWhatsappStatus('unknown');
          setWhatsappNote('');
          if (debounceRef.current) {
            clearTimeout(debounceRef.current);
            debounceRef.current = null;
          }
        }, 2000);
      } else {
        //console.error("Formspree submit returned non-ok:", response.status);
      }
    } catch (error) {
      //console.error("Enquiry failed", error);
    }
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
  className="bg-white rounded-2xl max-w-md w-full shadow-2xl
             max-h-[90vh] flex flex-col"
  onClick={(e) => e.stopPropagation()}
>

        {submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg text-center font-medium"
          >
            ✅ Enquiry submitted successfully!
            <br />
            Your curriculum download will start shortly.
          </motion.div>
        )}

        <div className="flex justify-between items-center mb-2 px-8 pt-8">
          <h3 className="text-2xl font-bold text-gray-900">Get in Touch</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto px-8 pb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Enter digits only (e.g. 918123456789)"
            />
            {phoneWarning && <p className="mt-2 text-sm text-yellow-700">{phoneWarning}</p>}

            {/* show whatsapp status under phone when Whatsapp selected */}
            {formData.contactMethod === 'Whatsapp' && whatsappStatus !== 'unknown' && (
              <p className={`mt-2 text-sm ${
                whatsappStatus === 'available' ? 'text-green-600' : 'text-red-400'
              }`}>
                {whatsappNote}
              </p>
            )}
          </div>

           <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Whatsapp *</label>
            <input
              type="tel"
              id="whatsapp"
              name="whatsapp"
              required
              value={formData.whatsapp}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Enter digits only (e.g. 918123456789)"
            />
            {phoneWarning && <p className="mt-2 text-sm text-yellow-700">{phoneWarning}</p>}

            
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Interested In *</label>
            <select
              id="program"
              name="program"
              required
              value={formData.program}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="">Select a course</option>
              <option value="Data Science">Data Science</option>
              <option value="Web Development">Cyber Security</option>
              <option value="Mobile App Development">Python Course</option>
              <option value="Generative AI & Prompt Engineering">Java Full Stack Course</option>
              <option value="AI in Healthcare & Life Sciences">DevOps course</option>
              <option value="Computer Vision & Autonomous Systems">Generative AI Course</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact Method</label>
            <div className="flex gap-4 items-center">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="Whatsapp"
                  id="contactMethodWhatsapp"
                  name="contactMethod"
                  checked={formData.contactMethod === 'Whatsapp'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Whatsapp
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="phone"
                  id="contactMethodPhone"
                  name="contactMethod"
                  checked={formData.contactMethod === 'phone'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Phone Call
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
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
            disabled={submitted}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors
              ${submitted ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
          >
            {submitted ? "Submitting..." : "Submit Enquiry"}
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
const CoursesPage = ({ selectedCourseDetail, setSelectedCourseDetail }) => {
  const { openEnquiry, setSelectedCourse, courses, openCourseDetail } = useApp();
  const [filters, setFilters] = useState({
    level: 'All',
    category: 'All',
    status: 'All'
  });

  

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const categories = ['All', 'Data Science & AI', 'Generative AI & LLM Programs', 'Industry-Specific AI Programs', 'DeepTech & Emerging Technologies'];
  const statuses = ['All', 'Enrolling Now', 'Launching Soon', 'Under Development', 'Planned'];


// ensure we work with a copy that is sorted by displayOrder first
const sortedCourses = [...(courses || [])].sort((a,b) => {
  const aOrd = typeof a.displayOrder === 'number' ? a.displayOrder : Number.POSITIVE_INFINITY;
  const bOrd = typeof b.displayOrder === 'number' ? b.displayOrder : Number.POSITIVE_INFINITY;
  if (aOrd !== bOrd) return aOrd - bOrd;
  return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
});


const filteredCourses = sortedCourses.filter(course => {
  if (filters.level !== 'All' && course.level !== filters.level) return false;
  if (filters.category !== 'All' && course.category !== filters.category) return false;
  if (filters.status !== 'All' && course.status !== filters.status) return false;
  return true;
});


  const handleLearnMore = (course) => {
    openCourseDetail(course);
  };

  const handleEnquiry = (course) => {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900">
            Explore Our Programs
          </h1>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto lg:whitespace-nowrap">
            Choose from our comprehensive range of AI and Data Science programs designed for every skill level
          </p>
        </motion.div>

        {/* Filters
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-800" />
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
        </motion.div> */}

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
        
      </AnimatePresence>
    </div>
  );
};

// // About Page
// const AboutPage = () => {
//   return (
//     <div className="pt-24 pb-20 px-4 bg-white min-h-screen">
//       <div className="max-w-4xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-12"
//         >
//           <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-900">About Salient Learnings</h1>
//           <p className="text-xl text-gray-800 leading-relaxed">
//             Salient Learnings is a future-focused education platform dedicated to building industry-ready talent in AI, Data Science, Generative AI & Deep Technologies through mentor-led, hands-on learning.
//           </p>
//         </motion.div>

//         <motion.section
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="mb-12"
//         >
//           <h2 className="text-3xl font-bold mb-4 text-blue-900">Our Vision</h2>
//           <p className="text-lg text-gray-800 leading-relaxed">
//             To become a leading AI & DeepTech talent ecosystem, shaping innovators, professionals, and technology leaders globally.
//           </p>
//         </motion.section>

//         <motion.section
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="mb-12"
//         >
//           <h2 className="text-3xl font-bold mb-4 text-blue-900">Our Mission</h2>
//           <ul className="space-y-3 text-lg text-gray-800">
//             <li className="flex items-start">
//               <Check className="w-6 h-6 mr-3 text-blue-600 flex-shrink-0 mt-1" />
//               Bridge academia and industry with practical, outcome-focused learning
//             </li>
//             <li className="flex items-start">
//               <Check className="w-6 h-6 mr-3 text-blue-600 flex-shrink-0 mt-1" />
//               Deliver project-driven education that prepares learners for real-world challenges
//             </li>
//             <li className="flex items-start">
//               <Check className="w-6 h-6 mr-3 text-blue-600 flex-shrink-0 mt-1" />
//               Enable real employability and foster innovation in emerging technologies
//             </li>
//           </ul>
//         </motion.section>

//         <motion.section
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//         >
         
//         </motion.section>
//       </div>
//     </div>
//   );
// };

// FAQs Page
const FAQsPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-800">
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
              <h2 className="text-2xl font-bold mb-4 text-blue-900">{section.category}</h2>
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
                            <div className="px-6 pb-4 text-gray-800">
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
    whatsapp: '',
    program: '',
    message: '',
    contactMethod: 'Whatsapp'
  });
  const [submitted, setSubmitted] = useState(false);
  const [phoneWarning, setPhoneWarning] = useState('');
  const [whatsappWarning, setWhatsappWarning] = useState('');

  const digitsOnly = (value) => (value || '').replace(/\D+/g, '');

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone input: strip non-digits
    if (name === 'phone') {
      const hasLetters = /[A-Za-z]/.test(value);
      if (hasLetters) {
        setPhoneWarning('Only numbers allowed. Letters were removed automatically.');
      } else {
        setPhoneWarning('');
      }

      const cleaned = digitsOnly(value);
      setFormData(prev => ({ ...prev, phone: cleaned }));
      return;
    }

    // Whatsapp input: strip non-digits
    if (name === 'whatsapp') {
      const hasLetters = /[A-Za-z]/.test(value);
      if (hasLetters) {
        setWhatsappWarning('Only numbers allowed. Letters were removed automatically.');
      } else {
        setWhatsappWarning('');
      }

      const cleaned = digitsOnly(value);
      setFormData(prev => ({ ...prev, whatsapp: cleaned }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Final submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Phone validation
    if (!/^\d+$/.test(formData.phone) || formData.phone.length < 6) {
      setPhoneWarning('Please enter a valid phone number (digits only, at least 6 digits).');
      return;
    }

    // WhatsApp validation
    if (!/^\d+$/.test(formData.whatsapp) || formData.whatsapp.length < 6) {
      setWhatsappWarning('Please enter a valid WhatsApp number (digits only, at least 6 digits).');
      return;
    }
//https://formspree.io/f/xanogwrj
    try {
      const response = await fetch("https://formspree.io/f/mzdpzzql", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
          // Scroll to top smoothly
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        window.dispatchEvent(new CustomEvent("enquiry-submitted-success"));

        setTimeout(() => {
          setSubmitted(false);
          setFormData({
            name: "",
            email: "",
            phone: "",
            whatsapp: "",
            program: "",
            message: "",
            contactMethod: "Whatsapp",
          });
          setPhoneWarning('');
          setWhatsappWarning('');
        }, 3000);
      } else {
        //console.error("Formspree submit returned non-ok:", response.status);
        alert("Failed to submit. Please try again.");
      }
    } catch (error) {
      //console.error("Enquiry failed", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900">
            Contact Us
          </h1>
          <p className="text-xl text-gray-800">
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
            <h2 className="text-2xl font-bold mb-6 text-blue-900">Get in Touch</h2>
            <p className="text-gray-800 mb-8">
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
                    href="tel:+917386527858"
                    className="text-blue-600 hover:underline"
                  >
                    +91-7386527858
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
                  <p className="text-gray-800">KPHB, Hyderabad</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">Quick Enquiry</h3>
              <p className="text-gray-800 mb-4">
                Need immediate assistance? Click below to open our whatsapp enquiry.
              </p>
              <button
                onClick={() => window.open("https://wa.me/917386527858", "_blank")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors w-full"
              >
                Open whatsapp Enquiry
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
            <h2 className="text-2xl font-bold mb-6 text-blue-900">Send us a Message</h2>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  Submitted Successfully!
                </h3>
                <p className="text-green-700">
                  Thank you for reaching out. We'll get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Enter digits only (e.g. 918123456789)"
                  />
                  {phoneWarning && <p className="mt-2 text-sm text-yellow-700">{phoneWarning}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp *</label>
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    required
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Enter digits only (e.g. 918123456789)"
                  />
                  {whatsappWarning && <p className="mt-2 text-sm text-yellow-700">{whatsappWarning}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Interested In *</label>
                  <select
                    id="program"
                    name="program"
                    required
                    value={formData.program}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    <option value="">Select a course</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Cyber Security">Cyber Security</option>
                    <option value="Python Course">Python Course</option>
                    <option value="Java Full Stack Course">Java Full Stack Course</option>
                    <option value="DevOps course">DevOps course</option>
                    <option value="Generative AI Course">Generative AI Course</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact Method</label>
                  <div className="flex gap-4 items-center">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="Whatsapp"
                        id="contactMethodWhatsapp"
                        name="contactMethod"
                        checked={formData.contactMethod === 'Whatsapp'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      WhatsApp
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="phone"
                        id="contactMethodPhone"
                        name="contactMethod"
                        checked={formData.contactMethod === 'phone'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Phone Call
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
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
                  className="w-full py-3 px-6 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
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
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// HomePage.jsx - Update Featured Programs Section
const HomePage = () => {
  const { openEnquiry, featuredPrograms } = useApp();

  const BROCHURE_URL = '/DSAI_Generic_Brochure.pdf';

  const triggerDownload = (url) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleDownloadClick = (brochureUrl) => {
    const downloadUrl = brochureUrl || BROCHURE_URL;
    sessionStorage.setItem('pendingDownloadUrl', downloadUrl);
    openEnquiry({ downloadRequest: true });
  };

  useEffect(() => {
    const onSubmitSuccess = () => {
      const pending = sessionStorage.getItem('pendingDownloadUrl');
      if (!pending) return;
      triggerDownload(pending);
      sessionStorage.removeItem('pendingDownloadUrl');
    };

    window.addEventListener('enquiry-submitted-success', onSubmitSuccess);
    return () => window.removeEventListener('enquiry-submitted-success', onSubmitSuccess);
  }, []);

  return (
    <div>
      <Hero />
      <WhySalient />
      
      {/* Featured Programs Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900">
              Featured Programs
            </h2>
            <p className="text-xl text-gray-800">
              Our comprehensive certification programs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPrograms.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col"
              >
                <div className="relative h-48">
                  <img
                    src={program.image_url}
                    alt={program.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold mb-3 text-gray-900">
                    {program.title}
                  </h3>
                  {program.short_description && (
                    <p className="text-sm text-gray-600 mb-3">{program.short_description}</p>
                  )}
                  <ul className="space-y-2 mb-4 flex-grow">
                    {program.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-800">
                        <Check className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownloadClick(program.brochure_url)}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors w-full text-sm"
                  >
                    Download Curriculum
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900">
              The Salient Learning Experience
            </h2>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto">
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
                description: 'Career guidance, interview prep, and access to placement assistance',
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
                  <p className="text-gray-800">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto">
              Real stories from learners who transformed their careers with us
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Priya Sharma',
                role: 'Data Scientist at TCS',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop',
                testimonial: 'The Data Science program at Salient Learnings was transformative. The hands-on projects and mentor support helped me land my dream job within 3 months of completion.',
                rating: 5
              },
              {
                name: 'Rahul Verma',
                role: 'AI Engineer at Wipro',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop',
                testimonial: 'Best investment in my career! The instructors are industry experts who provide real-world insights. The GenAI modules were particularly impressive.',
                rating: 5
              },
              {
                name: 'Anjali Reddy',
                role: 'Machine Learning Engineer at Infosys',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop',
                testimonial: 'From theory to deployment, this course covered everything. The placement support team was extremely helpful throughout my job search journey.',
                rating: 5
              },
              {
                name: 'Vikram Patel',
                role: 'Python Developer at Accenture',
                image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop',
                testimonial: 'The Python course exceeded my expectations. Clear explanations, practical examples, and excellent support from mentors made learning enjoyable and effective.',
                rating: 5
              },
              {
                name: 'Sneha Iyer',
                role: 'Full Stack Developer at HCL',
                image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&auto=format&fit=crop',
                testimonial: 'Java Full Stack program gave me the confidence to build end-to-end applications. The curriculum is well-structured and industry-relevant.',
                rating: 5
              },
              {
                name: 'Arjun Mehta',
                role: 'DevOps Engineer at Tech Mahindra',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop',
                testimonial: 'Outstanding DevOps training! The hands-on labs and real-world scenarios prepared me well for my current role. Highly recommend Salient Learnings!',
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 flex flex-col"
              >
                {/* Rating Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 mb-6 flex-grow italic">
                  "{testimonial.testimonial}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openEnquiry()}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              Start Your Journey Today
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Footer Component
const Footer = () => {
  const { navigateTo, courses, setSelectedCourseDetail } = useApp();

  const handleCourseClick = (course) => {
    // open courses page and show course detail modal
    if (setSelectedCourseDetail) setSelectedCourseDetail(course);
    navigateTo('courses');
    // small scroll for UX
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };

  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <img
              className="w-28 h-18 object-contain mr-2 inline-block"
              src="./logo.png"
              alt="Salient Learnings Logo"
            />
            <p className="text-gray-400">
              Building future-ready talent in AI, <br></br>Data & Deep Technologies
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Courses</h4>
            <ul className="space-y-2 text-gray-400 max-h-40 overflow-y-auto pr-2">
              {courses && courses.length > 0 ? (
                courses.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => handleCourseClick(c)}
                      className="hover:text-white transition-colors text-left w-full truncate"
                      title={c.title}
                    >
                      {c.title}
                    </button>
                  </li>
                ))
              ) : (
                // fallback items if courses not loaded yet
                <>
                  <li>
                    <button onClick={() => navigateTo('courses')} className="hover:text-white transition-colors">
                      Data Science & AI
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigateTo('courses')} className="hover:text-white transition-colors">
                      Generative AI
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigateTo('courses')} className="hover:text-white transition-colors">
                      Industry AI
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigateTo('courses')} className="hover:text-white transition-colors">
                      DeepTech
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                {/* <button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">
                  About Us
                </button> */}
              </li>
              <li>
                <button onClick={() => navigateTo('faqs')} className="hover:text-white transition-colors">
                  FAQs
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">
                  Contact
                </button>
              </li>
               <li>
                <button onClick={() => navigateTo('terms')} className="hover:text-white transition-colors">
                  Terms & Conditions
                </button>
              </li>
               <li>
                <button onClick={() => navigateTo('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
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
                  +91-7386527858
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

//App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // NEW: selected course detail for CourseDetailModal (lifted state)
  const [selectedCourseDetail, setSelectedCourseDetail] = useState(null);

  // Admin state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Courses state - loads from database
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Featured Programs state
  const [featuredPrograms, setFeaturedPrograms] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  const mapSupabaseCourse = (c) => ({
    ...c,

    // map snake_case → camelCase
    priceText: c.price_text,
    shortDescription: c.short_description,
    fullDescription: c.full_description,

    // duration already matches but keep safe fallback
    durations: Array.isArray(c.durations) && c.durations.length
      ? c.durations
      : c.duration
        ? [{ label: c.duration, priceText: c.price_text || '' }]
        : [],

    // safety defaults (prevent blank UI)
    title: c.title || '',
    category: c.category || '',
    level: c.level || '',
    status: c.status || '',
    image: c.image || '',
  });

  // Load courses from database on mount (updated with localStorage cache fallback)
  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ Always load from database first
      const dbCourses = await fetchCourses();

      if (Array.isArray(dbCourses) && dbCourses.length > 0) {
        setCourses(dbCourses);

        // cache only for offline use
        localStorage.setItem('courses_cache', JSON.stringify(dbCourses));

        //console.log('📚 Loaded courses from Supabase:', dbCourses.length);
        return;
      }

      throw new Error('Empty DB response');

    } catch (err) {
      //console.warn('⚠️ DB load failed. Using local cache.');

      try {
        const cached = localStorage.getItem('courses_cache');
        if (cached) {
          setCourses(JSON.parse(cached));
          //console.log('📚 Loaded courses from cache');
        } else {
          setCourses([]);
        }
      } catch (cacheErr) {
        //console.error('❌ Cache error:', cacheErr);
        setCourses([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load featured programs from database
  const loadFeaturedPrograms = async () => {
    try {
      setFeaturedLoading(true);

      const { data, error } = await supabase
        .from('featured_programs')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;

      setFeaturedPrograms(data || []);
      
      // Cache for offline use
      localStorage.setItem('featured_programs_cache', JSON.stringify(data || []));
      
      //console.log('⭐ Loaded featured programs from Supabase:', data?.length || 0);
    } catch (err) {
      //console.warn('⚠️ Featured programs DB load failed. Using local cache.', err);

      try {
        const cached = localStorage.getItem('featured_programs_cache');
        if (cached) {
          setFeaturedPrograms(JSON.parse(cached));
          //console.log('⭐ Loaded featured programs from cache');
        } else {
          setFeaturedPrograms([]);
        }
      } catch (cacheErr) {
        //console.error('❌ Featured programs cache error:', cacheErr);
        setFeaturedPrograms([]);
      }
    } finally {
      setFeaturedLoading(false);
    }
  };

  // Load courses and featured programs on mount
  useEffect(() => {
    loadCourses();
    loadFeaturedPrograms();
    testConnection(); // Test Supabase connection
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Helper: persist full list to localStorage ----------
  const persistCoursesToCache = (list) => {
    try {
      localStorage.setItem("courses_cache", JSON.stringify(list));
    } catch (err) {
      //console.warn("Could not update courses cache", err);
    }
  };

  // Navigation helper - create the navigation function
  const createNavigateTo = useCallback(
    (routeOrPath) => {
      if (!routeOrPath) return;

      let route = routeOrPath.startsWith("/")
        ? routeOrPath.slice(1)
        : routeOrPath;

      if (route === "" || route === "/") route = "home";

      if (!validPages.includes(route)) {
        route = "home";
      }

      if (route === "admin" && isAdminAuthenticated) {
        createNavigateTo("admin-dashboard");
        window.history.pushState({}, "", "/admin-dashboard");
        return;
      }

      setCurrentPage(route);

      window.history.pushState(
        {},
        "",
        route === "home" ? "/" : `/${route}`
      );
    },
    [isAdminAuthenticated]
  );

  // Add course (tries DB -> falls back to local)
  const addCourse = async (course) => {
    try {
      const created = await createCourse(course);
      const finalCourse = mapSupabaseCourse({
        ...(created || {}),
        ...course,
        id: (created && created.id) || course.id || Date.now().toString(),
      });

      if (Array.isArray(finalCourse.durations) && finalCourse.durations.length > 0) {
        finalCourse.duration = finalCourse.duration || finalCourse.durations[0].label || "";
        finalCourse.priceText = finalCourse.priceText || finalCourse.durations[0].priceText || "";
      } else {
        if (course.durations && course.durations.length > 0) {
          finalCourse.durations = course.durations;
          finalCourse.duration = finalCourse.duration || course.durations[0].label || "";
          finalCourse.priceText = finalCourse.priceText || course.durations[0].priceText || "";
        }
      }

      finalCourse.shortDescription = finalCourse.shortDescription || course.shortDescription || "";
      finalCourse.fullDescription = finalCourse.fullDescription || course.fullDescription || "";

      const updated = [finalCourse, ...courses];
      setCourses(updated);
      persistCoursesToCache(updated);
      //console.log("✅ Course added to database (or cached locally).");
      return finalCourse;
    } catch (err) {
      //console.error("Error adding course to DB:", err);
      const fallbackCourse = {
        ...course,
        id: course.id || Date.now().toString(),
        duration:
          Array.isArray(course.durations) && course.durations.length > 0
            ? course.durations[0].label
            : course.duration,
        priceText:
          Array.isArray(course.durations) && course.durations.length > 0
            ? course.durations[0].priceText
            : course.priceText,
      };
      fallbackCourse.shortDescription = fallbackCourse.shortDescription || course.shortDescription || "";
      fallbackCourse.fullDescription = fallbackCourse.fullDescription || course.fullDescription || "";

      const updated = [fallbackCourse, ...courses];
      setCourses(updated);
      persistCoursesToCache(updated);
      return fallbackCourse;
    }
  };

  // Update course (tries DB -> falls back to local)
  const updateCourse = async (updatedCourse) => {
    try {
      const updatedFromDB = await updateCourseDB(updatedCourse.id, updatedCourse);
      const merged = { ...(updatedFromDB || {}), ...updatedCourse };

      if (Array.isArray(merged.durations) && merged.durations.length > 0) {
        merged.duration = merged.duration || merged.durations[0].label || "";
        merged.priceText = merged.priceText || merged.durations[0].priceText || "";
      } else if (Array.isArray(updatedCourse.durations) && updatedCourse.durations.length > 0) {
        merged.durations = updatedCourse.durations;
        merged.duration = merged.duration || updatedCourse.durations[0].label || "";
        merged.priceText = merged.priceText || updatedCourse.durations[0].priceText || "";
      }

      merged.shortDescription = merged.shortDescription || updatedCourse.shortDescription || "";
      merged.fullDescription = merged.fullDescription || updatedCourse.fullDescription || "";

      const newList = courses.map((c) => (String(c.id) === String(merged.id) ? merged : c));
      setCourses(newList);
      persistCoursesToCache(newList);
      //console.log("✅ Course updated in database (or cached locally).");
      return merged;
    } catch (err) {
      //console.error("Error updating course:", err);
      const merged = { ...updatedCourse };
      if (Array.isArray(merged.durations) && merged.durations.length > 0) {
        merged.duration = merged.duration || merged.durations[0].label || "";
        merged.priceText = merged.priceText || merged.durations[0].priceText || "";
      }
      merged.shortDescription = merged.shortDescription || updatedCourse.shortDescription || "";
      merged.fullDescription = merged.fullDescription || updatedCourse.fullDescription || "";
      const newList = courses.map((c) => (String(c.id) === String(merged.id) ? merged : c));
      setCourses(newList);
      persistCoursesToCache(newList);
      return merged;
    }
  };

  // Delete course (tries DB -> falls back to local)
  const deleteCourse = async (courseId) => {
    try {
      await deleteCourseDB(courseId);
      const newList = courses.filter((c) => String(c.id) !== String(courseId));
      setCourses(newList);
      persistCoursesToCache(newList);
      //console.log("✅ Course deleted from database (or removed from cache).");
    } catch (err) {
      //console.error("Error deleting course from DB:", err);
      const newList = courses.filter((c) => String(c.id) !== String(courseId));
      setCourses(newList);
      persistCoursesToCache(newList);
    }
  };

  // Featured Programs CRUD operations
  const addFeaturedProgram = async (programData) => {
    try {
      const { data, error } = await supabase
        .from('featured_programs')
        .insert([programData])
        .select()
        .single();

      if (error) throw error;
      
      await loadFeaturedPrograms();
      //console.log("✅ Featured program added to database.");
      return data;
    } catch (error) {
      //console.error('Error adding featured program:', error);
      throw error;
    }
  };

  const updateFeaturedProgram = async (programData) => {
    try {
      const { error } = await supabase
        .from('featured_programs')
        .update(programData)
        .eq('id', programData.id);

      if (error) throw error;
      
      await loadFeaturedPrograms();
      //console.log("✅ Featured program updated in database.");
    } catch (error) {
      //console.error('Error updating featured program:', error);
      throw error;
    }
  };

  const deleteFeaturedProgram = async (programId) => {
    try {
      const { error } = await supabase
        .from('featured_programs')
        .delete()
        .eq('id', programId);

      if (error) throw error;
      
      await loadFeaturedPrograms();
      //console.log("✅ Featured program deleted from database.");
    } catch (error) {
      //console.error('Error deleting featured program:', error);
      throw error;
    }
  };

  // Enquiry helpers
  const openEnquiry = (course = null) => {
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
    navigateTo("admin-dashboard");
    window.history.pushState({}, "", "/admin-dashboard");
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    navigateTo("home");
    window.history.pushState({}, "", "/");
  };
  const validPages = [
  "home",
  "courses",
  "coursedetail",
  // "about",
  "faqs",
  "contact",
  "terms",
  "privacy",
  "payment-success",
  "payment-failure",
  "admin",
  "admin-dashboard"
];


// Use createNavigateTo as the main navigation function
const navigateTo = createNavigateTo;


  /**
   * On mount: handle direct URL visits
   */
useEffect(() => {
  const handleInitialPath = async () => {
    const path = window.location.pathname || "/";
    const parts = path.split('/').filter(Boolean); // e.g. ['coursedetail','data-science']
    
    if (parts[0] === 'coursedetail') {
      // try to get slug/id from URL
      const slugOrId = parts[1] || null;

      // ensure courses are loaded (may be cached or loaded by loadCourses)
      if (!courses || courses.length === 0) {
        await loadCourses(); // loadCourses updates `courses` state
      }

      if (slugOrId) {
        const found = (courses || []).find(
          (c) => String(c.slug) === String(slugOrId) || String(c.id) === String(slugOrId)
        );
        if (found) {
          setSelectedCourseDetail(found);
          navigateTo('coursedetail');
          return;
        } else {
          // fallback to courses list if not found
          navigateTo('courses');
          return;
        }
      } else {
        navigateTo('courses');
        return;
      }
    }

    // existing behavior for other roots
    if (path === '/' || path === '') {
      navigateTo('home');
    } else {
      // remove leading slash
      const route = path.startsWith('/') ? path.slice(1) : path;
      // keep previous logic but ensure we don't allow unknown pages
      navigateTo(validPages.includes(route) ? route : 'home');
    }
  };

  handleInitialPath();

  const onPopState = () => {
    const path = window.location.pathname || "/";
    navigateTo(path === "/" ? "home" : path);
  };

  window.addEventListener("popstate", onPopState);
  return () => window.removeEventListener("popstate", onPopState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [navigateTo, courses]);


  useEffect(() => {
    if (currentPage === "admin" && isAdminAuthenticated) {
      navigateTo("admin-dashboard");
      window.history.pushState({}, "", "/admin-dashboard");
    }
  }, [currentPage, isAdminAuthenticated]);

const openCourseDetail = (course, selectedDurationIndex = 0) => {
  if (!course) return;
  setSelectedCourseDetail(course);
  // store which duration was selected on the detail page if you want:
  // optional: setSelectedCourseDetail(prev => ({ ...course, selectedDurationIndex }));
  navigateTo('coursedetail');
  const slugOrId = course.slug || course.id;
  window.history.pushState({}, '', `/coursedetail/${slugOrId}`);
};


  const contextValue = {
    currentPage,
    navigateTo,
    enquiryOpen,
    openEnquiry,
    closeEnquiry,
    selectedCourse,
    setSelectedCourse,
    selectedCourseDetail,
    setSelectedCourseDetail,
    openCourseDetail,
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    loading,
    error,
    loadCourses,
    // Featured Programs
    featuredPrograms,
    addFeaturedProgram,
    updateFeaturedProgram,
    deleteFeaturedProgram,
    featuredLoading,
  };


  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-white">
        {/* Loading state */}
        {(loading || featuredLoading) && (
          <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-800 font-medium">
                {loading && featuredLoading ? 'Loading content...' : 
                 loading ? 'Loading courses...' : 'Loading programs...'}
              </p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-lg z-50 max-w-md">
            <p className="font-medium mb-2">⚠️ Database Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Show header only if not on admin pages */}
        {currentPage !== "admin" && currentPage !== "admin-dashboard" && <Header />}

        <main>
          <AnimatePresence mode="wait">
            {currentPage === "home" && <HomePage key="home" />}
            {currentPage === "courses" && (
              <CoursesPage
                selectedCourseDetail={selectedCourseDetail}
                setSelectedCourseDetail={setSelectedCourseDetail}
                key="courses"
              />
            )}
            {currentPage === "coursedetail" && (
  <CourseDetailPage course={selectedCourseDetail} key="coursedetail" />
)}

            {/* {currentPage === "about" && <AboutPage key="about" />} */}
            {currentPage === "faqs" && <FAQsPage key="faqs" />}
            {currentPage === "contact" && <ContactPage key="contact" />}
            {currentPage === "terms" && <TermsPage key="terms" />}
            {currentPage === "privacy" && <PrivacyPolicy key="privacy" />}
            {currentPage === "payment-success" && (
              <PaymentSuccess key="payment-success" />
            )}

            {currentPage === "payment-failure" && (
              <PaymentFailure key="payment-failure" />
            )}

            {currentPage === "admin" && !isAdminAuthenticated && (
              <AdminLogin key="admin-login" onLogin={handleAdminLogin} />
            )}
            {currentPage === "admin-dashboard" && isAdminAuthenticated && (
              <AdminDashboard
                key="admin-dashboard"
                onLogout={handleAdminLogout}
              />
            )}
          </AnimatePresence>
        </main>

        {/* Show footer only if not on admin pages */}
        {currentPage !== "admin" && currentPage !== "admin-dashboard" && <Footer />}

        <AnimatePresence>
          {enquiryOpen && (
            <EnquiryModal isOpen={enquiryOpen} onClose={closeEnquiry} selectedCourse={selectedCourse} />
          )}
        </AnimatePresence>
      </div>
    </AppContext.Provider>
  );
};

export default App;


// ==================== ADMIN COMPONENTS START ====================

// Admin Login Component
const AdminLogin = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
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
          <h2 className="text-3xl font-bold text-blue-900 mb-2">Admin Access</h2>
          <p className="text-gray-800">Enter your PIN to access the admin panel</p>
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
const CourseForm = ({ course, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    course || {
      title: '',
      category: '',
      level: 'Beginner',
      // NEW: durations array with label + priceText
      durations: [{ label: '3 Months', priceText: 'INR 50,000' }],
      // legacy compatibility
      duration: '',
      priceText: '',
      status: 'Enrolling Now',
      shortDescription: '',
      fullDescription: '',
      curriculum: [{ title: '', topics: [''] }],
      projects: [''],
      tools: [''],
      outcomes: [''],
      image:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
    }
  );
  const [saving, setSaving] = useState(false);

  const categories = [
    'Data Science & AI',
    'Generative AI & LLM Programs',
    'Industry-Specific AI Programs',
    'DeepTech & Emerging Technologies',
  ];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const statuses = [
    'Enrolling Now',
    'Launching Soon',
    'Under Development',
    'Planned',
  ];

  // keep durations in sync to legacy single fields before save
const normalizeBeforeSave = (data) => {
  const copy = { ...data };

  // store full durations array
  copy.durations = Array.isArray(data.durations) ? data.durations : [];

  // keep legacy fields for backward compatibility
  if (copy.durations.length > 0) {
    copy.duration = copy.durations[0].label || '';
    copy.priceText = copy.durations[0].priceText || '';
  }

  return copy;
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // normalize for compatibility and send to parent save
      const payload = normalizeBeforeSave(formData);
      await onSave(payload);
    } catch (error) {
      //console.error('Error saving course:', error);
    } finally {
      setSaving(false);
    }
  };

  // Curriculum helpers (unchanged)
  const addCurriculumModule = () => {
    setFormData({
      ...formData,
      curriculum: [...formData.curriculum, { title: '', topics: [''] }],
    });
  };

  const removeCurriculumModule = (index) => {
    const newCurriculum = formData.curriculum.filter((_, i) => i !== index);
    setFormData({ ...formData, curriculum: newCurriculum });
  };

  const updateCurriculumModule = (index, field, value) => {
    const newCurriculum = [...formData.curriculum];
    newCurriculum[index][field] = value;
    setFormData({ ...formData, curriculum: newCurriculum });
  };

  const addTopic = (moduleIndex) => {
    const newCurriculum = [...formData.curriculum];
    newCurriculum[moduleIndex].topics.push('');
    setFormData({ ...formData, curriculum: newCurriculum });
  };

  const updateTopic = (moduleIndex, topicIndex, value) => {
    const newCurriculum = [...formData.curriculum];
    newCurriculum[moduleIndex].topics[topicIndex] = value;
    setFormData({ ...formData, curriculum: newCurriculum });
  };

  const removeTopic = (moduleIndex, topicIndex) => {
    const newCurriculum = [...formData.curriculum];
    newCurriculum[moduleIndex].topics = newCurriculum[moduleIndex].topics.filter(
      (_, i) => i !== topicIndex
    );
    setFormData({ ...formData, curriculum: newCurriculum });
  };

  // Generic array helpers for projects/tools/outcomes
  const addArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const updateArrayItem = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  // ---------- NEW: Durations management ----------
  const addDurationOption = () => {
    setFormData({
      ...formData,
      durations: [...(formData.durations || []), { label: '', priceText: '' }],
    });
  };

  const updateDurationOption = (index, key, value) => {
    const newDurations = [...(formData.durations || [])];
    newDurations[index] = { ...newDurations[index], [key]: value };
    setFormData({ ...formData, durations: newDurations });
  };

  const removeDurationOption = (index) => {
    const newDurations = (formData.durations || []).filter((_, i) => i !== index);
    setFormData({ ...formData, durations: newDurations });
  };
  // -----------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
               <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
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
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* NOTE: Duration / Price moved to durations list */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durations & Prices *
            </label>

            <div className="space-y-3">
              {(formData.durations || []).map((d, i) => (
                <div
                  key={i}
                  className="flex gap-2 items-center bg-gray-50 p-3 rounded-md border border-gray-100"
                >
                  <input
                    type="text"
                    placeholder="e.g., 3 Months"
                    value={d.label}
                    onChange={(e) => updateDurationOption(i, 'label', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    required={i === 0} // require first to have value
                  />
                  <input
                    type="text"
                    placeholder="e.g., INR 50,000"
                    value={d.priceText}
                    onChange={(e) => updateDurationOption(i, 'priceText', e.target.value)}
                    className="w-44 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    required={i === 0}
                  />
                  <button
                    type="button"
                    onClick={() => removeDurationOption(i)}
                    className="text-red-600 hover:text-red-800"
                    title="Remove duration"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}

              <div>
                <button
                  type="button"
                  onClick={addDurationOption}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Duration Option
                </button>
              </div>
            </div>
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
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
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

        {/* Curriculum, Projects, Tools, Outcomes (unchanged) */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">Curriculum Modules</label>
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
            disabled={saving}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : course ? 'Update Course' : 'Add Course'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};

// FeaturedProgramForm.jsx
const FeaturedProgramForm = ({ program, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    image_url: '',
    features: ['', '', ''],
    brochure_url: '',
    display_order: 0,
    is_active: true,
    ...program
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredFeatures = formData.features.filter(f => f.trim() !== '');
    onSave({ ...formData, features: filteredFeatures });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">
        {program ? 'Edit Featured Program' : 'Add Featured Program'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Program Title *
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            placeholder="e.g., Data Science & AI Certification"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Description
          </label>
          <textarea
            name="short_description"
            value={formData.short_description}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            placeholder="Brief description of the program"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL *
          </label>
          <input
            type="url"
            name="image_url"
            required
            value={formData.image_url}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Features *
          </label>
          {formData.features.map((feature, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                placeholder={`Feature ${index + 1}`}
              />
              {formData.features.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addFeature}
            className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            + Add Another Feature
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brochure PDF URL
          </label>
          <input
            type="text"
            name="brochure_url"
            value={formData.brochure_url}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            placeholder="/DSAI_Generic_Brochure.pdf"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Display Order
          </label>
          <input
            type="number"
            name="display_order"
            value={formData.display_order}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            placeholder="0"
          />
          <p className="text-sm text-gray-500 mt-1">Lower numbers appear first</p>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="is_active"
            id="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">
            Active (Display on website)
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700"
          >
            {program ? 'Update Program' : 'Add Program'}
          </button>
        </div>
      </form>
    </div>
  );
};

// AdminDashboard.jsx

const AdminDashboard = ({ onLogout }) => {
  const {
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    loadCourses,
    featuredPrograms,
    addFeaturedProgram,
    updateFeaturedProgram,
    deleteFeaturedProgram,
  } = useApp();

  const [activeTab, setActiveTab] = useState("courses"); // 'courses' or 'featured'
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingProgram, setEditingProgram] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // local ordered list for drag & drop
  const [orderedCourses, setOrderedCourses] = useState([]);

// Keep orderedCourses in sync with courses from context (use displayOrder)
 useEffect(() => {
  if (!Array.isArray(courses)) {
    setOrderedCourses([]);
    return;
  }
  const normalized = courses.map((c, idx) => ({
    ...c,
    // accept either camelCase or snake_case just in case
    displayOrder: (typeof c.displayOrder === 'number')
      ? c.displayOrder
      : (typeof c.display_order === 'number' ? c.display_order : idx),
  }));
  normalized.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  setOrderedCourses(normalized);
}, [courses]);

// reorder helper: returns items with updated displayOrder
const reorderArray = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result.map((item, index) => ({ ...item, displayOrder: index }));
};

const onDragEnd = async (result) => {
  if (!result.destination) return;
  if (result.destination.index === result.source.index) return;

  const newOrder = reorderArray(orderedCourses, result.source.index, result.destination.index);
  setOrderedCourses(newOrder); // optimistic

  try {
    // Persist: use the context updateCourse(updatedCourse) which ultimately calls service
    const updatePromises = newOrder.map((c) =>
      updateCourse({ ...c, displayOrder: c.displayOrder }).then(
        (res) => ({ ok: true, id: c.id, res }),
        (err) => ({ ok: false, id: c.id, err })
      )
    );

    const results = await Promise.all(updatePromises);
    const anyFailed = results.some((r) => !r.ok);

    if (anyFailed) {
      console.warn('Some updates failed while saving order', results.filter(r => !r.ok));
      if (typeof loadCourses === 'function') await loadCourses();
      else {
        // fallback: reset from courses prop
        const normalized = (courses || []).map((c, idx) => ({
          ...c,
          displayOrder: typeof c.displayOrder === 'number' ? c.displayOrder : (typeof c.display_order === 'number' ? c.display_order : idx)
        })).sort((a,b) => a.displayOrder - b.displayOrder);
        setOrderedCourses(normalized);
      }
    } else {
      // success — optionally reload or persist cache; keep optimistic order
      if (typeof loadCourses === 'function') {
        // coarse option: reload to ensure canonical server state (optional)
        await loadCourses();
      }
    }
  } catch (err) {
    console.error('Unexpected error while saving order:', err);
    if (typeof loadCourses === 'function') await loadCourses();
  }
};

  // ---------- Course CRUD handlers ----------
  const handleSaveCourse = async (courseData) => {
    try {
      if (editingCourse) {
        await updateCourse({ ...courseData, id: editingCourse.id, slug: editingCourse.slug });
      } else {
        await addCourse(courseData);
      }
      setShowForm(false);
      setEditingCourse(null);
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  const handleSaveProgram = async (programData) => {
    try {
      if (editingProgram) {
        await updateFeaturedProgram({ ...programData, id: editingProgram.id });
      } else {
        await addFeaturedProgram(programData);
      }
      setShowForm(false);
      setEditingProgram(null);
    } catch (error) {
      console.error("Error saving program:", error);
    }
  };

  const handleDeleteProgram = async (programId) => {
    try {
      await deleteFeaturedProgram(programId);
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting program:", error);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleDelete = async (courseId) => {
    try {
      await deleteCourse(courseId);
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting course:", error);
    }
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
              <h1 className="text-3xl font-bold text-blue-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-800">Manage courses and featured programs</p>
            </div>
            <button type="button" onClick={onLogout} className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="flex border-b">
            <button
              type="button"
              onClick={() => {
                setActiveTab("courses");
                setShowForm(false);
                setEditingCourse(null);
                setEditingProgram(null);
              }}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${activeTab === "courses" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
            >
              Courses ({courses?.length || 0})
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("featured");
                setShowForm(false);
                setEditingCourse(null);
                setEditingProgram(null);
              }}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${activeTab === "featured" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
            >
              Featured Programs ({featuredPrograms?.length || 0})
            </button>
          </div>
        </div>

        {/* Courses Tab Content */}
        {activeTab === "courses" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">{courses?.length || 0}</div>
                <div className="text-gray-800">Total Courses</div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">{courses?.filter((c) => c.status === "Enrolling Now").length || 0}</div>
                <div className="text-gray-800">Active Courses</div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-3xl font-bold text-yellow-600 mb-2">{courses?.filter((c) => c.status === "Launching Soon").length || 0}</div>
                <div className="text-gray-800">Coming Soon</div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">{courses?.filter((c) => c.status === "Planned").length || 0}</div>
                <div className="text-gray-800">Planned</div>
              </div>
            </div>

            {/* Add Course Button */}
            {!showForm && (
              <div className="mb-8">
                <button type="button" onClick={handleAddNew} className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
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

            {/* Courses List (draggable) */}
            {!showForm && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-blue-900">All Courses</h2>
                  <p className="text-sm text-gray-500 mt-1">Drag rows to reorder the list. Changes are saved automatically.</p>
                </div>

                <div className="overflow-x-auto">
                  <DragDropContext onDragEnd={onDragEnd}>
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>

                      {/* IMPORTANT: Droppable must wrap the tbody which actually contains draggable <tr> children */}
                      <Droppable droppableId="courses-droppable">
                        {(provided) => (
                          <tbody ref={provided.innerRef} {...provided.droppableProps} className="bg-white divide-y divide-gray-200">
                            {orderedCourses.map((course, index) => (
                              <Draggable key={String(course.id)} draggableId={String(course.id)} index={index}>
                                {(draggableProvided, snapshot) => (
                                  <tr
                                    ref={draggableProvided.innerRef}
                                    {...draggableProvided.draggableProps}
                                    className={`hover:bg-gray-50 ${snapshot.isDragging ? "bg-gray-50" : ""}`}
                                  >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        {/* Drag handle */}
                                        <span
                                          {...draggableProvided.dragHandleProps}
                                          onMouseDown={(e) => e.preventDefault()}
                                          role="button"
                                          tabIndex={0}
                                          className="mr-3 p-1 rounded cursor-grab hover:bg-gray-100"
                                          title="Drag to reorder"
                                        >
                                          <Move className="w-5 h-5 text-gray-400" />
                                        </span>

                                        <img src={course.image} alt={course.title} className="w-12 h-12 rounded-lg object-cover mr-3" />
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
                                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{course.level}</span>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${course.status === "Enrolling Now" ? "bg-green-100 text-green-800" : course.status === "Launching Soon" ? "bg-blue-100 text-blue-800" : course.status === "Under Development" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}>
                                        {course.status}
                                      </span>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.priceText}</td>

                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                      <button type="button" onClick={() => handleEdit(course)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                                      <button type="button" onClick={() => setDeleteConfirm({ type: "course", item: course })} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                  </tr>
                                )}
                              </Draggable>
                            ))}

                            {provided.placeholder}
                          </tbody>
                        )}
                      </Droppable>
                    </table>
                  </DragDropContext>
                </div>
              </div>
            )}
          </>
        )}

        {/* Featured Programs Tab Content */}
        {activeTab === "featured" && (
          <>
            {/* Add Program Button */}
            {!showForm && (
              <div className="mb-8">
                <button type="button" onClick={() => { setEditingProgram(null); setShowForm(true); }} className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <span className="text-xl">+</span> Add Featured Program
                </button>
              </div>
            )}

            {/* Program Form */}
            {showForm && (
              <div className="mb-8">
                <FeaturedProgramForm program={editingProgram} onSave={handleSaveProgram} onCancel={() => { setShowForm(false); setEditingProgram(null); }} />
              </div>
            )}

            {/* Programs Grid */}
            {!showForm && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredPrograms.map((program) => (
                  <div key={program.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                    <img src={program.image_url} alt={program.title} className="w-full h-48 object-cover" />
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-gray-900">{program.title}</h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${program.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>{program.is_active ? "Active" : "Inactive"}</span>
                      </div>

                      {program.short_description && <p className="text-sm text-gray-600 mb-3">{program.short_description}</p>}

                      <div className="space-y-2 mb-4">
                        {Array.isArray(program.features) && program.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-start text-sm text-gray-700">
                            <Check className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                            {feature}
                          </div>
                        ))}
                      </div>

                      <div className="text-xs text-gray-500 mb-4">Display Order: {program.display_order}</div>

                      <div className="flex gap-2">
                        <button type="button" onClick={() => { setEditingProgram(program); setShowForm(true); }} className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm font-medium">Edit</button>
                        <button type="button" onClick={() => setDeleteConfirm({ type: "program", item: program })} className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 text-sm font-medium">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete {deleteConfirm.type === "program" ? "Program" : "Course"}?</h3>
                  <p className="text-gray-800 mb-6">Are you sure you want to delete "<strong>{deleteConfirm.item.title}</strong>"? This action cannot be undone.</p>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setDeleteConfirm(null)} className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
                    <button type="button" onClick={() => { if (deleteConfirm.type === "program") { handleDeleteProgram(deleteConfirm.item.id); } else { handleDelete(deleteConfirm.item.id); } }} className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors">Delete</button>
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