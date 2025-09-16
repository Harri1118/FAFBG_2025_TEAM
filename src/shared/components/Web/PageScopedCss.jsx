import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageScopedCSS({ href }) {
  const location = useLocation();

  useEffect(() => {
    const linkId = `page-style-${href}`;
    let linkTag = document.getElementById(linkId);

    if (!linkTag) {
      linkTag = document.createElement('link');
      linkTag.id = linkId;
      linkTag.rel = 'stylesheet';
      linkTag.href = href;
      document.head.appendChild(linkTag);
    }

    // Remove the style on unmount (page change)
    return () => {
      const tag = document.getElementById(linkId);
      if (tag) document.head.removeChild(tag);
    };
  }, [location.pathname, href]);

  return null;
}
