
import { Helmet } from 'react-helmet-async';

const PreconnectHints = () => {
  return (
    <Helmet>
      <link rel="preconnect" href="https://api.allorigins.win" />
      <link rel="dns-prefetch" href="https://feeds.arstechnica.com" />
      <link rel="dns-prefetch" href="https://techcrunch.com" />
      <link rel="dns-prefetch" href="https://www.theverge.com" />
      <link rel="dns-prefetch" href="https://www.technologyreview.com" />
      <link rel="dns-prefetch" href="https://feeds.feedburner.com" />
      <link rel="dns-prefetch" href="https://disrupt-africa.com" />
      <link rel="dns-prefetch" href="https://ventureburn.com" />
      <link rel="dns-prefetch" href="https://techcabal.com" />
      <link rel="dns-prefetch" href="https://towardsdatascience.com" />
    </Helmet>
  );
};

export default PreconnectHints;
