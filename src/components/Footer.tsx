import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Rss } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "About Us", href: "/about" },
      { name: "Our Team", href: "/about#team" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
    ],
    resources: [
      { name: "Resources", href: "/resources" },
      { name: "Blog", href: "/blog" },
      { name: "Newsletter", href: "/newsletter" },
      { name: "Podcasts", href: "/podcasts" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookie-policy" },
      { name: "Contact", href: "/contact" },
    ],
    categories: [
      { name: "Technology", href: "/category/technology" },
      { name: "Startups", href: "/category/startups" },
      { name: "AI", href: "/category/ai" },
      { name: "Security", href: "/category/security" },
      { name: "Videos", href: "/videos" },
      { name: "Live", href: "/videos/live" },
    ]
  };

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: "https://facebook.com/rootstechnews", label: "Facebook" },
    { icon: <Twitter className="h-5 w-5" />, href: "https://twitter.com/rootstechnews", label: "Twitter" },
    { icon: <Linkedin className="h-5 w-5" />, href: "https://linkedin.com/company/rootstechnews", label: "LinkedIn" },
    { icon: <Instagram className="h-5 w-5" />, href: "https://instagram.com/rootstechnews", label: "Instagram" },
    { icon: <Youtube className="h-5 w-5" />, href: "https://youtube.com/rootstechnews", label: "YouTube" },
    { icon: <Rss className="h-5 w-5" />, href: "/feed.xml", label: "RSS Feed" },
  ];

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-playfair font-bold text-2xl mb-4">Roots Tech News</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Professional technology insights and analysis. Discover tomorrow's technology today.
            </p>
            <div className="flex gap-3 mt-6">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-lg hover:bg-primary transition-colors"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href} 
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href} 
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Categories</h4>
            <ul className="space-y-3">
              {footerLinks.categories.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href} 
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href} 
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Roots Tech News. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm">
              Made with professionalism and passion for technology
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
