
import { Helmet } from 'react-helmet-async';

const PreconnectHints = () => {
  return (
    <Helmet>
      {/* Critical API preconnects - highest priority for performance */}
      <link rel="preconnect" href="https://newsapi.org" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://api.rss2json.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://api.allorigins.win" crossOrigin="anonymous" />
      
      {/* DNS prefetch for RSS feed sources */}
      <link rel="dns-prefetch" href="https://techcrunch.com" />
      <link rel="dns-prefetch" href="https://feeds.arstechnica.com" />
      <link rel="dns-prefetch" href="https://www.theverge.com" />
      <link rel="dns-prefetch" href="https://www.technologyreview.com" />
      <link rel="dns-prefetch" href="https://techcabal.com" />
    </Helmet>
  );
};

export default PreconnectHints;
