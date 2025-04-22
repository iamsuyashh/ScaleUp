import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/NavigationBar";
import FileUploadComponent from "../components/upload";

// Animations variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 100,
      damping: 10
    }
  }
};

const featureCardVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 100 
    }
  },
  hover: {
    scale: 1.05,
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
    transition: { type: "spring", stiffness: 300 }
  }
};

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isAuthenticated] = useState(false);
  const { scrollYProgress } = useScroll();
  
  // Transform values based on scroll progress
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  
  // Parallax effect for different sections
  const parallaxBg = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const parallaxFeatures = useTransform(scrollYProgress, [0.2, 0.4], [50, 0]);
  const parallaxTestimonials = useTransform(scrollYProgress, [0.6, 0.8], [50, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Updated features with better icons
  const features = [
    {
      title: "AI-Powered Predictions",
      description: "Our advanced machine learning models predict business growth rates with high accuracy",
      icon: "🧠"
    },
    {
      title: "Data Visualization",
      description: "Interactive charts and dashboards to understand business trends and patterns",
      icon: "📊"
    },
    {
      title: "CSV Upload",
      description: "Seamlessly upload and analyze your business data in CSV format",
      icon: "📁"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white overflow-hidden">
      <Navbar />

      {/* Hero Section with scroll-based effects */}
      <motion.div 
        className="relative min-h-screen flex items-center justify-center text-center px-4 py-12"
        style={{ 
          opacity, 
          scale,
          y
        }}
      >
        {/* Animated particles background with scroll effect */}
        <div className="absolute inset-0 overflow-hidden" style={{ y: parallaxBg }}>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-20"
              style={{
                width: Math.random() * 100 + 30,
                height: Math.random() * 100 + 30,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                y: scrollY * (0.1 + Math.random() * 0.2) * (i % 2 === 0 ? 1 : -1),
              }}
              animate={{
                y: [0, Math.random() * 100 - 50],
                x: [0, Math.random() * 100 - 50],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: Math.random() * 10 + 10,
              }}
            />
          ))}
        </div>

        <div className="max-w-5xl mx-auto z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700 mb-6">
              Scale Up
            </h1>
            <h2 className="text-3xl md:text-4xl font-medium text-gray-700 mb-4">
              MSME Growth Predictor
            </h2>
          </motion.div>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Unlock the future of your business with AI-powered growth predictions and data analytics
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Link to="/dashboard">
              <motion.button 
                className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg"
                whileHover={{ scale: 1.05, backgroundColor: "#2563eb" }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Dashboard
              </motion.button>
            </Link>
            <motion.button 
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-full text-lg font-semibold shadow-lg"
              whileHover={{ scale: 1.05, backgroundColor: "#f0f9ff" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById("upload-section").scrollIntoView({ behavior: "smooth" })}
            >
              Upload Data
            </motion.button>
          </motion.div>
          
          <motion.div 
            className="mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.div 
              className="animate-bounce"
              initial={{ y: -10 }}
              animate={{ y: 10 }}
              transition={{ yoyo: Infinity, duration: 1 }}
            >
              <svg className="w-10 h-10 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section with parallax */}
      <motion.div 
        className="py-16 bg-white relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
        style={{ y: parallaxFeatures }}
      >
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-indigo-100 opacity-40"
              style={{
                width: Math.random() * 300 + 100,
                height: Math.random() * 300 + 100,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                zIndex: 0,
              }}
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                repeat: Infinity,
                duration: Math.random() * 20 + 20,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12 text-gray-800"
            variants={itemVariants}
          >
            Powerful Features for Business Analytics
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-white to-indigo-50 p-6 rounded-xl shadow-lg"
                variants={featureCardVariants}
                whileHover="hover"
                style={{
                  y: scrollY > 300 ? 0 : (index + 1) * 20,
                  transition: "y 0.5s ease"
                }}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* How It Works Section with scroll effect */}
      <motion.div 
        className="py-16 bg-gradient-to-b from-indigo-50 to-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12 text-gray-800"
            variants={itemVariants}
            style={{
              opacity: scrollY > 800 ? 1 : 0.5,
              transform: `translateY(${scrollY > 800 ? 0 : 30}px)`,
              transition: "all 0.5s ease"
            }}
          >
            How It Works
          </motion.h2>
          
          <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8 items-center">
            <motion.div 
              className="md:w-1/2"
              variants={itemVariants}
              style={{
                x: scrollY > 900 ? 0 : -50,
                opacity: scrollY > 900 ? 1 : 0,
                transition: "all 0.5s ease"
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Data Analysis" 
                className="rounded-lg shadow-lg" 
              />
            </motion.div>
            <motion.div 
              className="md:w-1/2 space-y-4"
              variants={itemVariants}
            >
              <div className="flex items-start" style={{
                transform: `translateY(${scrollY > 950 ? 0 : 30}px)`,
                opacity: scrollY > 950 ? 1 : 0,
                transition: "all 0.6s ease"
              }}>
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">1</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Upload Your Data</h3>
                  <p className="text-gray-600">Upload your business data in CSV format with relevant metrics for analysis.</p>
                </div>
              </div>
              <div className="flex items-start" style={{
                transform: `translateY(${scrollY > 1000 ? 0 : 30}px)`,
                opacity: scrollY > 1000 ? 1 : 0,
                transition: "all 0.7s ease"
              }}>
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">2</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">AI Processing</h3>
                  <p className="text-gray-600">Our machine learning algorithms process and analyze the data patterns.</p>
                </div>
              </div>
              <div className="flex items-start" style={{
                transform: `translateY(${scrollY > 1050 ? 0 : 30}px)`,
                opacity: scrollY > 1050 ? 1 : 0,
                transition: "all 0.8s ease"
              }}>
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">3</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">View Insights</h3>
                  <p className="text-gray-600">Access interactive dashboards showing growth predictions and business insights.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Upload Section with reveal on scroll */}
      <div id="upload-section" className="py-16 bg-white">
        <motion.div 
          className="max-w-3xl mx-auto px-4"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Start Your Analysis</h2>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl shadow-lg">
            <FileUploadComponent isAuthenticated={isAuthenticated} />
          </div>
        </motion.div>
      </div>

      {/* Testimonials with scroll effect */}
      <motion.div 
        className="py-16 bg-gradient-to-b from-indigo-50 to-white relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
        style={{ y: parallaxTestimonials }}
      >
        {/* Animated quotes background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-5xl text-indigo-100 opacity-40 select-none"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                zIndex: 0,
              }}
              initial={{ opacity: 0.2, scale: 0.8 }}
              animate={{
                opacity: [0.2, 0.4, 0.2],
                scale: [0.8, 1, 0.8],
                rotate: [-10, 0, 10],
              }}
              transition={{
                repeat: Infinity,
                duration: Math.random() * 5 + 5,
              }}
            >
              &ldquo;
            </motion.div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12 text-gray-800"
            variants={itemVariants}
          >
            What Our Users Say
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                role: "Small Business Owner",
                quote: "This tool helped me understand my business growth patterns and make informed decisions for expansion.",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=facearea&w=200&h=200&q=80"
              },
              {
                name: "Rahul Patel",
                role: "Financial Analyst",
                quote: "The predictive analytics are incredibly accurate. Our investment decisions are now data-driven.",
                image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=facearea&w=200&h=200&q=80"
              },
              {
                name: "Aisha Khan",
                role: "Startup Founder",
                quote: "Easy to use and provides valuable insights. Perfect for tracking our startup's growth metrics.",
                image: "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?ixlib=rb-4.0.3&auto=format&fit=facearea&w=200&h=200&q=80"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)", transition: { duration: 0.2 } }}
                style={{
                  transform: `translateY(${scrollY > 1400 + index * 50 ? 0 : 50}px)`,
                  opacity: scrollY > 1400 + index * 50 ? 1 : 0,
                  transition: "all 0.5s ease"
                }}
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4 object-cover" 
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">{testimonial.quote}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Footer with Scale Up branding */}
      <motion.footer 
        className="bg-gray-900 text-white py-12 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Better footer background */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-400/20 to-transparent"></div>
          <motion.div 
            className="absolute top-1/2 left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(59,130,246,0.3)_0%,transparent_70%)]" 
            style={{
              x: scrollY * -0.05,
              y: scrollY * -0.05,
              translateX: "-50%",
              translateY: "-50%"
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Scale Up</h3>
                <h4 className="text-lg text-gray-300 mb-4">MSME Growth Predictor</h4>
              </motion.div>
              <p className="text-gray-400">Empowering businesses with AI-driven growth analytics and predictions.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors duration-300">Home</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors duration-300">Dashboard</Link></li>
                <li><a href="#upload-section" className="hover:text-white transition-colors duration-300">Upload Data</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">hello@scaleup.io</p>
              <p className="text-gray-400">+91 123 456 7890</p>
              
              {/* Social links */}
              <div className="flex space-x-4 mt-4">
                {['twitter', 'facebook', 'instagram', 'linkedin'].map((platform) => (
                  <motion.a 
                    key={platform}
                    href={`https://${platform}.com/scaleup`}
                    className="text-gray-400 hover:text-white"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span className="sr-only">{platform}</span>
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                      {platform === 'twitter' && 
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>}
                      {platform === 'facebook' &&
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>}
                      {platform === 'instagram' &&
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path></svg>}
                      {platform === 'linkedin' &&
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2"></circle></svg>}
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          <motion.div 
            className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p>&copy; {new Date().getFullYear()} Scale Up - MSME Growth Predictor. All rights reserved.</p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
};

export default LandingPage;