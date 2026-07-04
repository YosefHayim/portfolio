import { Helmet } from "react-helmet-async";

const SITE_URL = "https://josephsabag.dev";
const DEFAULT_IMAGE = `${SITE_URL}/screenshots/portfolio-preview.png`;
const SITE_NAME = "Joseph Sabag";
const TWITTER_HANDLE = "@yosefhayim";

type SEOProps = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
  noindex?: boolean;
  structuredData?: Record<string, unknown>;
};

export const SEO = ({
  title,
  description = "Joseph Sabag - AI Software Engineer specializing in React, Node.js, TypeScript, and AI integrations. Building impactful software solutions.",
  image = DEFAULT_IMAGE,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author = "Joseph Sabag",
  keywords = [
    "Joseph Sabag",
    "Software Engineer",
    "Full Stack Developer",
    "React",
    "Node.js",
    "TypeScript",
    "AI",
    "Portfolio",
  ],
  noindex = false,
  structuredData,
}: SEOProps) => {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | AI Software Engineer`;
  const pageUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Joseph Sabag",
    jobTitle: "AI Software Engineer",
    url: SITE_URL,
    sameAs: [
      "https://github.com/YosefHayim",
      "https://linkedin.com/in/yosefhayim",
    ],
    worksFor: {
      "@type": "Organization",
      name: "Predicto AI",
    },
    knowsAbout: [
      "React",
      "Node.js",
      "TypeScript",
      "Python",
      "AI/ML",
      "Full Stack Development",
    ],
  };

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <meta name="author" content={author} />
      <link rel="canonical" href={pageUrl} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === "article" && (
        <meta property="article:author" content={author} />
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      <meta name="geo.region" content="IL" />
      <meta name="geo.placename" content="Israel" />

      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
