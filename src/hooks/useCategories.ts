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
    image: getCloudinaryUrl('https://res.cloudinary.com/dfszr2lob/image/upload/v1738631290/wired_ribbon_example_ca7jcj.webp'),
    link: '/products?category=wired-ribbon',
  },
  {
    name: 'Velvet Ribbons',
    image: getCloudinaryUrl('https://res.cloudinary.com/dfszr2lob/image/upload/v1738631290/velvet_ribbon_example.webp'),
    link: '/products?category=velvet-ribbon',
  },
  {
    name: 'Embossed Ribbons',
    image: getCloudinaryUrl('https://res.cloudinary.com/dfszr2lob/image/upload/v1738631290/embossed_ribbon_example.webp'),
    link: '/products?category=embossed-ribbon',
  },
  {
    name: 'Diamond Dust Ribbons',
    image: getCloudinaryUrl('https://res.cloudinary.com/dfszr2lob/image/upload/v1738631290/diamond_dust_ribbon_example.webp'),
    link: '/products?category=diamond-dust-ribbon',
  },
  {
    name: 'Satin Ribbons',
    image: getCloudinaryUrl('https://res.cloudinary.com/dfszr2lob/image/upload/v1738631290/satin_ribbon_example.webp'),
    link: '/products?category=satin-ribbon',
  },
  {
    name: 'Acetate Ribbons',
    image: getCloudinaryUrl('https://res.cloudinary.com/dfszr2lob/image/upload/v1738631290/acetate_ribbon_example.webp'),
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
