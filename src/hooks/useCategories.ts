import { useState, useEffect } from 'react';
import { productsApi } from '../api/products';

export interface Category {
  name: string;
  image: string;
  link: string;
}

// Default categories in case API fails
const defaultCategories: Category[] = [
  {
    name: 'Wired Ribbons',
    image: '',
    link: '/products?category=wired-ribbon',
  },
  {
    name: 'Velvet Ribbons',
    image: '',
    link: '/products?category=velvet-ribbon',
  },
  {
    name: 'Embossed Ribbons',
    image: '',
    link: '/products?category=embossed-ribbon',
  },
  {
    name: 'Diamond Dust Ribbons',
    image: '',
    link: '/products?category=diamond-dust-ribbon',
  },
  {
    name: 'Satin Ribbons',
    image: '',
    link: '/products?category=satin-ribbon',
  },
  {
    name: 'Acetate Ribbons',
    image: '',
    link: '/products?category=acetate-ribbon',
  },
];

const formatCategoryName = (category: string): string => {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const products = await productsApi.getAllProducts();
        
        if (!products || products.length === 0) {

          setCategories(defaultCategories);
          return;
        }

        // Get unique categories
        const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
        
        if (uniqueCategories.length === 0) {

          setCategories(defaultCategories);
          return;
        }

        // Format categories
        const formattedCategories = uniqueCategories.map(category => ({
          name: formatCategoryName(category),
          image: '',
          link: `/products?category=${category}`,
        }));

        setCategories(formattedCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Using default categories instead.');
        setCategories(defaultCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}
