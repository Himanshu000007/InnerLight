import { Link } from 'react-router-dom';
import { Heart, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="px-4 md:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                IL
              </div>
              <h3 className="text-lg font-bold text-text">InnerLight</h3>
            </div>
            <p className="text-text-secondary text-sm">
              Your personal wellness companion for mental health and mindfulness.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-text mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-text-secondary hover:text-primary transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-text-secondary hover:text-primary transition">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-text-secondary hover:text-primary transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-text mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#docs" className="text-text-secondary hover:text-primary transition">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#blog" className="text-text-secondary hover:text-primary transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#support" className="text-text-secondary hover:text-primary transition">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-text mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-border rounded-lg transition text-text-secondary hover:text-primary"
              >
                <Twitter size={20} />
              </a>
              
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-border rounded-lg transition text-text-secondary hover:text-primary"
              >
                <Github size={20} />
              </a>
              
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-border rounded-lg transition text-text-secondary hover:text-primary"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-text-secondary text-sm mb-4 md:mb-0 flex items-center gap-1">
            Made with <Heart size={16} className="text-danger" /> by InnerLight Team
          </p>
          <p className="text-text-secondary text-sm">
            © {currentYear} InnerLight. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;