import React from 'react';
import { travelData } from '../data';
import './PageStyle.css';
import './Travel.css';

function Travel() {
  return (
    <div className="page-container">
      <h1 className="page-title">우즈베키스탄 여행지</h1>
      <p className="page-subtitle">실크로드의 찬란한 역사를 품은 대표 도시들을 소개합니다.</p>
      
      <div className="card-grid">
        {  
          travelData.map((city) => (
            <div key={city.id} className="common-card">              
              <div className="card-image-box">
                <img src={city.image} alt={city.title} className="card-image" />
              </div>
              
              <div className="card-content">
                <span className="card-tag">Travel</span>
                <h2 className="card-item-title">{city.title}</h2>
                <h4 className="card-item-subtitle">{city.subtitle}</h4>                
                <p className="card-item-desc">{city.description}</p>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Travel;