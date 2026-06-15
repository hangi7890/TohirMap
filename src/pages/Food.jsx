import { useMemo, useState } from 'react';
import { foodData } from '../data';
import ScrollTopButton from '../components/ScrollTopButton';
import { getPublicAssetPath } from '../utils/assets';
import './PageStyle.css';
import './Food.css';

const foodCategories = [
  { id: 'all', label: '전체', foodIds: null },
  { id: 'rice', label: '밥', foodIds: [1] },
  { id: 'meat', label: '고기', foodIds: [2, 4, 9] },
  { id: 'soup', label: '국물', foodIds: [6, 7, 10, 11] },
  { id: 'dumpling', label: '만두·찜', foodIds: [5, 8] },
  { id: 'bread', label: '빵·간식', foodIds: [3, 12] },
];

function Food({ onNavigateMap = () => {} }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const selectedCategory =
    foodCategories.find((category) => category.id === activeCategory) || foodCategories[0];

  const filteredFoods = useMemo(() => {
    if (!selectedCategory.foodIds) {
      return foodData;
    }

    return foodData.filter((food) => selectedCategory.foodIds.includes(food.id));
  }, [selectedCategory]);

  return (
    <div className="page-container">
      <h1 className="page-title">우즈베키스탄 전통 음식</h1>
      <p className="page-subtitle">풍부한 향과 전통 화덕의 맛이 담긴 대표 요리들입니다.</p>

      <section className="food-filter-panel" aria-label="음식 카테고리 필터">
        <div className="food-filter-header">
          <span>음식 카테고리</span>
          <strong>{selectedCategory.label} · {filteredFoods.length}개</strong>
        </div>
        <div className="food-filter-row">
          {foodCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`food-filter-button${activeCategory === category.id ? ' active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
              aria-pressed={activeCategory === category.id}
            >
              {category.label}
            </button>
          ))}
        </div>
      </section>

      <div className="card-grid food-card-grid">
        {filteredFoods.map((food) => (
          <button
            key={food.id}
            type="button"
            className="common-card food-select-card"
            onClick={() => onNavigateMap({ foodId: food.id })}
            aria-label={`${food.title} 맛집을 지도에서 보기`}
          >
            <div className="card-image-box">
              <img src={getPublicAssetPath(food.image)} alt={food.title} className="card-image" />
              
              <div className="card-hover-overlay">
                <span className="hover-tag">{food.subtitle}</span>
                <p className="hover-detail">{food.detail}</p>
              </div>
            </div>

            <div className="card-content">
              <h2 className="card-item-title">{food.title}</h2>
              <span className="food-map-hint">맛집 지도 보기</span>
            </div>
          </button>
        ))}
      </div>

      <ScrollTopButton />
    </div>
  );
}

export default Food;
