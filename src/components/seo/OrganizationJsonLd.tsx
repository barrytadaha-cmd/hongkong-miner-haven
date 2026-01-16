import { Helmet } from 'react-helmet-async';

interface OrganizationJsonLdProps {
  baseUrl?: string;
}

export const OrganizationJsonLd = ({ baseUrl = 'https://minerhaolan.lovable.app' }: OrganizationJsonLdProps) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    "name": "MinerHaolan",
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/favicon.ico`
    },
    "description": "Premium cryptocurrency mining hardware supplier. Authorized dealer for Bitmain, MicroBT, Canaan, IceRiver and more.",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["English", "Chinese"]
    },
    "sameAs": [
      "https://twitter.com/minerhaolan",
      "https://t.me/minerhaolan"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Hong Kong",
      "addressCountry": "HK"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
};

export default OrganizationJsonLd;
