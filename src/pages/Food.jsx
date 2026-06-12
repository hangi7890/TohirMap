import React, { useState } from 'react';
import { foodData } from '../data';
import './PageStyle.css';
import './Food.css';

function Food() {
  const [selectedFood, setSelectedFood] = useState(foodData[0]);

  return (
    <div className="page-container">
      <h1 className="page-title">우즈베키스탄 전통 음식</h1>
      <p className="page-subtitle">풍부한 향과 전통 화덕의 맛이 담긴 대표 요리들입니다. 음식을 클릭해 보세요!</p>

      <div className="card-grid">
        {
          foodData.map((food) => (
            <div key={food.id} className={`common-card food-select-card ${selectedFood.id === food.id ? 'active' : ''}`} onClick={() => setSelectedFood(food)}>
              <div className="card-image-box">
                <img src={food.image} alt={food.title} className="card-image" />
              </div>
              <div className="card-content">
                <span className="card-tag">Food</span>
                <h2 className="card-item-title">{food.title}</h2>
                <h4 className="card-item-subtitle">{food.subtitle}</h4>
              </div>
            </div>
          ))
        }
      </div>

      <div className="detail-section">
        <h2 className="detail-title">🕌 {selectedFood.title} 이야기</h2>
        <p className="detail-desc">{selectedFood.detail}</p>
      </div>
    </div>
  );
}

export default Food;