import { useState, useEffect } from 'react';
import { productsApi } from '../api/products';
import { getCloudinaryUrl } from '../utils/imageUtils';

export interface Category {
  name: string;
  image: string;
  link: string;
}

// Default categories in case API fails
const defaultCategories: Category[] = [
  {
    name: 'Wired Ribbons',
    image: getCloudinaryUrl('', '/images/wired ribbon example.jpeg'),
    link: '/products?category=wired-ribbon',
  },
  {
    name: 'Velvet Ribbons',
    image: getCloudinaryUrl('', '/images/sampleRibbonPurple.jpeg'),
    link: '/products?category=velvet-ribbon',
  },
  {
    name: 'Embossed Ribbons',
    image: getCloudinaryUrl('', '/images/sampleRibbonGreen.jpeg'),
    link: '/products?category=embossed-ribbon',
  },
  {
    name: 'Diamond Dust Ribbons',
    image: getCloudinaryUrl('', '/images/ScatteredRibbon.jpeg'),
    link: '/products?category=diamond-dust-ribbon',
  },
  {
    name: 'Satin Ribbons',
    image: getCloudinaryUrl('', '/images/sampleRibbonBlue.jpeg'),
    link: '/products?category=satin-ribbon',
  },
  {
    name: 'Acetate Ribbons',
    image: getCloudinaryUrl('', '/images/sampleRibbonOrange.jpeg'),
    link: '/products?category=acetate-ribbon',
  },
];

const formatCategoryName = (category: string | undefined): string => {
  if (!category) return '';
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
        const uniqueCategories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
        
        if (uniqueCategories.length === 0) {
          setCategories(defaultCategories);
          return;
        }

        // Format categories
        const formattedCategories = uniqueCategories.map(category => ({
          name: formatCategoryName(category),
          image: products.find(p => p.category === category)?.imageUrl || '',
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
