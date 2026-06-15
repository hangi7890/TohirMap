import { useEffect, useState } from 'react';
import NavBar from './components/NavBar'; 
import Travel from './pages/Travel';
import Food from './pages/Food';
import MapPage from './pages/MapPage';
import Culture from './pages/Culture'; 
import Interview from './pages/Interview';
import { cleanupChatling } from './utils/chatling';
import './App.css';

const NAVIGATION_STORAGE_KEY = 'tohirmap.navigationState';
const DEFAULT_NAVIGATION_STATE = {
  activeTab: 'travel',
  mapFocusSpotId: null,
  mapFocusFoodId: null,
};
const VALID_TABS = new Set(['travel', 'map', 'food', 'culture', 'interview']);

const getInitialNavigationState = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_NAVIGATION_STATE;
  }

  try {
    const savedState = JSON.parse(window.localStorage.getItem(NAVIGATION_STORAGE_KEY));
    const activeTab = VALID_TABS.has(savedState?.activeTab)
      ? savedState.activeTab
      : DEFAULT_NAVIGATION_STATE.activeTab;
    const shouldResetMapFocus = activeTab === 'map';

    return {
      activeTab,
      mapFocusSpotId: shouldResetMapFocus ? null : savedState?.mapFocusSpotId || null,
      mapFocusFoodId: shouldResetMapFocus ? null : savedState?.mapFocusFoodId || null,
    };
  } catch {
    return DEFAULT_NAVIGATION_STATE;
  }
};

function App() {
  const [initialNavigationState] = useState(getInitialNavigationState);
  const [activeTab, setActiveTab] = useState(initialNavigationState.activeTab);
  const [mapFocusSpotId, setMapFocusSpotId] = useState(initialNavigationState.mapFocusSpotId);
  const [mapFocusFoodId, setMapFocusFoodId] = useState(initialNavigationState.mapFocusFoodId);

  const handleTabChange = (tab) => {
    setMapFocusSpotId(null);
    setMapFocusFoodId(null);
    setActiveTab(tab);
  };

  const handleNavigateMap = (target = {}) => {
    if (typeof target === 'string') {
      setMapFocusSpotId(target);
      setMapFocusFoodId(null);
    } else {
      setMapFocusSpotId(target.spotId || null);
      setMapFocusFoodId(target.foodId || null);
    }

    setActiveTab('map');
  };

  useEffect(() => {
    window.localStorage.setItem(
      NAVIGATION_STORAGE_KEY,
      JSON.stringify({
        activeTab,
        mapFocusSpotId,
        mapFocusFoodId,
      })
    );
  }, [activeTab, mapFocusFoodId, mapFocusSpotId]);

  useEffect(() => {
    document.body.dataset.activeTab = activeTab;

    if (activeTab === 'map') {
      return undefined;
    }

    cleanupChatling();

    const cleanupTimers = [120, 600, 1500].map((delay) =>
      window.setTimeout(() => {
        if (document.body.dataset.activeTab !== 'map') {
          cleanupChatling();
        }
      }, delay)
    );

    return () => {
      cleanupTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [activeTab]);

  const renderContent = () => {
    const mapPageKey = mapFocusFoodId
      ? `food-${mapFocusFoodId}`
      : `travel-${mapFocusSpotId || 'default'}`;

    switch (activeTab) {
      case 'travel': return <Travel onNavigateMap={handleNavigateMap} />;
      case 'map': return <MapPage key={mapPageKey} focusSpotId={mapFocusSpotId} focusFoodId={mapFocusFoodId} />;
      case 'food': return <Food onNavigateMap={handleNavigateMap} />;
      case 'culture': return <Culture />; // <--- 여기!
      case 'interview': return <Interview />;
      default: return <Travel />;
    }
  };

  return (
    <div className="app-root">
      <NavBar activeTab={activeTab} setActiveTab={handleTabChange} />
      <div className="app-layout">
        <main className="app-main">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
