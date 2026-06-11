import React, { useState, useEffect, useRef } from 'react';
import './MapPage.css'; // 지난번에 복붙한 스타일시트 연결

// 팀원분의 우즈베키스탄 7대 명소 데이터 이식
const spots = [
  { id: "tashkent", name: "Tashkent", label: "타슈켄트", type: "city", coords: [41.2995, 69.2401], overlay: [56.5, 45], point: "Chorsu Bazaar", route: "Tashkent -> Samarkand -> Bukhara", description: "현대적인 지하철과 초르수 바자르가 함께 있는 우즈베키스탄 여행의 출발점입니다.", chat: "타슈켄트는 입국 첫날 도시 적응, 환전, 지하철 투어를 넣기 좋습니다." },
  { id: "samarkand", name: "Samarkand", label: "사마르칸트", type: "heritage", coords: [39.6542, 66.9597], overlay: [48, 53], point: "Registan Square", route: "Tashkent -> Samarkand -> Bukhara", description: "레기스탄 광장을 중심으로 푸른 돔과 모자이크가 펼쳐지는 실크로드의 상징적인 도시입니다.", chat: "사마르칸트는 레기스탄 야경과 비비하눔 모스크를 같은 날 묶으면 동선이 좋습니다." },
  { id: "bukhara", name: "Bukhara", label: "부하라", type: "heritage", coords: [39.7681, 64.4556], overlay: [39.5, 52], point: "Po-i-Kalyan", route: "Samarkand -> Bukhara -> Khiva", description: "오래된 미나렛, 마드라사, 시장 골목이 촘촘히 남아 있어 느리게 걷기 좋은 고도입니다.", chat: "부하라는 반나절보다 하루 이상 머물 때 골목과 시장의 분위기가 잘 살아납니다." },
  { id: "khiva", name: "Khiva", label: "히바", type: "heritage", coords: [41.3783, 60.3639], overlay: [27.5, 44.5], point: "Itchan Kala", route: "Bukhara -> Khiva -> Urgench", description: "성벽 안쪽 이찬 칼라가 박물관처럼 이어지는 사막 가장자리의 역사 도시입니다.", chat: "히바는 해질 무렵 성벽 위에서 보는 색감이 좋아 마지막 일정에 배치하기 좋습니다." },
  { id: "fergana", name: "Fergana", label: "페르가나", type: "city", coords: [40.3734, 71.7978], overlay: [64.5, 49], point: "Rishtan Ceramics", route: "Tashkent -> Kokand -> Fergana", description: "도자기, 실크 공방, 전통 시장이 많은 동부 계곡 지역의 생활 문화 거점입니다.", chat: "페르가나는 리슈탄 도자기와 마르길란 실크 공방을 함께 보는 일정이 잘 맞습니다." },
  { id: "chimgan", name: "Chimgan", label: "침간", type: "nature", coords: [41.5431, 70.0242], overlay: [59.5, 42.5], point: "Chimgan Mountains", route: "Tashkent -> Chimgan -> Charvak", description: "타슈켄트에서 가까운 산악 휴양지로 하이킹과 차르박 호수 드라이브를 즐길 수 있습니다.", chat: "침간은 타슈켄트 근교 당일치기로 좋고, 맑은 날 차르박 호수까지 이어가면 좋습니다." },
  { id: "moynaq", name: "Moynaq", label: "모이낙", type: "nature", coords: [43.7683, 59.0214], overlay: [22, 31], point: "Ship Cemetery", route: "Nukus -> Moynaq -> Aral Sea", description: "아랄해의 변화를 보여주는 선박 묘지가 있는 북서부의 강렬한 풍경 지점입니다.", chat: "모이낙은 장거리 이동이 필요해서 누쿠스와 함께 별도 일정으로 잡는 편이 안정적입니다." }
];

