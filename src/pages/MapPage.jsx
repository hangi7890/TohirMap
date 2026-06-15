import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import './MapPage.css';
import { cleanupChatling, loadChatling } from '../utils/chatling';
import { foodRestaurantData, restaurantImageByName } from '../data';

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const getRestaurantImage = (spot) => restaurantImageByName[spot.name] || null;

const restaurantMenuPhotosByName = {
  "Caravan": [
    {
      src: "/images/restaurant-menus/caravan-menu-9.jpg",
      caption: "메인 코스 메뉴판",
      source: "https://caravan-1.wheree.com/menu"
    },
    {
      src: "/images/restaurant-menus/caravan-menu-7.jpg",
      caption: "샐러드 메뉴판",
      source: "https://caravan-1.wheree.com/menu"
    },
    {
      src: "/images/restaurant-menus/caravan-menu-5.jpg",
      caption: "실제 영수증 가격 예시",
      source: "https://caravan-1.wheree.com/menu"
    }
  ],
  "Minzifa": [
    {
      src: "/images/restaurant-menus/minzifa-menu-9.jpeg",
      caption: "실제 영수증 가격 예시",
      source: "https://www.happycow.net/reviews/minzifa-bukhara-61839"
    }
  ]
};

const FOOD_MARKER_ICON = `
  <svg class="food-marker-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M7 2v8" />
    <path d="M4 2v8" />
    <path d="M10 2v8" />
    <path d="M4 10h6" />
    <path d="M7 10v12" />
    <path d="M17 2c-1.7 1.8-2.5 4.1-2.5 7.2V13H17v9" />
    <path d="M17 2v20" />
  </svg>
`;

const restaurantAddressByName = {
  "Besh Qozon": "Tashkent, Oqlon 3-tor Street, Ko'kcha Darvoza",
  "Afsona": "Tashkent, Uqchi Street 4",
  "Caravan": "Tashkent, Makhmud Tarabi Street 22",
  "Karimbek": "Samarkand, Amir Temur Street",
  "Minzifa": "Bukhara, Xo'kja-Ro'shnoyi Street, Old City",
  "National Food": "Tashkent, Sebzor Street, Khadra",
  "Chorsu Bazaar": "Tashkent, Chorsu Bazaar, Old Town",
  "Siyob Bazaar": "Samarkand, Shohizinda Street, Siyob Bazaar",
};

const restaurantHoursByName = {
  "Besh Qozon": "10:00 - 22:00",
  "Afsona": "11:00 - 23:00",
  "Caravan": "11:00 - 23:00",
  "Karimbek": "10:00 - 22:00",
  "Minzifa": "11:00 - 22:00",
  "National Food": "09:00 - 22:00",
  "Chorsu Bazaar": "08:00 - 20:00",
  "Siyob Bazaar": "08:00 - 18:00",
};

const menuGuideByRestaurantName = {
  "Besh Qozon": {
    items: [
      { name: "Wedding pilaf", price: "32,000 UZS" },
      { name: "Special pilaf with olive oil", price: "36,000 UZS" },
      { name: "Choyxona pilaf", price: "34,000 UZS" },
      { name: "Extra meat", price: "16,000 UZS" },
    ],
  },
  "Caravan": {
    items: [
      { name: "Kazan-Kabob", price: "168,000 UZS" },
      { name: "Caravan Osh", price: "71,000 UZS" },
      { name: "Bayram Osh", price: "79,000 UZS" },
      { name: "Shilpildok", price: "84,000 UZS" },
      { name: "Shashlik iz baraniny", price: "35,500 UZS" },
    ],
  },
  "Minzifa": {
    items: [
      { name: "Gulkhanu", price: "18,000 UZS" },
      { name: "Vegetables on skewer", price: "12,000 UZS" },
      { name: "Vegetable plov", price: "14,000 UZS" },
      { name: "Vitamin salad", price: "9,500 UZS" },
      { name: "Americano", price: "9,000 UZS" },
    ],
  },
};

