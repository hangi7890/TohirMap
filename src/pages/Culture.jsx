import React from 'react';
import { cultureData } from '../data';
import './PageStyle.css';
import './Culture.css';

function Culture() {
  return (
    <div className="page-container">
      <h1 className="page-title">우즈베키스탄 문화</h1>
      <p className="page-subtitle">실크로드의 중심, 우즈베키스탄의 다채로운 전통 문화를 소개합니다.</p>

      <div className="card-grid">
        {cultureData.map((item) => (
          <div className="common-card" key={item.id}>
            <div className="card-image-box">
              <img src={item.img} alt={item.title} className="card-image" />
            </div>
            <div className="card-content">
              <h2 className="card-item-title">{item.title}</h2>
              <p className="card-item-desc">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Culture;