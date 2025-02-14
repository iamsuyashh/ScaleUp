import React from 'react';
import { motion } from 'framer-motion';

const TypewriterText = ({ text, delay = 0 }) => {
  return text.split(" ").map((word, wordIndex) => (
    <motion.span
      key={wordIndex}
      className="inline-block mr-[0.3em]" // Added consistent spacing after each word
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay + wordIndex * 0.15 }}
    >
      {word}
    </motion.span>
  ));
};

const HeroSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto mt-10 p-6"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          <div className="overflow-hidden mb-2">
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <TypewriterText 
                text="Unlock Business Trends" 
                delay={0.2}
              />
            </motion.div>
          </div>
          <div className="overflow-hidden">
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            >
              <TypewriterText 
                text="With AI-Powered Predictions!" 
                delay={1.2}
              />
            </motion.div>
          </div>
        </h1>
        
        <motion.p
          className="text-gray-600 italic mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.5 }}
        >
          Curious About MSME Growth Trends? Our MSME Support Portal
          <br />
          Analyzes Registration Data To Predict Future Patterns And Insights.
        </motion.p>
      </div>
    </motion.div>
  );
};

export default HeroSection;