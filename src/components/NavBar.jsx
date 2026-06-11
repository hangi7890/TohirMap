import React from 'react';
import './NavBar.css';

function NavBar({ activeTab, setActiveTab }) {
  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="logo-emblem">🇺🇿</span>
          <span className="logo-text">Uzbek Guide</span>
        </div>

        <nav className="navbar-links">
          <button
            className={`nav-tab-btn ${activeTab === 'travel' ? 'active' : ''}`}
            onClick={() => setActiveTab('travel')}
          >
            ✈️ 여행 명소
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'map' ? 'active' : ''}`}
            onClick={() => setActiveTab('map')}
          >
            🗺️ 인터랙티브 지도
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'food' ? 'active' : ''}`}
            onClick={() => setActiveTab('food')}
          >
            🍲 전통 음식
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'culture' ? 'active' : ''}`}
            onClick={() => setActiveTab('culture')}
          >
            🎭 전통 문화
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'interview' ? 'active' : ''}`}
            onClick={() => setActiveTab('interview')}
          >
            💬 현지인 인터뷰
          </button>
        </nav>
      </div>
    </header>
  );
}

export default NavBar;