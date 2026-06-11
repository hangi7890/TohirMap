// 1. 리액트 엔진과 화면 변화를 감지하는 핵심 훅(useState)을 가져옵니다.
import React, { useState } from 'react';
// 2. data.js 파일에 저장해 둔 우즈베키스탄 음식 배열 데이터(foodData)를 불러옵니다.
import { foodData } from '../data';
// 3. 이 페이지의 레이아웃과 디자인을 담당하는 CSS 파일을 연결합니다.
import './PageStyle.css';

function Food() {
  /*
   * [리액트 핵심 개념: State (상태)]
   * - 사용자가 어떤 음식을 클릭했는지 리액트가 기억하도록 만드는 상자입니다.
   * - selectedFood: 현재 선택된 음식의 데이터 객체가 들어있습니다.
   * - setSelectedFood: 선택된 음식을 바꿀 때 사용하는 전용 변경 함수입니다.
   * - useState(foodData[0]): 처음 화면이 켜졌을 때는 배열의 첫 번째인 '플로프'를 기본값으로 세팅합니다.
   */
  const [selectedFood, setSelectedFood] = useState(foodData[0]);

  return (
    // 전체 페이지를 감싸는 큰 바구니 (CSS flex/grid 레이아웃의 기준점)
    <div className="page-container">
      
      {/* 텍스트 영역: 고정된 타이틀과 부제목 */}
      <h1 className="page-title">우즈베키스탄 전통 음식</h1>
      <p className="page-subtitle">풍부한 향과 전통 화덕의 맛이 담긴 대표 요리들입니다. 음식을 클릭해 보세요!</p>
      
      {/* 상단 영역: map 함수를 이용해 음식 카드들을 반복해서 화면에 그리는 공간 */}
      <div className="card-grid">
        {
          /*
           * [리액트 핵심 개념: 배열.map()]
           * - foodData 배열에 있는 3개의 데이터를 하나씩 순회하면서,
           * 그 데이터가 담긴 HTML(JSX) 덩어리를 똑같이 복사해서 배열 형태로 리턴해줍니다.
           * - (food) => ... : 배열 안의 원소 하나하나를 임시로 'food'라는 이름으로 부르겠다는 뜻입니다.
           */
          foodData.map((food) => (
            <div 
              /*
               * [리액트 핵심 개념: Virtual DOM의 key 속성]
               * - 리액트는 효율적으로 화면을 바꾸기 위해 반복문 구조에서 반드시 고유한 'key' 값을 요구합니다.
               * - 여기서는 각 음식 데이터가 가진 유일한 번호인 food.id(1, 2, 3)를 매핑해 식별자로 씁니다.
               */
              key={food.id} 
              
              /*
               * [리액트 핵심 개념: 동적 클래스 부여 (조건부 스타일링)]
               * - 백틱(``)과 ${} 문법을 사용해 자바스크립트 조건식을 클래스명 안에 집어넣었습니다.
               * - 만약 '현재 리액트가 기억하는 selectedFood의 id'와 '지금 map으로 그리고 있는 food의 id'가 일치하면
               * 문자열 'active'를 추가로 붙여줍니다. -> CSS에서 .active 테두리 디자인이 먹히게 됩니다.
               */
              className={`common-card food-select-card ${selectedFood.id === food.id ? 'active' : ''}`}
              
              /*
               * [리액트 핵심 개념: 이벤트 핸들러 (onClick)]
               * - 사용자가 이 카드를 클릭하는 순간, 상단의 State 변경 함수인 setSelectedFood가 실행됩니다.
               * - 이때 인자로 지금 클릭한 카드의 정보인 'food' 객체를 통째로 넘겨주어 State를 업데이트합니다.
               * - State가 바뀌면 리액트는 화면을 다시 그리기(재렌더링) 시작합니다.
               */
              onClick={() => setSelectedFood(food)}
            >
              {/* 카드 내부: 이미지 박스 (src/images 폴더의 로컬 주소가 바인딩됨) */}
              <div className="card-image-box">
                <img src={food.image} alt={food.title} className="card-image" />
              </div>
              
              {/* 카드 내부: 텍스트 정보 영역 */}
              <div className="card-content">
                <span className="card-tag">Food</span>
                <h2 className="card-item-title">{food.title}</h2>
                <h4 className="card-item-subtitle">{food.subtitle}</h4>
              </div>
            </div>
          )) // map 함수 끝
        }
      </div>

      {/* 하단 영역: 사용자가 클릭한 음식의 상세 설명이 동적으로 바뀌는 공간 */}
      <div className="detail-section">
        {
          /*
           * [리액트 핵심 개념: 데이터 바인딩]
           * - 중괄호를 열고 State 변수명을 적어주면, 그 자리에 실제 데이터 텍스트가 꽂힙니다.
           * - 사용자가 다른 음식을 클릭해서 selectedFood가 바뀌면, 
           * 리액트가 이를 감지하여 하단의 타이틀과 설명글을 새로운 내용으로 알아서 갈아 끼워 줍니다.
           */
        }
        <h2 className="detail-title">🕌 {selectedFood.title} 이야기</h2>
        <p className="detail-desc">{selectedFood.detail}</p>
      </div>

    </div>
  );
}

// 이 파일 외부(App.jsx 등)에서 Food 컴포넌트를 불러와서 사용할 수 있도록 내보냅니다.
export default Food;