const menuGuideByFoodId = {
  1: {
    items: [
      { name: "Choyxona Osh", price: "60,000 UZS", src: "/images/plov.jpg" },
      { name: "To'y Osh", price: "60,000 UZS", src: "/images/plov.jpg" },
      { name: "Achichuk Salad", price: "18,000 UZS", src: "/images/food.jpg" },
    ],
  },
  2: {
    items: [
      { name: "Beef Shashlik", price: "28,000 UZS", src: "/images/shashlik.jpg" },
      { name: "Non", price: "5,000 UZS", src: "/images/non.jpg" },
      { name: "Achichuk Salad", price: "15,000 UZS", src: "/images/food.jpg" },
    ],
  },
  3: {
    items: [
      { name: "Samarkand Non", price: "6,000 UZS", src: "/images/non.jpg" },
      { name: "Green Tea", price: "8,000 UZS", src: "/images/food.jpg" },
      { name: "Gumma", price: "8,000 UZS", src: "/images/gumma.jpg" },
    ],
  },
  4: {
    items: [
      { name: "Norin", price: "45,000 UZS", src: "/images/norin.jpg" },
      { name: "Qazi", price: "35,000 UZS", src: "/images/food.jpg" },
      { name: "Green Tea", price: "8,000 UZS", src: "/images/food.jpg" },
    ],
  },
  5: {
    items: [
      { name: "Manti", price: "42,000 UZS", src: "/images/manti.jpg" },
      { name: "Qatiq", price: "8,000 UZS", src: "/images/food.jpg" },
      { name: "Achichuk Salad", price: "15,000 UZS", src: "/images/food.jpg" },
    ],
  },
  6: {
    items: [
      { name: "Chuchvara", price: "38,000 UZS", src: "/images/chuchvara.jpg" },
      { name: "Non", price: "5,000 UZS", src: "/images/non.jpg" },
      { name: "Green Tea", price: "8,000 UZS", src: "/images/food.jpg" },
    ],
  },
  7: {
    items: [
      { name: "Shurpa", price: "42,000 UZS", src: "/images/shurpa.jpg" },
      { name: "Non", price: "5,000 UZS", src: "/images/non.jpg" },
      { name: "Achichuk Salad", price: "15,000 UZS", src: "/images/food.jpg" },
    ],
  },
  8: {
    items: [
      { name: "Dimlama", price: "48,000 UZS", src: "/images/dimlama.jpg" },
      { name: "Non", price: "5,000 UZS", src: "/images/non.jpg" },
      { name: "Fresh Salad", price: "15,000 UZS", src: "/images/food.jpg" },
    ],
  },
  9: {
    items: [
      { name: "Kazan Kebab", price: "65,000 UZS", src: "/images/kazan-kebab.jpg" },
      { name: "Non", price: "5,000 UZS", src: "/images/non.jpg" },
      { name: "Achichuk Salad", price: "15,000 UZS", src: "/images/food.jpg" },
    ],
  },
  10: {
    items: [
      { name: "Moshhurda", price: "35,000 UZS", src: "/images/moshhurda.jpg" },
      { name: "Non", price: "5,000 UZS", src: "/images/non.jpg" },
      { name: "Green Tea", price: "8,000 UZS", src: "/images/food.jpg" },
    ],
  },
  11: {
    items: [
      { name: "Halim", price: "40,000 UZS", src: "/images/halim.jpg" },
      { name: "Non", price: "5,000 UZS", src: "/images/non.jpg" },
      { name: "Green Tea", price: "8,000 UZS", src: "/images/food.jpg" },
    ],
  },
  12: {
    items: [
      { name: "Gumma", price: "8,000 UZS", src: "/images/gumma.jpg" },
      { name: "Non", price: "5,000 UZS", src: "/images/non.jpg" },
      { name: "Green Tea", price: "8,000 UZS", src: "/images/food.jpg" },
    ],
  },
};

