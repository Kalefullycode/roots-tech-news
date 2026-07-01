import { Link } from "react-router-dom";
import { TrendingUp, Clock, Star, BookOpen } from "lucide-react";
import NewsletterSubscribe from "./NewsletterSubscribe";

const Sidebar = () => {
  const trendingTopics = [
    { name: "Artificial Intelligence", href: "/category/ai", count: 42 },
    { name: "Quantum Computing", href: "/category/quantum", count: 28 },
    { name: "Cybersecurity", href: "/category/security", count: 35 },
    { name: "Startups", href: "/category/startups", count: 22 },
    { name: "Cloud Computing", href: "/category/cloud", count: 18 },
  ];

  const popularArticles = [
    { title: "The Future of AI in 2025", href: "/ai/future-2025" },
    { title: "How to Secure Your Data", href: "/security/data-protection" },
    { title: "Top 10 Tech Startups to Watch", href: "/startups/top-10" },
  ];

  return (
    <aside className="w-full lg:w-80">
      {/* Newsletter Signup */}
      <div className="mb-8">
        <NewsletterSubscribe variant="inline" />
      </div>

      {/* Trending Topics */}
      <div className="card p-6 mb-8">
        <h3 className="font-playfair font-bold text-xl mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Trending Topics
        </h3>
        <ul className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <li key={index}>
              <Link 
                to={topic.href} 
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{topic.name}</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{topic.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Popular Articles */}
      <div className="card p-6 mb-8">
        <h3 className="font-playfair font-bold text-xl mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 text-secondary" />
          Popular Articles
        </h3>
        <ul className="space-y-3">
          {popularArticles.map((article, index) => (
            <li key={index}>
              <Link 
                to={article.href} 
                className="block p-3 rounded-lg hover:bg-gray-50 transition-colors line-clamp-2"
              >
                <span className="text-gray-700">{article.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Links */}
      <div className="card p-6">
        <h3 className="font-playfair font-bold text-xl mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-accent" />
          Quick Links
        </h3>
        <ul className="space-y-3">
          <li>
            <Link to="/about" className="text-gray-700 hover:text-primary transition-colors">
              About Us
            </Link>
          </li>
          <li>
            <Link to="/contact" className="text-gray-700 hover:text-primary transition-colors">
              Contact
            </Link>
          </li>
          <li>
            <Link to="/resources" className="text-gray-700 hover:text-primary transition-colors">
              Resources
            </Link>
          </li>
          <li>
            <Link to="/newsletter" className="text-gray-700 hover:text-primary transition-colors">
              Newsletter
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