function MapPage() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef(new Map());

  // 리액트 상태 관리 변수들
  const [selectedSpot, setSelectedSpot] = useState(spots[1]); // 기본값: 사마르칸트
  const [activeFilter, setActiveFilter] = useState('all');
  const [chatCollapsed, setChatCollapsed] = useState(false);
  const [chatReply, setChatReply] = useState("지도에서 명소를 선택해 보세요.");

  // 지도가 준비 안 됐을 때 띄울 헬퍼 상태
  const [mapLibraryReady, setMapLibraryReady] = useState(false);

  // Leaflet 글로벌 라이브러리가 로드되었는지 체크 및 지도 초기화
  useEffect(() => {
    if (window.L) {
      setMapLibraryReady(true);
      
      // 중복 초기화 방지
      if (!mapInstance.current && mapRef.current) {
        const L = window.L;
        
        // 1. 지도 인스턴스 생성
        const map = L.map(mapRef.current, {
          center: [41.05, 64.4],
          zoom: 6,
          minZoom: 5,
          maxZoom: 12,
        });
        mapInstance.current = map;

        // 2. 오픈스트리트맵 타일 레이어 추가
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        // 3. 도시 마커 핀 생성 및 등록
        spots.forEach((spot, index) => {
          const customIcon = L.divIcon({
            className: "",
            html: `<div class="custom-pin pin-${spot.type}"><span>${index + 1}</span></div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -34],
          });

          const marker = L.marker(spot.coords, { icon: customIcon, title: spot.name }).addTo(map);
          
          marker.on("click", () => {
            setSelectedSpot(spot);
            setChatReply(spot.chat);
            map.flyTo(spot.coords, 8, { duration: 0.9 });
          });
          
          marker.bindPopup(`<strong>${spot.name}</strong><br>${spot.point}`);
          markersRef.current.set(spot.id, marker);
        });

        // 4. 실크로드 메인 루트 라인 굽기
        const silkRoadRoute = ["tashkent", "samarkand", "bukhara", "khiva"].map(
          (id) => spots.find((s) => s.id === id).coords
        );
        L.polyline(silkRoadRoute, {
          color: "#d85d4a",
          weight: 5,
          opacity: 0.9,
          dashArray: "10 10",
        }).addTo(map);
      }
    } else {
      setMapLibraryReady(false);
    }
  }, []);

  // 장소나 버튼을 클릭했을 때 해당 위치로 지도를 부드럽게 이동시키는 함수
  const handleSelectSpot = (spot) => {
    setSelectedSpot(spot);
    setChatReply(spot.chat);
    
    if (mapInstance.current) {
      mapInstance.current.flyTo(spot.coords, 8, { duration: 0.9 });
      const marker = markersRef.current.get(spot.id);
      if (marker) marker.openPopup();
    }
  };

  // 챗봇 컴포넌트 퀵 질문 처리
  const handleQuickQuestion = (type) => {
    if (type === 'route') {
      setChatReply(`${selectedSpot.name} 기준 추천 루트는 ${selectedSpot.route}입니다.`);
    } else if (type === 'season') {
      setChatReply("우즈베키스탄은 4-6월, 9-10월이 걷기 좋고 사막 도시는 한낮 더위를 피하는 일정이 좋습니다.");
    } else if (type === 'food') {
      setChatReply("대표 음식은 플로프, 샤슬릭, 논, 라그만입니다. 시장 근처 로컬 식당을 함께 넣으면 현지 분위기가 살아납니다.");
    }
  };

  // 필터링된 장소 목록 추출
  const filteredSpots = activeFilter === 'all' 
    ? spots 
    : spots.filter(spot => spot.type === activeFilter);

  return (
    <main className="page-shell">
      {/* 왼쪽 지도 영역 스테이지 */}
      <section className="map-stage" aria-label="우즈베키스탄 인터랙티브 지도">
        <div className="map-title">
          <p>Silk Road Atlas</p>
          <h1>UZBEKISTAN MAP</h1>
        </div>
        
        {/* 실제 지도 바구니 */}
        <div ref={mapRef} className="leaflet-map"></div>

        {!mapLibraryReady && (
          <div className="map-fallback">
            지도 라이브러리(Leaflet)를 불러오는 중입니다... index.html을 확인해 주세요.
          </div>
        )}

        {/* 하단 퀵 포커스 버튼 액션바 */}
        <div className="map-actions">
          <button type="button" onClick={() => handleSelectSpot(spots[0])}>🏢 Tashkent</button>
          <button type="button" onClick={() => handleSelectSpot(spots[1])}>🕌 Samarkand</button>
          <button type="button" onClick={() => handleSelectSpot(spots[3])}>📍 Khiva</button>
        </div>
      </section>

      {/* 오른쪽 정보 사이드 패널 */}
      <aside className="info-panel">
        <div className="intro-block">
          <span className="eyebrow">Route Planner</span>
          <h2>실크로드의 도시를 한 화면에서 탐색하세요.</h2>
          <p>타슈켄트에서 사마르칸트, 부하라, 히바까지 이어지는 대표 여행지를 지도 위에서 바로 확인할 수 있습니다.</p>
        </div>

        <div className="stats-grid">
          <article><strong>7</strong><span>대표 스팟</span></article>
          <article><strong>3</strong><span>추천 루트</span></article>
          <article><strong>4-6월</strong><span>추천 시기</span></article>
        </div>

        {/* 카테고리 필터 버튼 렌더링 */}
        <div className="filter-row">
          {['all', 'heritage', 'city', 'nature'].map((filter) => (
            <button
              key={filter}
              className={`filter-button ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter.toUpperCase()}
            </button>
          ))}
        </div>

        {/* 사이드바 필터링 명소 리스트 */}
        <div className="spot-list">
          {filteredSpots.map((spot, idx) => (
            <button
              key={spot.id}
              className={`spot-button ${spot.id === selectedSpot.id ? 'active' : ''}`}
              onClick={() => handleSelectSpot(spot)}
            >
              <span className="spot-index">{idx + 1}</span>
              <span>
                <strong>{spot.name}</strong>
                <span>{spot.label} · {spot.point}</span>
              </span>
              <span className="spot-type">{spot.type}</span>
            </button>
          ))}
        </div>

        {/* 선택된 명소 상세 카드 서식 */}
        <section className="selected-card">
          <span className="selected-tag">{selectedSpot.type}</span>
          <h3>{selectedSpot.name}</h3>
          <p>{selectedSpot.description}</p>
          <dl>
            <div>
              <dt>추천 루트</dt>
              <dd>{selectedSpot.route}</dd>
            </div>
            <div>
              <dt>포인트</dt>
              <dd>{selectedSpot.point}</dd>
            </div>
          </dl>
        </section>
      </aside>

      {/* 챗봇 여행 위젯 가이드 */}
      <section className={`chat-widget ${chatCollapsed ? 'collapsed' : ''}`}>
        <div className="chat-header">
          <div>
            <span>Chatling</span>
            <strong>Uzbekistan Guide</strong>
          </div>
          <button type="button" onClick={() => setChatCollapsed(!chatCollapsed)}>
            {chatCollapsed ? '＋' : '－'}
          </button>
        </div>
        <div className="chat-body">
          <p className="bot-message">
            안녕하세요. 우즈베키스탄 지도에서 도시를 선택하면 짧은 여행 팁을 알려드릴게요.
          </p>
          <div className="quick-questions">
            <button type="button" onClick={() => handleQuickQuestion('route')}>추천 루트</button>
            <button type="button" onClick={() => handleQuickQuestion('season')}>여행 시기</button>
            <button type="button" onClick={() => handleQuickQuestion('food')}>현지 음식</button>
          </div>
          <p className="bot-message muted">{chatReply}</p>
        </div>
      </section>
    </main>
  );
}

export default MapPage;