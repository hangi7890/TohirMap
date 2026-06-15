import { useEffect, useMemo, useState } from 'react';
import { cultureData } from '../data';
import ScrollTopButton from '../components/ScrollTopButton';
import './Culture.css';

const STAMP_STORAGE_KEY = 'tohirmap.cultureStampIds';

const missionMetaById = {
  navruz: {
    stamp: 'NAVRUZ',
    mission: '수말락 이야기를 읽고 봄맞이 축제 의미 기록하기',
    place: '축제 광장',
    reward: '봄 축제 스탬프',
    time: '15분',
  },
  clothes: {
    stamp: 'ATLAS',
    mission: '아틀라스 무늬와 전통 모자 도피의 특징 찾기',
    place: '전통 의상 공방',
    reward: '의상 공방 스탬프',
    time: '10분',
  },
  music: {
    stamp: 'MUSIC',
    mission: '두타르, 도이라, 탄부르 중 하나를 골라 소리 특징 정리하기',
    place: '전통 음악실',
    reward: '민속 음악 스탬프',
    time: '12분',
  },
  dance: {
    stamp: 'DANCE',
    mission: '손동작과 어깨 동작을 보고 춤의 분위기 설명하기',
    place: '무용 체험실',
    reward: '전통 춤 스탬프',
    time: '10분',
  },
  wedding: {
    stamp: 'WEDDING',
    mission: '결혼식에서 가족과 손님이 맡는 역할 살펴보기',
    place: '전통 예식장',
    reward: '결혼 문화 스탬프',
    time: '15분',
  },
  hospitality: {
    stamp: 'GUEST',
    mission: '차와 빵을 대접하는 환대 문화를 한국 문화와 비교하기',
    place: '차이하나',
    reward: '환대 문화 스탬프',
    time: '8분',
  },
  food: {
    stamp: 'TABLE',
    mission: '플로브, 논, 차가 식탁에서 어떤 역할을 하는지 연결하기',
    place: '전통 식탁',
    reward: '음식 문화 스탬프',
    time: '12분',
  },
  history: {
    stamp: 'SILK',
    mission: '사마르칸트, 부하라, 히바 중 한 도시의 실크로드 흔적 찾기',
    place: '역사 유산관',
    reward: '실크로드 스탬프',
    time: '15분',
  },
};

const cleanCultureTitle = (title) => title.replace(/^[^0-9]*\d+\.\s*/, '');

const getInitialStampedIds = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const savedIds = JSON.parse(window.localStorage.getItem(STAMP_STORAGE_KEY));
    return Array.isArray(savedIds) ? savedIds : [];
  } catch {
    return [];
  }
};

