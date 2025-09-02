
import { Helmet } from 'react-helmet-async';

const PreconnectHints = () => {
  return (
    <Helmet>
      {/* Primary external API - highest priority */}
      <link rel="preconnect" href="https://api.allorigins.win" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://api.allorigins.win" />
      
      {/* RSS feed sources - lower priority */}
      <link rel="dns-prefetch" href="https://techcrunch.com" />
      <link rel="dns-prefetch" href="https://feeds.arstechnica.com" />
      <link rel="dns-prefetch" href="https://www.theverge.com" />
    </Helmet>
  );
};

export default PreconnectHints;
