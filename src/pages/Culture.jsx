import { useCallback, useMemo, useRef, useState } from 'react';
import { cultureData } from '../data';
import ScrollTopButton from '../components/ScrollTopButton';
import { getPublicAssetPath } from '../utils/assets';
import './PageStyle.css';
import './Culture.css';

const WHEEL_NAVIGATION_THRESHOLD = 28;
const WHEEL_NAVIGATION_COOLDOWN_MS = 650;

function Culture() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideMotion, setSlideMotion] = useState({ direction: 'settled', key: 0 });
  const wheelNavigationReadyAt = useRef(0);
  const selectedCulture = cultureData[currentIndex];

  const carouselItems = useMemo(() => {
    const lastIndex = cultureData.length - 1;
    const previousIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
    const nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;

    return [
      { item: cultureData[previousIndex], position: 'previous', index: previousIndex },
      { item: selectedCulture, position: 'current', index: currentIndex },
      { item: cultureData[nextIndex], position: 'next', index: nextIndex },
    ];
  }, [currentIndex, selectedCulture]);

  const moveCulture = useCallback((getNextIndex, direction) => {
    setSlideMotion((motion) => ({ direction, key: motion.key + 1 }));
    setCurrentIndex(getNextIndex);
  }, []);

  const selectVisibleCulture = (index, position) => {
    if (position === 'current') {
      return;
    }

    moveCulture(() => index, position === 'previous' ? 'previous' : 'next');
  };

  const showPreviousCulture = useCallback(() => {
    moveCulture((index) => (index === 0 ? cultureData.length - 1 : index - 1), 'previous');
  }, [moveCulture]);

  const showNextCulture = useCallback(() => {
    moveCulture((index) => (index === cultureData.length - 1 ? 0 : index + 1), 'next');
  }, [moveCulture]);

  const handleCarouselWheel = useCallback(
    (event) => {
      const horizontalDelta =
        Math.abs(event.deltaX) >= Math.abs(event.deltaY)
          ? event.deltaX
          : event.shiftKey
            ? event.deltaY
            : 0;

      if (Math.abs(horizontalDelta) < WHEEL_NAVIGATION_THRESHOLD) {
        return;
      }

      event.preventDefault();

      const now = Date.now();
      if (now < wheelNavigationReadyAt.current) {
        return;
      }

      wheelNavigationReadyAt.current = now + WHEEL_NAVIGATION_COOLDOWN_MS;

      if (horizontalDelta > 0) {
        showNextCulture();
      } else {
        showPreviousCulture();
      }
    },
    [showNextCulture, showPreviousCulture]
  );

  return (
    <div className="page-container culture-dynamic-page">
      <h1 className="page-title">우즈베키스탄 문화</h1>
      <p className="page-subtitle">
        실크로드의 중심, 우즈베키스탄의 다채로운 전통 문화를 소개합니다.
        이전과 다음 버튼으로 문화를 넘겨 보세요.
      </p>

      <section
        className="culture-carousel"
        aria-label="우즈베키스탄 문화 카드"
      >
        <button type="button" className="culture-page-button" onClick={showPreviousCulture}>
          <span aria-hidden="true">←</span>
          이전 문화
        </button>

        <div
          key={slideMotion.key}
          className={`culture-card-stage slide-${slideMotion.direction}`}
          onWheel={handleCarouselWheel}
        >
          {carouselItems.map(({ item, position, index }) => (
            <button
              type="button"
              className={`culture-feature-card ${position}`}
              key={`${item.id}-${position}`}
              onClick={() => selectVisibleCulture(index, position)}
              aria-current={position === 'current' ? 'true' : undefined}
            >
              <div className="culture-card-image">
                <img src={getPublicAssetPath(item.img)} alt={item.title} />
              </div>
              <div className="culture-card-copy">
                <span>{position === 'current' ? '현재 문화' : position === 'previous' ? '이전 문화' : '다음 문화'}</span>
                <h2>{item.title}</h2>
                {position === 'current' && <p>{item.desc}</p>}
              </div>
            </button>
          ))}
        </div>

        <button type="button" className="culture-page-button" onClick={showNextCulture}>
          다음 문화
          <span aria-hidden="true">→</span>
        </button>
      </section>

      <section className="culture-detail-section">
        <div className="culture-detail-image">
          <img src={getPublicAssetPath(selectedCulture.img)} alt={selectedCulture.title} />
        </div>
        <div className="culture-detail-content">
          <div className="detail-header">
            <span>Culture Guide</span>
            <h2 className="culture-detail-title">{selectedCulture.title} 이야기</h2>
          </div>

          <p className="culture-detail-main-desc">{selectedCulture.desc}</p>

          <div className="culture-meta-grid">
            <div className="meta-item">
              <span className="meta-label">추천 지역</span>
              <span className="meta-value">{selectedCulture.location}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">체험 포인트</span>
              <span className="meta-value">{selectedCulture.point}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">여행 팁</span>
              <span className="meta-value">{selectedCulture.tip}</span>
            </div>
          </div>
        </div>
      </section>

      <ScrollTopButton />
    </div>
  );
}

export default Culture;