const getRestaurantAddress = (spot) =>
  restaurantAddressByName[spot.name] || `${spot.city}, ${spot.route.replace(' · ', ', ')}`;

const getRestaurantHours = (spot) => restaurantHoursByName[spot.name] || "10:00 - 22:00";

const getMenuGuide = (spot) =>
  menuGuideByRestaurantName[spot.name] || menuGuideByFoodId[spot.foodId] || menuGuideByFoodId[1];

const getRestaurantMenuPhotos = (spot) => restaurantMenuPhotosByName[spot.name] || [];

// 팀원분의 우즈베키스탄 7대 명소 데이터 이식
const spots = [
  {
    id: "tashkent",
    name: "Tashkent",
    label: "타슈켄트",
    type: "city",
    coords: [41.2995, 69.2401],
    overlay: [56.5, 45],
    point: "Chorsu Bazaar",
    route: "Tashkent -> Samarkand -> Bukhara",
    description: "현대적인 지하철과 초르수 바자르가 함께 있는 우즈베키스탄 여행의 출발점입니다.",
    chat: "타슈켄트는 입국 첫날 도시 적응, 환전, 지하철 투어를 넣기 좋습니다."
  },
  {
    id: "samarkand",
    name: "Samarkand",
    label: "사마르칸트",
    type: "heritage",
    coords: [39.6542, 66.9597],
    overlay: [48, 53],
    point: "Registan Square",
    route: "Tashkent -> Samarkand -> Bukhara",
    description: "레기스탄 광장을 중심으로 푸른 돔과 모자이크가 펼쳐지는 실크로드의 상징적인 도시입니다.",
    chat: "사마르칸트는 레기스탄 야경과 비비하눔 모스크를 같은 날 묶으면 동선이 좋습니다."
  },
  {
    id: "bukhara",
    name: "Bukhara",
    label: "부하라",
    type: "heritage",
    coords: [39.7681, 64.4556],
    overlay: [39.5, 52],
    point: "Po-i-Kalyan",
    route: "Samarkand -> Bukhara -> Khiva",
    description: "오래된 미나렛, 마드라사, 시장 골목이 촘촘히 남아 있어 느리게 걷기 좋은 고도입니다.",
    chat: "부하라는 반나절보다 하루 이상 머물 때 골목과 시장의 분위기가 잘 살아납니다."
  },
  {
    id: "khiva",
    name: "Khiva",
    label: "히바",
    type: "heritage",
    coords: [41.3783, 60.3639],
    overlay: [27.5, 44.5],
    point: "Itchan Kala",
    route: "Bukhara -> Khiva -> Urgench",
    description: "성벽 안쪽 이찬 칼라가 박물관처럼 이어지는 사막 가장자리의 역사 도시입니다.",
    chat: "히바는 해질 무렵 성벽 위에서 보는 색감이 좋아 마지막 일정에 배치하기 좋습니다."
  },
  {
    id: "fergana",
    name: "Fergana",
    label: "페르가나",
    type: "city",
    coords: [40.3734, 71.7978],
    overlay: [64.5, 49],
    point: "Rishtan Ceramics",
    route: "Tashkent -> Kokand -> Fergana",
    description: "도자기, 실크 공방, 전통 시장이 많은 동부 계곡 지역의 생활 문화 거점입니다.",
    chat: "페르가나는 리슈탄 도자기와 마르길란 실크 공방을 함께 보는 일정이 잘 맞습니다."
  },
  {
    id: "chimgan",
    name: "Chimgan",
    label: "침간",
    type: "nature",
    coords: [41.5431, 70.0242],
    overlay: [59.5, 42.5],
    point: "Chimgan Mountains",
    route: "Tashkent -> Chimgan -> Charvak",
    description: "타슈켄트에서 가까운 산악 휴양지로 하이킹과 차르박 호수 드라이브를 즐길 수 있습니다.",
    chat: "침간은 타슈켄트 근교 당일치기로 좋고, 맑은 날 차르박 호수까지 이어가면 좋습니다."
  },
  {
    id: "moynaq",
    name: "Moynaq",
    label: "모이낙",
    type: "nature",
    coords: [43.7683, 59.0214],
    overlay: [22, 31],
    point: "Ship Cemetery",
    route: "Nukus -> Moynaq -> Aral Sea",
    description: "아랄해의 변화를 보여주는 선박 묘지가 있는 북서부의 강렬한 풍경 지점입니다.",
    chat: "모이낙은 장거리 이동이 필요해서 누쿠스와 함께 별도 일정으로 잡는 편이 안정적입니다."
  }
];

