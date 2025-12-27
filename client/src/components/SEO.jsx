import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, path, keywords }) => {
  const siteUrl = 'https://safetyc.in';
  const fullUrl = `${siteUrl}${path || ''}`;
  const defaultTitle = 'safetyc - Integrated Safety & Security Solutions';
  const defaultDescription = 'Professional fire safety, CCTV surveillance, and electrical solutions in West Bengal. Your trusted partner for security and peace of mind.';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title ? `${title} | safetyc` : defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title || defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title || defaultTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
    </Helmet>
  );
};

export default SEO;
