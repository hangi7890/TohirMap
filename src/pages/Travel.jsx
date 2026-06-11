// 1. 리액트 라이브러리를 불러옵니다. 여기서는 화면 변화(State)를 쓰지 않으므로 React만 가져옵니다.
import React from 'react';
// 2. data.js 파일에 저장해 둔 우즈베키스탄 여행지 배열 데이터(travelData)를 불러옵니다.
import { travelData } from '../data';
// 3. Food 페이지와 디자인 통일성을 유지하기 위해 같은 CSS 파일을 공유해서 연결합니다.
import './PageStyle.css';

function Travel() {
  return (
    // 전체 페이지 레이아웃을 잡아주는 가장 바깥쪽 큰 바구니
    <div className="page-container">
      
      {/* 텍스트 영역: 고정된 타이틀과 부제목 */}
      <h1 className="page-title">우즈베키스탄 여행지</h1>
      <p className="page-subtitle">실크로드의 찬란한 역사를 품은 대표 도시들을 소개합니다.</p>
      
      {/* map 함수를 통해 정렬된 카드들이 배치되는 그리드(격자형) 박스 영역 */}
      <div className="card-grid">
        {
          /*
           * [리액트 핵심 개념: 배열.map()을 통한 정적 나열]
           * - travelData 배열에 담긴 3개의 도시 데이터(사마르칸트, 부하라, 히바)를 하나씩 순회합니다.
           * - (city) => ... : 배열 안의 원소 하나하나를 임시로 'city'라는 이름으로 부르겠다는 뜻입니다.
           * - Food.jsx와 달리 클릭 이벤트(onClick)나 상태 변경 함수가 없기 때문에, 
           * 이 페이지는 처음 로딩된 데이터를 화면에 그대로 예쁘게 뿌려주는 역할만 수행합니다.
           */
          travelData.map((city) => (
            <div 
              /*
               * [리액트 핵심 개념: Virtual DOM의 key 속성]
               * - 리액트가 리스트를 렌더링할 때 각각의 요소를 고유하게 식별할 수 있도록 도와주는 필수 속성입니다.
               * - 각 도시가 가진 고유 번호인 city.id(1, 2, 3)를 매핑하여 에러를 방지합니다.
               */
              key={city.id} 
              
              /*
               * [공통 디자인 스타일 적용]
               * - Food 페이지와 같은 디자인을 공유하므로 'common-card' 클래스명이 똑같이 들어가 있습니다.
               * - 여기서는 어떤 카드를 클릭해도 활성화(active)되는 기능이 없으므로 조건부 클래스 없이 깔끔하게 고정됩니다.
               */
              className="common-card"
            >
              {/* 카드 상단: 이미지 박스 영역 (src/images 폴더의 로컬 사진이 바인딩됨) */}
              <div className="card-image-box">
                <img src={city.image} alt={city.title} className="card-image" />
              </div>
              
              {/* 카드 하단: 텍스트 정보들이 들어가는 영역 */}
              <div className="card-content">
                <span className="card-tag">Travel</span>
                <h2 className="card-item-title">{city.title}</h2>
                <h4 className="card-item-subtitle">{city.subtitle}</h4>
                {/* 각 도시의 특징이나 역사적인 설명글이 매핑되어 출력됩니다. */}
                <p className="card-item-desc">{city.description}</p>
              </div>
            </div>
          )) // map 함수 끝
        }
      </div>
    </div>
  );
}

// 이 파일 외부(App.jsx 등)에서 Travel 컴포넌트를 불러와서 사용할 수 있도록 내보냅니다.
export default Travel;