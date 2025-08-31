import ArticleCard from "./ArticleCard";
import aiArticle from "@/assets/ai-article.jpg";
import startupArticle from "@/assets/startup-article.jpg";
import securityArticle from "@/assets/security-article.jpg";
import gadgetArticle from "@/assets/gadget-article.jpg";

const MainFeed = () => {
  const articles = [
    {
      title: "Revolutionary AI Breakthrough in Quantum Neural Networks",
      excerpt: "Scientists at the University of Cape Town have developed a groundbreaking quantum-AI hybrid that could reshape machine learning as we know it. This Afro-futuristic approach combines traditional computing with quantum mechanics.",
      category: "AI",
      date: "2 hours ago",
      imageUrl: aiArticle,
      featured: true
    },
    {
      title: "Nigerian Startup Raises $50M for Solar-Powered Smart Cities",
      excerpt: "Lagos-based tech company unveils plans to build Africa's first fully solar-powered smart city infrastructure.",
      category: "Startups",
      date: "4 hours ago",
      imageUrl: startupArticle
    },
    {
      title: "Cybersecurity Threats in the Metaverse Era",
      excerpt: "As virtual worlds become more integrated with our daily lives, new security challenges emerge.",
      category: "Security",
      date: "6 hours ago",
      imageUrl: securityArticle
    },
    {
      title: "Revolutionary Holographic Display Technology",
      excerpt: "South African engineers develop first consumer-grade holographic displays for everyday use.",
      category: "Gadgets",
      date: "8 hours ago",
      imageUrl: gadgetArticle
    },
    {
      title: "Cultural Preservation Through Digital Archives",
      excerpt: "How blockchain technology is helping preserve African cultural heritage for future generations.",
      category: "Culture",
      date: "12 hours ago",
      imageUrl: gadgetArticle
    },
    {
      title: "Quantum Computing Breakthrough in Johannesburg",
      excerpt: "Local university achieves quantum supremacy milestone with new cooling technology.",
      category: "AI",
      date: "1 day ago",
      imageUrl: aiArticle
    },
    {
      title: "Sustainable Tech Solutions for Climate Change",
      excerpt: "African innovators lead the way in developing eco-friendly technology solutions.",
      category: "Startups",
      date: "1 day ago",
      imageUrl: startupArticle
    },
    {
      title: "Next-Gen Wearable Technology from Kenya",
      excerpt: "Nairobi startup unveils smart jewelry that monitors health and environmental data.",
      category: "Gadgets",
      date: "2 days ago",
      imageUrl: securityArticle
    }
  ];

  const featuredArticle = articles[0];
  const regularArticles = articles.slice(1);

  return (
    <main className="space-y-8">
      {/* Featured Article */}
      <section>
        <h2 className="font-orbitron text-2xl font-bold mb-6 text-glow-primary">
          FEATURED STORY
        </h2>
        <ArticleCard {...featuredArticle} />
      </section>

      {/* Latest News Grid */}
      <section>
        <h2 className="font-orbitron text-2xl font-bold mb-6 text-glow-accent">
          LATEST DISCOVERIES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {regularArticles.map((article, index) => (
            <ArticleCard key={index} {...article} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default MainFeed;