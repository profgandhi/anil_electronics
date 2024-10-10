// components/FooterElements.tsx

import React from 'react';

const FooterElements: React.FC = () => (
  <div className="flex justify-center space-x-8 mt-8">
    <div className="flex items-center">
      {/* Shield Icon SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-gray-700 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 11c0-3.866-3.582-7-8-7V4a8 8 0 0116 0v0c-4.418 0-8 3.134-8 7z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 22c4.418 0 8-3.134 8-7v-0c0-3.866-3.582-7-8-7s-8 3.134-8 7v0c0 3.866 3.582 7 8 7z"
        />
      </svg>
      <span className="text-sm">
        Safe and Secure Payment. <br /> 100% Authentic products.
      </span>
    </div>
    <div className="flex items-center">
      {/* Award Icon SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-gray-700 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
      <span className="text-sm">57 Years of Trust.</span>
    </div>
  </div>
);

export default FooterElements;
