import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  type?: 'website' | 'article';
  image?: string;
  noIndex?: boolean;
}

const SEO = ({
  title,
  description = "Urbanshade OS is a free browser-based operating system simulation featuring a complete desktop environment, terminal, file explorer, apps, and developer tools.",
  path = "",
  type = "website",
  image = "/og-image.png",
  noIndex = false,
}: SEOProps) => {
  const siteTitle = "Urbanshade OS";
  const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} — Browser-Based Operating System Simulation`;
  const canonicalUrl = `https://urbanshade.lovable.app${path}`;
  const imageUrl = image.startsWith('http') ? image : `https://urbanshade.lovable.app${image}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      
      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
};

export default SEO;
