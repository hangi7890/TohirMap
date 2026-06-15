import { useState } from 'react';
import { cultureData } from '../data';
import ScrollTopButton from '../components/ScrollTopButton';
import { getPublicAssetPath } from '../utils/assets';
import './PageStyle.css';
import './Culture.css';

function Culture() {
  const doubleCultureData = [...cultureData, ...cultureData];
  const [selectedCulture, setSelectedCulture] = useState(cultureData[0]);

  return (
    <div className="page-container culture-dynamic-page">
      <h1 className="page-title">우즈베키스탄 문화</h1>
      <p className="page-subtitle">
        실크로드의 중심, 우즈베키스탄의 다채로운 전통 문화를 소개합니다.
        카드를 클릭해 자세한 이야기를 확인해 보세요.
      </p>

      <div className="slider-overflow-container">
        <div className="culture-track">
          {doubleCultureData.map((item, index) => (
            <button
              type="button"
              className="common-card culture-slide-card"
              key={`${item.id}-${index}`}
              onClick={() => setSelectedCulture(item)}
            >
              <div className="card-image-box">
                <img
                  src={getPublicAssetPath(item.img)}
                  alt={item.title}
                  className="card-image"
                  loading="lazy"
                />
              </div>
              <div className="card-content">
                <h2 className="card-item-title">{item.title}</h2>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedCulture && (
        <section className="culture-detail-section">
          <div className="detail-header">
            <h2 className="culture-detail-title">{selectedCulture.title} 이야기</h2>
          </div>

          <p className="culture-detail-main-desc">{selectedCulture.desc}</p>

          <div className="culture-meta-grid">
            <div className="meta-item">
              <span className="meta-label">추천 지역</span>
              <span className="meta-value">
                {selectedCulture.location || '사마르칸트, 타슈켄트, 부하라'}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">체험 포인트</span>
              <span className="meta-value">
                {selectedCulture.point || '전통 문화 체험 및 축제 참여'}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">여행 팁</span>
              <span className="meta-value">
                {selectedCulture.tip || '현지 축제 기간에 맞춰 방문하면 더욱 좋습니다.'}
              </span>
            </div>
          </div>
        </section>
      )}

      <ScrollTopButton />
    </div>
  );
}

export default Culture;
