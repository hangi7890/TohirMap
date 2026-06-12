import React, { useState } from 'react';
import './Interview.css'; 

const interviewData = [
  { id: 1, q: "우즈베키스탄에 대해 알고 있나요?", a: "네, 중앙아시아에 있는 나라라고 알고 있습니다." },
  { id: 2, q: "우즈베키스탄의 수도를 알고 있나요?", a: "네, 타슈켄트입니다." },
  { id: 3, q: "우즈베키스탄 음식을 먹어본 적이 있나요?", a: "네, 플로브를 먹어봤습니다." },
  { id: 4, q: "플로브 맛은 어땠나요?", a: "고기와 쌀이 잘 어울려서 맛있었습니다." },
  { id: 5, q: "우즈베키스탄에서 가장 가보고 싶은 도시는 어디인가요?", a: "사마르칸트에 가보고 싶습니다." },
  { id: 6, q: "사마르칸트에 가고 싶은 이유는 무엇인가요?", a: "역사적인 건축물이 아름답기 때문입니다." },
  { id: 7, q: "실크로드에 대해 들어본 적이 있나요?", a: "네, 우즈베키스탄이 중요한 중심지였다고 알고 있습니다." },
  { id: 8, q: "우즈베키스탄 사람들에 대한 인상은 어떤가요?", a: "친절하고 따뜻한 사람들이라고 생각합니다." },
  { id: 9, q: "우즈베키스탄 문화를 경험해 보고 싶나요?", a: "네, 전통 문화를 직접 체험해 보고 싶습니다." },
  { id: 10, q: "우즈베키스탄 전통 의상을 본 적이 있나요?", a: "사진으로 본 적이 있습니다." },
  { id: 11, q: "전통 의상은 어땠나요?", a: "색상이 화려하고 아름다웠습니다." },
  { id: 12, q: "나브루즈 축제를 알고 있나요?", a: "네, 봄을 맞이하는 전통 축제라고 들었습니다." },
  { id: 13, q: "나브루즈 축제에 참가하고 싶나요?", a: "네, 기회가 된다면 꼭 참가하고 싶습니다." },
  { id: 14, q: "우즈베키스탄 음악을 들어본 적이 있나요?", a: "네, 인터넷에서 몇 번 들어봤습니다." },
  { id: 15, q: "어떤 느낌이었나요?", a: "독특하고 흥미로웠습니다." },
  { id: 16, q: "우즈베키스탄 여행을 계획해 본 적이 있나요?", a: "아직은 없지만 언젠가 가보고 싶습니다." },
  { id: 17, q: "우즈베키스탄의 자연 풍경에 대해 알고 있나요?", a: "아름다운 산과 사막이 있다고 알고 있습니다." },
  { id: 18, q: "우즈베키스탄에서 가장 기대되는 것은 무엇인가요?", a: "음식과 역사 유적지입니다." },
  { id: 19, q: "우즈베키스탄을 한 단어로 표현한다면?", a: "역사입니다." },
  { id: 20, q: "우즈베키스탄의 가장 큰 매력은 무엇이라고 생각하나요?", a: "풍부한 역사와 문화라고 생각합니다." },
  { id: 21, q: "우즈베키스탄에 대해 더 알고 싶나요?", a: "네, 더 많은 것을 배우고 싶습니다." },
  { id: 22, q: "친구에게 우즈베키스탄 여행을 추천하겠나요?", a: "네, 꼭 추천하고 싶습니다." },
  { id: 23, q: "우즈베키스탄 음식을 다시 먹고 싶나요?", a: "네, 기회가 된다면 다시 먹고 싶습니다." },
  { id: 24, q: "우즈베키스탄 사람들과 친구가 되고 싶나요?", a: "네, 다양한 문화를 배우고 싶습니다." },
  { id: 25, q: "이 웹사이트를 보고 우즈베키스탄에 관심이 생겼나요?", a: "네, 꼭 방문해 보고 싶어졌습니다." }
];

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
              <div className="avatar-icon">🇺🇿</div>
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