import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import './MapPage.css';
import { cleanupChatling, loadChatling } from '../utils/chatling';
import { mapData } from '../mapdata';
import {
  foodMapData,
  restaurantImageByName,
  restaurantMenuPhotosByName,
  restaurantAddressByName,
  restaurantHoursByName,
  menuGuideByRestaurantName,
  menuGuideByFoodId,
} from '../foodmapdata';

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const getRestaurantImage = (spot) => restaurantImageByName[spot.name] || null;

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

const getRestaurantAddress = (spot) =>
  restaurantAddressByName[spot.name] || `${spot.city}, ${spot.route.replace(' · ', ', ')}`;

const getRestaurantHours = (spot) => restaurantHoursByName[spot.name] || "10:00 - 22:00";

const getMenuGuide = (spot) =>
  menuGuideByRestaurantName[spot.name] || menuGuideByFoodId[spot.foodId] || menuGuideByFoodId[1];

const getRestaurantMenuPhotos = (spot) => restaurantMenuPhotosByName[spot.name] || [];

const getUniqueRestaurantSpots = () => {
  const restaurantMap = new Map();

  foodMapData.forEach((spot) => {
    const savedSpot = restaurantMap.get(spot.name);

    if (!savedSpot) {
      restaurantMap.set(spot.name, {
        ...spot,
        id: `restaurant-${spot.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        menuNames: [spot.foodTitle],
      });
      return;
    }

    if (!savedSpot.menuNames.includes(spot.foodTitle)) {
      savedSpot.menuNames.push(spot.foodTitle);
    }
  });

  return Array.from(restaurantMap.values()).map(({ menuNames, ...spot }) => ({
    ...spot,
    foodTitle: menuNames.slice(0, 3).join(', '),
  }));
};

function MapPage({ focusSpotId = null, focusFoodId = null }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef(new Map());
  const [mapMode, setMapMode] = useState(() => (focusFoodId ? 'food' : 'main'));
  const focusedFoodSpots = useMemo(() => {
    if (!focusFoodId) {
      return [];
    }

    return foodMapData.filter((spot) => spot.foodId === focusFoodId);
  }, [focusFoodId]);
  const allRestaurantSpots = useMemo(() => getUniqueRestaurantSpots(), []);
  const restaurantSpots = focusFoodId && focusedFoodSpots.length > 0 ? focusedFoodSpots : allRestaurantSpots;
  const isFoodMap = mapMode === 'food';
  const displayedSpots = isFoodMap ? restaurantSpots : mapData;
  const foodMapTitle = isFoodMap
    ? focusFoodId && restaurantSpots[0]
      ? restaurantSpots[0].foodTitle
      : '전체 음식'
    : '';
  const initialSpot =
    (isFoodMap ? displayedSpots[0] : mapData.find((spot) => spot.id === focusSpotId)) || mapData[1];

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
            (id) => mapData.find((s) => s.id === id).coords
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
        ? mapData.find((spot) => spot.id === focusSpotId)
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

  const handleMapModeChange = (nextMode) => {
    if (nextMode === mapMode) {
      return;
    }

    const nextSpot =
      nextMode === 'food'
        ? restaurantSpots[0]
        : mapData.find((spot) => spot.id === focusSpotId) || mapData[1];

    setMapMode(nextMode);
    setSelectedSpot(nextSpot);

    if (nextMode === 'main') {
      setActiveFilter('all');
    }
  };

  const filteredSpots =
    isFoodMap
      ? displayedSpots
      : activeFilter === 'all'
      ? mapData
      : mapData.filter((spot) => spot.type === activeFilter);
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

        <div className="map-mode-toggle" aria-label="지도 종류 선택">
          <button
            type="button"
            className={mapMode === 'main' ? 'active' : ''}
            onClick={() => handleMapModeChange('main')}
          >
            메인지도
          </button>
          <button
            type="button"
            className={mapMode === 'food' ? 'active' : ''}
            onClick={() => handleMapModeChange('food')}
          >
            음식지도
          </button>
        </div>

        <div ref={mapRef} className="leaflet-map"></div>

        {!mapLibraryReady && (
          <div className="map-fallback">
            지도 라이브러리(Leaflet)를 불러오는 중입니다... index.html을 확인해 주세요.
          </div>
        )}

        <div className={`map-actions${isFoodMap ? ' map-actions-food' : ''}`}>
          {isFoodMap ? (
            displayedSpots.map((spot, index) => (
              <button key={spot.id} type="button" onClick={() => handleSelectSpot(spot)}>
                {index + 1}. {spot.label}
              </button>
            ))
          ) : (
            <>
              <button type="button" onClick={() => handleSelectSpot(mapData[0])}>
                🏢 Tashkent
              </button>
              <button type="button" onClick={() => handleSelectSpot(mapData[1])}>
                🕌 Samarkand
              </button>
              <button type="button" onClick={() => handleSelectSpot(mapData[3])}>
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
              ? focusFoodId
                ? `${foodMapTitle} 추천 식당을 선택하세요.`
                : '우즈베키스탄 음식지도를 탐색하세요.'
              : '실크로드의 도시를 한 화면에서 탐색하세요.'}
          </h2>
          <p>
            {isFoodMap
              ? focusFoodId
                ? '음식 카드에서 넘어온 추천 장소를 지도 위에 표시했습니다. 원하는 식당을 클릭하면 위치와 방문 팁을 바로 볼 수 있습니다.'
                : '대표 음식과 연결된 유명 식당을 한 번에 모아 표시했습니다. 식당을 고르면 상세 정보와 메뉴를 오른쪽 카드에서 볼 수 있습니다.'
              : '타슈켄트에서 사마르칸트, 부하라, 히바까지 이어지는 대표 여행지를 지도 위에서 바로 확인할 수 있습니다.'}
          </p>
        </div>

        {!isFoodMap && (
          <div className="stats-grid">
            <article>
              <strong>{mapData.length}</strong>
              <span>대표 스팟</span>
            </article>
            <article>
              <strong>3</strong>
              <span>추천 루트</span>
            </article>
            <article>
              <strong>4-6월</strong>
              <span>추천 시기</span>
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

