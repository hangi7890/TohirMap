import React, { useState } from 'react';
import NavBar from './components/NavBar'; 
import Travel from './pages/Travel';
import Food from './pages/Food';
import MapPage from './pages/MapPage';
import Culture from './pages/Culture'; 
import Interview from './pages/Interview';

function App() {
  const [activeTab, setActiveTab] = useState('travel');

  const renderContent = () => {
    console.log("현재 선택된 탭:", activeTab); // 콘솔창에 탭 이름 찍기
    switch (activeTab) {
      case 'travel': return <Travel />;
      case 'map': return <MapPage />;
      case 'food': return <Food />;
      case 'culture': return <Culture />; // <--- 여기!
      case 'interview': return <Interview />;
      default: return <Travel />;
    }
  };

  return (
    <div style={{ backgroundColor: '#f7fafc', minHeight: '100vh' }}>
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={{ padding: '20px 0' }}>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;