function Culture() {
  const missions = useMemo(
    () =>
      cultureData.map((item) => ({
        ...item,
        title: cleanCultureTitle(item.title),
        ...missionMetaById[item.id],
      })),
    []
  );
  const [stampedIds, setStampedIds] = useState(getInitialStampedIds);
  const [selectedMissionId, setSelectedMissionId] = useState(missions[0]?.id);

  const validMissionIdSet = useMemo(() => new Set(missions.map((mission) => mission.id)), [missions]);
  const validStampedIds = useMemo(
    () => stampedIds.filter((id) => validMissionIdSet.has(id)),
    [stampedIds, validMissionIdSet]
  );
  const stampedSet = useMemo(() => new Set(validStampedIds), [validStampedIds]);
  const selectedMission = missions.find((mission) => mission.id === selectedMissionId) || missions[0];
  const collectedMissions = missions.filter((mission) => stampedSet.has(mission.id));
  const completedCount = validStampedIds.length;
  const completionRate = Math.round((completedCount / missions.length) * 100);
  const isSelectedStamped = stampedSet.has(selectedMission.id);

  useEffect(() => {
    window.localStorage.setItem(STAMP_STORAGE_KEY, JSON.stringify(validStampedIds));
  }, [validStampedIds]);

  const toggleStamp = (missionId) => {
    setStampedIds((currentIds) =>
      currentIds.includes(missionId)
        ? currentIds.filter((id) => id !== missionId)
        : [...currentIds, missionId]
    );
  };

  const resetStampTour = () => {
    setStampedIds([]);
  };

  return (
    <main className="culture-tour-page">
      <section className="culture-tour-hero">
        <div className="culture-hero-copy">
          <span className="culture-eyebrow">TOHIR CULTURE PASSPORT</span>
          <h1>문화 체험 스탬프 투어</h1>
          <p>
            우즈베키스탄의 축제, 의상, 음악, 춤, 환대 문화를 미션처럼 체험하고
            나만의 문화 패스포트에 스탬프를 모아보세요.
          </p>
        </div>

        <div className="culture-passport">
          <div className="passport-header">
            <span>나의 문화 패스포트</span>
            <strong>{completionRate}%</strong>
          </div>

          <div className="passport-status-grid">
            <article>
              <strong>{missions.length}</strong>
              <span>전체 스탬프</span>
            </article>
            <article>
              <strong>{completedCount}</strong>
              <span>모은 스탬프</span>
            </article>
            <article>
              <strong>{completionRate}%</strong>
              <span>진행률</span>
            </article>
          </div>

          <div className="passport-progress" aria-label="문화 스탬프 진행률">
            <span style={{ width: `${completionRate}%` }} />
          </div>

          <div className="passport-grid">
            {missions.map((mission, index) => (
              <button
                type="button"
                key={mission.id}
                className={`passport-stamp${stampedSet.has(mission.id) ? ' stamped' : ''}`}
                onClick={() => setSelectedMissionId(mission.id)}
                aria-label={`${mission.title} 미션 보기`}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{mission.stamp}</strong>
              </button>
            ))}
          </div>

          <div className="passport-collected-list">
            <h2>모은 스탬프 목록</h2>
            {collectedMissions.length > 0 ? (
              <ul>
                {collectedMissions.map((mission) => (
                  <li key={mission.id}>
                    <span>{mission.stamp}</span>
                    <strong>{mission.title}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p>아직 모은 스탬프가 없습니다.</p>
            )}
          </div>
        </div>
      </section>

      <section className="culture-tour-layout">
        <aside className="mission-detail-panel">
          <span className="culture-eyebrow">CURRENT MISSION</span>
          <h2>{selectedMission.title}</h2>
          <img src={selectedMission.img} alt={selectedMission.title} />
          <dl>
            <div>
              <dt>장소</dt>
              <dd>{selectedMission.place}</dd>
            </div>
            <div>
              <dt>소요</dt>
              <dd>{selectedMission.time}</dd>
            </div>
            <div>
              <dt>미션</dt>
              <dd>{selectedMission.mission}</dd>
            </div>
            <div>
              <dt>보상</dt>
              <dd>{selectedMission.reward}</dd>
            </div>
          </dl>
          <button
            type="button"
            className={`stamp-action-button${isSelectedStamped ? ' stamped' : ''}`}
            onClick={() => toggleStamp(selectedMission.id)}
          >
            {isSelectedStamped ? '스탬프 취소' : '스탬프 받기'}
          </button>
          {completedCount > 0 && (
            <button type="button" className="stamp-reset-button" onClick={resetStampTour}>
              투어 다시 시작
            </button>
          )}
        </aside>

        <div className="mission-card-grid">
          {missions.map((mission, index) => {
            const isStamped = stampedSet.has(mission.id);
            const isSelected = selectedMission.id === mission.id;

            return (
              <article
                key={mission.id}
                className={`mission-card${isStamped ? ' stamped' : ''}${isSelected ? ' selected' : ''}`}
              >
                <button type="button" className="mission-card-main" onClick={() => setSelectedMissionId(mission.id)}>
                  <div className="mission-image-wrap">
                    <img src={mission.img} alt={mission.title} loading="lazy" />
                    <span className="mission-number">{String(index + 1).padStart(2, '0')}</span>
                    {isStamped && <span className="mission-stamp-mark">STAMPED</span>}
                  </div>
                  <div className="mission-card-body">
                    <span>{mission.place}</span>
                    <h3>{mission.title}</h3>
                    <p>{mission.mission}</p>
                  </div>
                </button>
                <button
                  type="button"
                  className="mission-stamp-button"
                  onClick={() => toggleStamp(mission.id)}
                  aria-label={`${mission.title} ${isStamped ? '스탬프 취소' : '스탬프 받기'}`}
                >
                  {isStamped ? '완료' : '받기'}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <ScrollTopButton />
    </main>
  );
}

export default Culture;
