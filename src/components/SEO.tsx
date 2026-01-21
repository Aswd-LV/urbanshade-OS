import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  type?: 'website' | 'article';
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  section?: string;
  articleSchema?: boolean;
}

const SEO = ({
  title,
  description = "Urbanshade OS is a free browser-based operating system simulation featuring a complete desktop environment, terminal, file explorer, apps, and developer tools.",
  path = "",
  type = "website",
  image = "/og-image.png",
  noIndex = false,
  keywords = [],
  author = "Urbanshade Corporation",
  publishedDate,
  modifiedDate,
  section,
  articleSchema = false,
}: SEOProps) => {
  const siteTitle = "Urbanshade OS";
  const siteName = "Urbanshade OS Documentation";
  const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} — Browser-Based Operating System Simulation`;
  const canonicalUrl = `https://urbanshade.lovable.app${path}`;
  const imageUrl = image.startsWith('http') ? image : `https://urbanshade.lovable.app${image}`;

  const defaultKeywords = [
    "urbanshade",
    "os simulation",
    "browser os",
    "web operating system",
    "terminal emulator",
    "desktop simulation",
  ];
  const allKeywords = [...new Set([...keywords, ...defaultKeywords])];

  // JSON-LD Structured Data
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: "https://urbanshade.lovable.app",
    description: "Browser-based operating system simulation with apps, terminal, and developer tools.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://urbanshade.lovable.app/docs?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const articleSchemaData = articleSchema ? {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description: description,
    author: {
      "@type": "Organization",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "Urbanshade Corporation",
      logo: {
        "@type": "ImageObject",
        url: "https://urbanshade.lovable.app/favicon.svg",
      },
    },
    url: canonicalUrl,
    image: imageUrl,
    datePublished: publishedDate || "2025-01-01",
    dateModified: modifiedDate || new Date().toISOString().split('T')[0],
    mainEntityOfPage: canonicalUrl,
    articleSection: section || "Documentation",
  } : null;

  // Breadcrumb schema for documentation pages
  const breadcrumbSchema = path.startsWith('/docs') ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://urbanshade.lovable.app",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Documentation",
        item: "https://urbanshade.lovable.app/docs",
      },
      ...(title && path !== '/docs' ? [{
        "@type": "ListItem",
        position: 3,
        name: title,
        item: canonicalUrl,
      }] : []),
    ],
  } : null;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      
      {/* Keywords */}
      {allKeywords.length > 0 && (
        <meta name="keywords" content={allKeywords.join(", ")} />
      )}
      
      {/* Author & Publisher */}
      <meta name="author" content={author} />
      <meta name="publisher" content="Urbanshade Corporation" />
      
      {/* Language & Locale */}
      <meta httpEquiv="content-language" content="en" />
      <meta property="og:locale" content="en_US" />
      
      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={title || "Urbanshade OS"} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      
      {/* Article specific meta */}
      {type === 'article' && publishedDate && (
        <meta property="article:published_time" content={publishedDate} />
      )}
      {type === 'article' && modifiedDate && (
        <meta property="article:modified_time" content={modifiedDate} />
      )}
      {type === 'article' && section && (
        <meta property="article:section" content={section} />
      )}
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      
      {articleSchemaData && (
        <script type="application/ld+json">
          {JSON.stringify(articleSchemaData)}
        </script>
      )}
      
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
