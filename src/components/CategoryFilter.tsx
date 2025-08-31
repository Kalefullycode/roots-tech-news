import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <Button
        variant={activeCategory === 'All' ? 'default' : 'outline'}
        onClick={() => onCategoryChange('All')}
        className={`font-orbitron font-bold ${
          activeCategory === 'All' 
            ? 'bg-gradient-hero glow-primary' 
            : 'border-neon hover:border-primary hover:bg-primary/10'
        }`}
      >
        ALL
      </Button>
      
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? 'default' : 'outline'}
          onClick={() => onCategoryChange(category)}
          className={`font-orbitron font-bold ${
            activeCategory === category 
              ? 'bg-gradient-hero glow-primary' 
              : 'border-neon hover:border-primary hover:bg-primary/10'
          }`}
        >
          {category.toUpperCase()}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;