'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { Link } from 'react-router-dom';
import {
  Home,
  Upload,
  Zap,
  Share2,
  BarChart,
  UserPlus,
  CheckCircle,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { submitToWaitlist, WaitlistError } from '../../api/waitlist';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { getRecentBlogPosts } from '../api/blog';
import { BlogPost } from '../types/blog';
//import useIsMobile from '../hooks/useIsMobile';

const fadeInUp = {
  initial: {
    y: 60,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const FeatureCard = ({ icon: Icon, title, description }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 min-h-[300px]"
    >
      <div className="flex flex-col h-full">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          className="bg-blue-600 rounded-full p-4 shadow-lg w-16 h-16 flex items-center justify-center mb-6"
        >
          <Icon className="h-8 w-8 text-white" />
        </motion.div>
        <div>
          <h3 className="text-2xl font-bold mb-4">{title}</h3>
          <p className="text-gray-600 leading-relaxed text-lg">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
}

const ParallaxSection = ({
  children,
  className = '',
}: ParallaxSectionProps) => {
  const { scrollYProgress } = useScroll({
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  //const [dropdownOpen, setDropdownOpen] = useState(false);
  //const isMobile = useIsMobile();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setIsSubmitting(true);
      await submitToWaitlist(email);

      // Show success message
      toast.success('Thanks for joining our waitlist!');
      setEmail('');
    } catch (error) {
      // Type guard for our custom error type
      if ((error as WaitlistError).code === 'EMAIL_EXISTS') {
        toast.error('This email is already on our waitlist');
      } else {
        toast.error('Failed to join waitlist. Please try again later.');
      }
      console.error('Failed to submit email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false); // Close the menu on link click
  };

  useEffect(() => {
    const fetchRecentPosts = async () => {
      const posts = await getRecentBlogPosts(3);
      setRecentPosts(posts);
    };
    fetchRecentPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-md z-50">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-blue-600">AgentPages</span>
          </div>
          <button
            className="md:hidden flex items-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-blue-600" />
            ) : (
              <div className="h-6 w-6 text-blue-600">
                <div className="h-0.5 w-6 bg-blue-600 mb-1"></div>
                <div className="h-0.5 w-6 bg-blue-600 mb-1"></div>
                <div className="h-0.5 w-6 bg-blue-600"></div>
              </div>
            )}
          </button>
          <nav
            className={`md:flex ${
              isMenuOpen ? 'block' : 'hidden'
            } absolute md:static bg-white w-full md:w-auto left-0 top-full border-t md:border-0 transition-all duration-300 ease-in-out`}
          >
            <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 px-5 py-4 md:py-0">
              <li>
                <a
                  href="#features"
                  onClick={(e) => handleLinkClick(e, 'features')}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => handleLinkClick(e, 'how-it-works')}
                  className="text-gray-600 hover:text-blue-600"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#benefits"
                  onClick={(e) => handleLinkClick(e, 'benefits')}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Benefits
                </a>
              </li>
              {/*<li>
                <a
                  href="#blog"
                  onClick={(e) => handleLinkClick(e, 'blog')}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Blog
                </a>
              </li>*/}
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-100px' }}
        variants={fadeInUp}
        className="container mx-auto px-4 py-24 text-center min-h-[60vh] flex flex-col items-center justify-center"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6 max-w-5xl"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Create Stunning Property Landing Pages in Seconds
        </motion.h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-600 max-w-3xl mx-auto">
          AgentPages uses AI to generate professional, high-converting landing
          pages for real estate agents. No design skills required.
        </p>
        <form onSubmit={handleSubmit} className="max-w-lg w-full mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl shadow-xl">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              className="flex-grow text-lg py-6"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 sm:w-auto w-full"
            >
              {isSubmitting ? 'Submitting...' : 'Get Early Access'}
            </Button>
          </div>
        </form>
      </motion.section>

      {/* Features Section */}
      <section
        id="features"
        className="container mx-auto px-4 py-20 overflow-hidden"
      >
        <ParallaxSection children={undefined}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4 text-center">
              Key Features
            </h2>
            <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
              Everything you need to create and manage professional property
              landing pages
            </p>
          </motion.div>
        </ParallaxSection>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-16"
        >
          {[
            {
              icon: Zap,
              title: 'AI-Powered Design',
              description:
                'Generate professional designs tailored to each property in seconds',
            },
            {
              icon: Upload,
              title: 'Easy Upload',
              description:
                'Simply upload photos and basic info, our AI handles the rest',
            },
            {
              icon: Share2,
              title: 'Instant Sharing',
              description:
                'Share your property pages instantly with custom URLs and QR codes',
            },
            {
              icon: BarChart,
              title: 'Lead Analytics',
              description:
                'Track views, leads, and conversions with built-in analytics',
            },
          ].map((feature, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="container mx-auto px-4 py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
      >
        <ParallaxSection children={undefined}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-12 text-center">
              Your Journey to Better Property Pages
            </h2>
            <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto text-lg">
              Create stunning property landing pages in just a few simple steps
            </p>
          </motion.div>
        </ParallaxSection>

        {/* Vertical connecting line for mobile */}
        <motion.div
          className="md:hidden absolute left-1/2 w-0.5 bg-blue-200"
          style={{
            top: '360px', // Adjust this value to match your first card's position
            height: 'calc(100% - 480px)', // Adjust to match the distance between first and last card
            transformOrigin: 'top',
          }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />

        <motion.div
          className="max-w-5xl mx-auto relative"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.3,
              },
            },
          }}
        >
          {/* Connection Line for desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-200" />

          {[
            {
              title: 'Step 1: Sign Up',
              description:
                'Create your account and unlock the power of AI-driven property pages.',
              icon: <UserPlus className="h-8 w-8 text-white" />,
              animation: (
                <div className="flex items-center justify-center">
                  <div className="bg-blue-600 rounded-full p-6 shadow-lg">
                    <UserPlus className="h-12 w-12 text-white" />
                  </div>
                </div>
              ),
            },
            {
              title: 'Step 2: Upload Property',
              description:
                'Simply upload your property photos and input basic details.',
              icon: <Upload className="h-8 w-8 text-white" />,
              animation: (
                <div className="flex items-center justify-center">
                  <div className="bg-blue-600 rounded-full p-6 shadow-lg">
                    <Upload className="h-12 w-12 text-white" />
                  </div>
                </div>
              ),
            },
            {
              title: 'Step 3: AI Magic',
              description:
                'Watch as our AI transforms your content into a professional landing page.',
              icon: <Zap className="h-8 w-8 text-white" />,
              animation: (
                <div className="flex items-center justify-center">
                  <div className="bg-blue-600 rounded-full p-6 shadow-lg">
                    <Zap className="h-12 w-12 text-white" />
                  </div>
                </div>
              ),
            },
            {
              title: 'Step 4: Customize',
              description:
                'Fine-tune your page with our intuitive editor and AI suggestions.',
              icon: <CheckCircle className="h-8 w-8 text-white" />,
              animation: (
                <div className="flex items-center justify-center">
                  <div className="bg-blue-600 rounded-full p-6 shadow-lg">
                    <CheckCircle className="h-12 w-12 text-white" />
                  </div>
                </div>
              ),
            },
            {
              title: 'Step 5: Share & Convert',
              description:
                'Share your professional page and start collecting leads instantly.',
              icon: <Share2 className="h-8 w-8 text-white" />,
              animation: (
                <div className="flex items-center justify-center">
                  <div className="bg-blue-600 rounded-full p-6 shadow-lg">
                    <Share2 className="h-12 w-12 text-white" />
                  </div>
                </div>
              ),
            },
          ].map((step, index) => (
            <motion.div
              key={index}
              className={`flex items-center mb-16 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } flex-col`}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <div className="w-full md:w-1/2 p-4">
                <motion.div
                  className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-2xl font-bold mb-3 text-blue-600">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-lg">{step.description}</p>
                </motion.div>
              </div>
              <div className="w-full md:w-1/2 p-4 flex justify-center items-center">
                {/* Hide animation on mobile, show on md and up */}
                <div className="hidden md:block">{step.animation}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section
        id="benefits"
        className="container mx-auto px-4 py-20 overflow-hidden"
      >
        <ParallaxSection children={undefined}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-12 text-center">
              Real Results for Real Estate Agents
            </h2>
          </motion.div>
        </ParallaxSection>

        {/* Stats Row */}
        <motion.div
          variants={staggerContainer}
          className="flex flex-wrap justify-center gap-8 mb-16"
        >
          {[
            {
              stat: '75%',
              label: 'Time Saved',
              description: 'on landing page creation',
            },
            {
              stat: '3x',
              label: 'More Leads',
              description: 'compared to traditional listings',
            },
            {
              stat: '90%',
              label: 'of Agents',
              description: 'close deals faster with AgentPages',
            },
          ].map((item, index) => (
            <motion.div key={index} variants={fadeInUp} className="text-center">
              <h3 className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                {item.stat}
              </h3>
              <p className="text-xl font-semibold mb-1">{item.label}</p>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature Comparison */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h3 className="text-2xl font-bold mb-8 text-center">
            Traditional vs AgentPages
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xl font-semibold mb-4 text-gray-500">
                Traditional Process
              </h4>
              <div className="flex items-center space-x-2 text-gray-500">
                <X className="h-5 w-5" />
                <p>Hours spent designing landing pages</p>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <X className="h-5 w-5" />
                <p>Generic templates that all look the same</p>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <X className="h-5 w-5" />
                <p>Limited customization options</p>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <X className="h-5 w-5" />
                <p>No built-in lead capture or analytics</p>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-semibold mb-4 text-blue-600">
                With AgentPages
              </h4>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <p>Landing pages generated in minutes</p>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <p>AI-powered unique designs for each property</p>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <p>Smart customization with AI suggestions</p>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <p>Built-in lead tracking and performance analytics</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-100px' }}
        variants={fadeInUp}
        className="container mx-auto px-4 py-20 text-center bg-blue-100 rounded-xl"
      >
        <h2 className="text-3xl font-bold mb-4">
          Ready to Elevate Your Real Estate Game?
        </h2>
        <p className="text-lg mb-6 text-gray-700">
          Join the growing community of successful agents using AgentPages to
          create stunning landing pages effortlessly.
        </p>
        <div className="flex justify-center space-x-4 justify-content-center items-center">
          <form onSubmit={handleSubmit} className="max-w-lg w-full mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl shadow-xl">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="flex-grow text-lg py-6"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 sm:w-auto w-full"
              >
                {isSubmitting ? 'Submitting...' : 'Get Early Access'}
              </Button>
            </div>
          </form>
        </div>
      </motion.section>

      {/* Blog Section */}
      {/*<section id="blog" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-12 text-center">Latest Updates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.description}</p>
                <Link
                  to={`/blog/${post.id}`}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Read More →
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            to="/blog"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            View All Posts
          </Link>
        </div>
      </section>  */}

      {/* Footer */}
      <motion.footer
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-100px' }}
        variants={fadeInUp}
        className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-16"
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Home className="h-6 w-6 text-blue-400" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 text-transparent bg-clip-text">
                  AgentPages
                </span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Empowering real estate agents with AI-powered landing pages.
                Create stunning property showcases in minutes.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#features"
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center space-x-2"
                  >
                    <span className="h-1 w-1 bg-blue-400 rounded-full"></span>
                    <span>Features</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center space-x-2"
                  >
                    <span className="h-1 w-1 bg-blue-400 rounded-full"></span>
                    <span>How It Works</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#benefits"
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center space-x-2"
                  >
                    <span className="h-1 w-1 bg-blue-400 rounded-full"></span>
                    <span>Benefits</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">
                Contact Us
              </h3>
              <div className="space-y-3">
                <p className="text-gray-300 flex items-center space-x-2">
                  <span className="h-1 w-1 bg-blue-400 rounded-full"></span>
                  <span>info@agentpages.com</span>
                </p>
                <p className="text-gray-300 flex items-center space-x-2">
                  <span className="h-1 w-1 bg-blue-400 rounded-full"></span>
                  <span>(555) 123-4567</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="text-center">
              <p className="text-gray-400">
                &copy; {new Date().getFullYear()} AgentPages. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
