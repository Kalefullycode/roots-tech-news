
import { Helmet } from 'react-helmet-async';

const PreconnectHints = () => {
  return (
    <Helmet>
      <link rel="preconnect" href="https://api.rss2json.com" />
      <link rel="preconnect" href="https://newsapi.org" />
      <link rel="dns-prefetch" href="https://feeds.arstechnica.com" />
      <link rel="dns-prefetch" href="https://techcrunch.com" />
      <link rel="dns-prefetch" href="https://www.theverge.com" />
    </Helmet>
  );
};

export default PreconnectHints;