function MapPage({ focusSpotId = null, focusFoodId = null }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef(new Map());
  const restaurantSpots = useMemo(() => {
    if (!focusFoodId) {
      return [];
    }

    return foodRestaurantData.filter((spot) => spot.foodId === focusFoodId);
  }, [focusFoodId]);
  const isFoodMap = restaurantSpots.length > 0;
  const displayedSpots = isFoodMap ? restaurantSpots : spots;
  const foodMapTitle = isFoodMap ? restaurantSpots[0].foodTitle : '';
  const initialSpot =
    (isFoodMap ? displayedSpots[0] : spots.find((spot) => spot.id === focusSpotId)) || spots[1];

  const [selectedSpot, setSelectedSpot] = useState(initialSpot);
  const [activeFilter, setActiveFilter] = useState('all');
  const [mapLibraryReady] = useState(() => typeof window !== 'undefined' && Boolean(window.L));

  const moveMapToSpot = useCallback((spot) => {
    if (!mapInstance.current) {
      return;
    }

    const zoomLevel = spot.zoom || (spot.type === 'food' ? 15 : 8);
    mapInstance.current.flyTo(spot.coords, zoomLevel, { duration: 0.9 });

    window.setTimeout(() => {
      const marker = markersRef.current.get(spot.id);
      if (marker && spot.type !== 'food') {
        marker.openPopup();
      }
    }, 250);
  }, []);

  const focusSpotOnMap = useCallback((spot) => {
    setSelectedSpot(spot);
    moveMapToSpot(spot);
  }, [moveMapToSpot]);

  useEffect(() => {
    loadChatling();

    return () => {
      cleanupChatling();
    };
  }, []);

  // Leaflet 지도 초기화
  useEffect(() => {
    if (window.L) {
      if (!mapInstance.current && mapRef.current) {
        const L = window.L;
        const markerStore = markersRef.current;

        const map = L.map(mapRef.current, {
          center: isFoodMap ? initialSpot.coords : [41.05, 64.4],
          zoom: isFoodMap ? 12 : 6,
          minZoom: 5,
          maxZoom: 18,
        });

        mapInstance.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        displayedSpots.forEach((spot, index) => {
          const isFoodSpot = spot.type === 'food';
          const customIcon = L.divIcon({
            className: "",
            html: isFoodSpot
              ? `<div class="custom-food-marker">${FOOD_MARKER_ICON}</div>`
              : `<div class="custom-pin pin-${spot.type}"><span>${index + 1}</span></div>`,
            iconSize: isFoodSpot ? [42, 42] : [40, 40],
            iconAnchor: isFoodSpot ? [21, 21] : [20, 40],
            popupAnchor: [0, -34],
          });

          const marker = L.marker(spot.coords, {
            icon: customIcon,
            title: spot.name,
          }).addTo(map);

          marker.on("click", () => {
            setSelectedSpot(spot);
            map.flyTo(spot.coords, spot.zoom || (spot.type === 'food' ? 15 : 8), { duration: 0.9 });
          });

          if (!isFoodSpot) {
            marker.bindPopup(`
              <div class="map-popup-card">
                <strong>${escapeHtml(spot.name)}</strong>
                <span>자세히 보기 &rarr;</span>
              </div>
            `);
          }
          markerStore.set(spot.id, marker);
        });

        if (!isFoodMap) {
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

        return () => {
          markerStore.clear();
          map.remove();
          if (mapInstance.current === map) {
            mapInstance.current = null;
          }
        };
      }
    }

    return undefined;
  }, [displayedSpots, initialSpot, isFoodMap]);

  useEffect(() => {
    const requestedSpot = isFoodMap
      ? displayedSpots[0]
      : focusSpotId
        ? spots.find((spot) => spot.id === focusSpotId)
        : null;

    if (!requestedSpot || !mapLibraryReady) {
      return;
    }

    const focusTimer = window.setTimeout(() => {
      setSelectedSpot(requestedSpot);
      moveMapToSpot(requestedSpot);
    }, 0);

    return () => {
      window.clearTimeout(focusTimer);
    };
  }, [displayedSpots, focusSpotId, isFoodMap, mapLibraryReady, moveMapToSpot]);

  const handleSelectSpot = (spot) => {
    focusSpotOnMap(spot);
  };

  const filteredSpots =
    isFoodMap
      ? displayedSpots
      : activeFilter === 'all'
      ? spots
      : spots.filter((spot) => spot.type === activeFilter);
  const selectedImage = isFoodMap ? getRestaurantImage(selectedSpot) : null;
  const selectedAddress = isFoodMap ? getRestaurantAddress(selectedSpot) : '';
  const selectedHours = isFoodMap ? getRestaurantHours(selectedSpot) : '';
  const selectedMenuGuide = isFoodMap ? getMenuGuide(selectedSpot) : null;
  const selectedMenuPhotos = isFoodMap ? getRestaurantMenuPhotos(selectedSpot) : [];

  return (
    <main className="page-shell">
      <section
        className="map-stage"
        aria-label={isFoodMap ? `${foodMapTitle} 추천 맛집 지도` : '우즈베키스탄 인터랙티브 지도'}
      >
        <div className="map-title">
          <p>{isFoodMap ? 'Food Map' : 'Silk Road Atlas'}</p>
          <h1>{isFoodMap ? `${foodMapTitle} 맛집 지도` : 'UZBEKISTAN MAP'}</h1>
        </div>

        <div ref={mapRef} className="leaflet-map"></div>

        {!mapLibraryReady && (
          <div className="map-fallback">
            지도 라이브러리(Leaflet)를 불러오는 중입니다... index.html을 확인해 주세요.
          </div>
        )}

        <div className="map-actions">
          {isFoodMap ? (
            displayedSpots.map((spot, index) => (
              <button key={spot.id} type="button" onClick={() => handleSelectSpot(spot)}>
                {index + 1}. {spot.label}
              </button>
            ))
          ) : (
            <>
              <button type="button" onClick={() => handleSelectSpot(spots[0])}>
                🏢 Tashkent
              </button>
              <button type="button" onClick={() => handleSelectSpot(spots[1])}>
                🕌 Samarkand
              </button>
              <button type="button" onClick={() => handleSelectSpot(spots[3])}>
                📍 Khiva
              </button>
            </>
          )}
        </div>
      </section>

      <aside className={`info-panel${isFoodMap ? ' food-info-panel' : ''}`}>
        <div className="intro-block">
          <span className="eyebrow">{isFoodMap ? 'Restaurant Map' : 'Route Planner'}</span>
          <h2>
            {isFoodMap
              ? `${foodMapTitle} 추천 식당을 선택하세요.`
              : '실크로드의 도시를 한 화면에서 탐색하세요.'}
          </h2>
          <p>
            {isFoodMap
              ? '음식 카드에서 넘어온 추천 장소를 지도 위에 표시했습니다. 원하는 식당을 클릭하면 위치와 방문 팁을 바로 볼 수 있습니다.'
              : '타슈켄트에서 사마르칸트, 부하라, 히바까지 이어지는 대표 여행지를 지도 위에서 바로 확인할 수 있습니다.'}
          </p>
        </div>

        {!isFoodMap && (
          <div className="stats-grid">
          <article>
            <strong>{isFoodMap ? displayedSpots.length : 7}</strong>
            <span>{isFoodMap ? '추천 맛집' : '대표 스팟'}</span>
          </article>
          <article>
            <strong>{isFoodMap ? foodMapTitle : 3}</strong>
            <span>{isFoodMap ? '선택 음식' : '추천 루트'}</span>
          </article>
          <article>
            <strong>{isFoodMap ? '지도' : '4-6월'}</strong>
            <span>{isFoodMap ? '연동 완료' : '추천 시기'}</span>
          </article>
        </div>
        )}

        {!isFoodMap && (
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
        )}

        <div className={`spot-list${isFoodMap ? ' restaurant-spot-list' : ''}`}>
          {filteredSpots.map((spot, idx) => {
            const spotImage = isFoodMap ? getRestaurantImage(spot) : null;

            return (
            <button
              key={spot.id}
              className={`spot-button${spotImage ? ' has-thumb' : ''} ${spot.id === selectedSpot.id ? 'active' : ''}`}
              onClick={() => handleSelectSpot(spot)}
            >
              {spotImage && (
                <img
                  src={spotImage.src}
                  alt={`${spot.label} 사진`}
                  className="spot-thumb"
                  loading="lazy"
                />
              )}
              <span className="spot-index">{idx + 1}</span>
              <span>
                <strong>{spot.name}</strong>
                <span>{spot.label} · {spot.point}</span>
              </span>
              <span className="spot-type">{spot.type}</span>
            </button>
            );
          })}
        </div>

        <section className={`selected-card${isFoodMap ? ' restaurant-detail-card' : ''}`}>
          {isFoodMap ? (
            <>
              <span className="selected-tag">RESTAURANT GUIDE</span>
              <h3>{selectedSpot.foodTitle} / {selectedSpot.name}</h3>
              <p className="restaurant-summary">{selectedSpot.point} 맛집</p>

              {selectedImage && (
                <img
                  src={selectedImage.src}
                  alt={`${selectedSpot.label} 사진`}
                  className="selected-restaurant-image"
                  loading="lazy"
                />
              )}

              <dl className="restaurant-detail-list">
                <div>
                  <dt>주소</dt>
                  <dd>{selectedAddress}</dd>
                </div>
                <div>
                  <dt>영업시간</dt>
                  <dd>{selectedHours}</dd>
                </div>
                <div>
                  <dt>대표 메뉴</dt>
                  <dd>{selectedMenuGuide.items.map((item) => item.name).join(', ')}</dd>
                </div>
              </dl>

              <div className="menu-image-section">
                <h4>메뉴 이미지</h4>
                {selectedMenuPhotos.length > 0 && (
                  <div className="menu-board-grid">
                    {selectedMenuPhotos.map((menuPhoto) => (
                      <figure key={`${selectedSpot.id}-${menuPhoto.src}`} className="menu-board-card">
                        <img
                          src={menuPhoto.src}
                          alt={`${selectedSpot.name} ${menuPhoto.caption}`}
                          loading="lazy"
                        />
                        <figcaption>{menuPhoto.caption}</figcaption>
                      </figure>
                    ))}
                  </div>
                )}
                <div className="menu-price-list">
                  {selectedMenuGuide.items.map((menuItem) => (
                    <figure key={`${selectedSpot.id}-${menuItem.name}`}>
                      <figcaption>
                        <span>{menuItem.name}</span>
                        <strong>{menuItem.price}</strong>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
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
                <div>
                  <dt>AI 여행 팁</dt>
                  <dd>{selectedSpot.chat}</dd>
                </div>
              </dl>
            </>
          )}
        </section>
      </aside>
    </main>
  );
}

export default MapPage;
