import { useEffect, useState } from 'react';
import './ScrollTopButton.css';

function ScrollTopButton({ threshold = 500 }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      className={`scroll-top-button${isVisible ? ' is-visible' : ''}`}
      onClick={scrollToTop}
      aria-label="맨 위로 이동"
      title="맨 위로 이동"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 5l-7 7 1.4 1.4 4.6-4.6V20h2V8.8l4.6 4.6L19 12z" />
      </svg>
    </button>
  );
}

export default ScrollTopButton;
