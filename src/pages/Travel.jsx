import { useState } from 'react';
import { travelData } from '../data';
import './PageStyle.css';
import './Travel.css';

function Travel({ onNavigateMap = () => {} }) {
  // 현재 선택된 도시의 정보를 담는 상태 (초기값은 null = 아무것도 선택 안 됨)
  const [activeCity, setActiveCity] = useState(null);

  const handleGoToMap = () => {
    setActiveCity(null);
    onNavigateMap('samarkand');
  };

  return (
    <div className="page-container">
      <h1 className="page-title">우즈베키스탄 여행지</h1>
      <p className="page-subtitle">실크로드의 찬란한 역사를 품은 대표 도시들을 소개합니다.</p>
      
      {/* 1. 도시 목록 그리드 영역 (사진과 이름만 간단히 노출) */}
      <div className="card-grid">
        {travelData.map((city) => (
          <div 
            key={city.id} 
            className="common-card travel-simple-card"
            onClick={() => setActiveCity(city)} // 카드 클릭 시 해당 도시 데이터 저장
          >              
            <div className="card-image-box">
              <img src={city.image} alt={city.title} className="card-image" />
            </div>
            
            <div className="card-content simple-content">
              <span className="card-tag">Travel</span>
              <h2 className="card-item-title">{city.title}</h2>
              <h4 className="card-item-subtitle">{city.subtitle}</h4>                
            </div>
          </div>
        ))}
      </div>

      {/* 2. 상세 오버레이 화면 영역 (도시를 클릭했을 때만 활성화) */}
      {activeCity && (
        <div className="travel-overlay" onClick={() => setActiveCity(null)}>
          {/* 어두운 배경 전체가 깔리고, 그 위에 큰 사진 배경 카드가 올라옵니다 */}
          <div 
            className="travel-detail-modal"
            style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), url(${activeCity.image})` }}
            onClick={(e) => e.stopPropagation()} // 상세창 내부 클릭 시 닫히는 현상 방지
          >
            {/* 우측 상단 닫기 버튼 */}
            <button className="modal-close-btn" onClick={() => setActiveCity(null)}>×</button>
            
            {/* 상세 내용 텍스트 영역 */}
            <div className="modal-text-content">
              <span className="modal-tag">Travel Course</span>
              <h2 className="modal-title">{activeCity.title}</h2>
              <h4 className="modal-subtitle">{activeCity.subtitle}</h4>
              <hr className="modal-divider" />
              <p className="modal-desc">{activeCity.description}</p>
              {activeCity.id === 1 && (
                <button
                  type="button"
                  className="modal-map-link"
                  onClick={handleGoToMap}
                >
                  지도에서 사마르칸트 보기
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Travel;
