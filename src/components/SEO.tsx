import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export default function SEO({
  title = 'Budaful Door Designs - Premium Ribbons & Door Decorations',
  description = 'Shop premium quality ribbons, door decorations, and crafting supplies at Budaful Door Designs. Find wired ribbons, velvet ribbons, and more for your creative projects.',
  keywords = 'door decorations, ribbons, wired ribbon, velvet ribbon, door decor, crafting supplies, Buda TX',
  image = '/logo.png', // Add your default OG image
  url = 'https://budafuldoordesigns.com',
}: SEOProps): JSX.Element {
  const siteTitle = 'Budaful Door Designs';
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content={siteTitle} />
      
      {/* Structured Data / JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: siteTitle,
          url: url,
          logo: image,
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+1-512-797-2008',
            contactType: 'customer service',
            email: 'contact@budafuldoordesigns.com'
          },
          sameAs: [
            'https://facebook.com/budafuldoordesigns',
            'https://instagram.com/budafuldoordesigns',
            'https://pinterest.com/budafuldoordesigns'
          ]
        })}
      </script>
    </Helmet>
  );
}
