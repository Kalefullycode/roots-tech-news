
import { Helmet } from 'react-helmet-async';

const PreconnectHints = () => {
  return (
    <Helmet>
      {/* Additional runtime preconnects for fallback APIs */}
      <link rel="dns-prefetch" href="https://disrupt-africa.com" />
      <link rel="dns-prefetch" href="https://ventureburn.com" />
      <link rel="dns-prefetch" href="https://towardsdatascience.com" />
    </Helmet>
  );
};

export default PreconnectHints;
