import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Star, ExternalLink, Filter } from "lucide-react";
import { BOOKS, BOOK_CATEGORIES } from "@/data/books";

const BooksSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const filteredBooks = selectedCategory === "All" 
    ? BOOKS 
    : BOOKS.filter(book => book.category === selectedCategory);

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-accent" />
          <h2 className="font-orbitron text-3xl font-bold text-glow-accent">
            Essential Tech Books
          </h2>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        {BOOK_CATEGORIES.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? "bg-gradient-accent" : ""}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <Card 
            key={book.id} 
            className="p-5 bg-card-modern border border-card-border/60 hover:border-accent/50 transition-all hover-lift group"
          >
            <div className="mb-3">
              <Badge className="bg-accent/20 text-accent border-accent/30 text-xs mb-3">
                {book.category}
              </Badge>
              <h3 className="font-orbitron text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                {book.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                by {book.author}
              </p>
            </div>

            <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
              {book.description}
            </p>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-accent fill-accent" />
                <span className="text-sm font-semibold ml-1">{book.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                • {book.publishYear}
              </span>
            </div>

            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="flex-1 bg-gradient-accent hover:glow-accent"
                onClick={() => book.amazonUrl && window.open(book.amazonUrl, '_blank')}
              >
                Buy
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="flex-1"
                onClick={() => book.goodreadsUrl && window.open(book.goodreadsUrl, '_blank')}
              >
                Reviews
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default BooksSection;

