import { useState } from 'react';
import { interviewData } from '../data';
import { getPublicAssetPath } from '../utils/assets';
import './Interview.css';

function Interview() {
  const [activeId, setActiveId] = useState(1);
  const currentInterview = interviewData.find(item => item.id === activeId) || interviewData[0];

  return (
    <div className="interview-page-container">
      <header className="interview-title-block">
        <span className="interview-eyebrow">Local Voices & Culture</span>
        <h2>현지인 인터뷰 모음</h2>
        <p>25개의 생생한 문답을 통해 우즈베키스탄의 진짜 매력을 확인해 보세요.</p>
      </header>

      <div className="interview-layout-grid">
        <nav className="interview-sidebar">
          {interviewData.map((item) => (
            <button
              key={item.id}
              className={`interview-selector-btn ${item.id === activeId ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveId(item.id)}
            >
              <span className="interview-num">{"#" + item.id}</span>
              <span className="interview-q-text">{item.q}</span>
            </button>
          ))}
        </nav>

        <main className="interview-main-viewer">
          <div className="viewer-card-header">
            <h3>{"INTERVIEW CARD CONCEPT #" + currentInterview.id}</h3>
          </div>
          
          <div className="chat-flow-zone">
            <div className="chat-bubble-row question-row">
              <div className="avatar-icon">🧐</div>
              <div className="chat-bubble bubble-question">
                <span className="bubble-tag">Question</span>
                <p>{currentInterview.q}</p>
              </div>
            </div>

            <div className="chat-bubble-row answer-row">
              <div className="avatar-icon avatar-photo">
                <img src={getPublicAssetPath('/images/local-interview.jpg')} alt="현지인 인터뷰 답변자" />
              </div>
              <div className="chat-bubble bubble-answer">
                <span className="bubble-tag">Answer</span>
                <p>{currentInterview.a}</p>
              </div>
            </div>
          </div>

          <div className="viewer-footer-tip">
            💡 ① 왼쪽 질문 리스트를 클릭하면 다른 인터뷰 대화 내용을 실시간으로 확인하실 수 있습니다.
          </div>
        </main>
      </div>
    </div>
  );
}

export default Interview;
