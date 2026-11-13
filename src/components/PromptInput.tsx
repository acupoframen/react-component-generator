import { useRef, useState } from 'react';
import { MAX_PROMPT_LENGTH, validatePromptLength } from '../utils/validatePromptLength';

interface PromptInputProps { onGenerate: (prompt: string) => void; isLoading: boolean; }
const EXAMPLES = [
  { icon: '▥', title: '대시보드 카드', prompt: 'SaaS 관리자용 KPI 카드 3개. 매출, 활성 사용자, 전환율을 비교 가능한 형태로 표시' },
  { icon: '☷', title: '알림 설정', prompt: '설정 페이지의 알림 토글 패널. 이메일, 슬랙, 주간 리포트 옵션 포함' },
  { icon: '⌕', title: '검색 필터', prompt: '검색 필터 바. 상태, 담당자, 날짜 범위를 선택하고 결과 수를 보여주는 UI' },
  { icon: '☑', title: '체크리스트', prompt: '온보딩 체크리스트. 5단계 진행률과 완료/대기 상태를 보여주는 카드' },
  { icon: '▤', title: '요금제 비교', prompt: '요금제 비교 카드 3개. 추천 플랜을 강조하고 CTA 버튼 포함' },
  { icon: '▣', title: '고객 프로필', prompt: '테이블 행 상세보기 패널. 선택한 고객의 기본 정보와 최근 활동 표시' },
];
export function PromptInput({ onGenerate, isLoading }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { length, isValid } = validatePromptLength(prompt);
  const canSubmit = !!prompt.trim() && isValid && !isLoading;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) onGenerate(prompt.trim());
  };
  return (
    <div className="prompt-section">
      <div className="prompt-heading"><h1>무엇을 만들까요?</h1><p>머릿속 UI를 말로 그려주세요.</p></div>
      <form onSubmit={handleSubmit} className="prompt-form">
        <div className="prompt-label-row">
          <label htmlFor="prompt" className="input-label">컴포넌트 설명</label>
          <span id="prompt-count" className={`prompt-count ${!isValid ? 'prompt-count--invalid' : ''}`}>{length} / {MAX_PROMPT_LENGTH}자</span>
        </div>
        <textarea id="prompt" ref={inputRef} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={'예: 레트로 음악 플레이어를 만들어줘.\n재생 버튼과 볼륨 조절이 있으면 좋겠어.'} className="prompt-textarea" rows={6}
          aria-invalid={!isValid} aria-describedby={`prompt-hint prompt-count${!isValid ? ' prompt-error' : ''}`}
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(e); }} />
        {!isValid && <p id="prompt-error" className="prompt-error" role="alert">프롬프트는 {MAX_PROMPT_LENGTH}자 이하로 입력해주세요.</p>}
        <div className="input-hint"><span id="prompt-hint">구체적으로 쓸수록 좋아요.</span><span><kbd>Ctrl</kbd> / <kbd>⌘</kbd> + <kbd>Enter</kbd></span></div>
        <button type="submit" className="btn-generate" disabled={!canSubmit}><span aria-hidden="true">✦</span>{isLoading ? '생성 중...' : '컴포넌트 생성'}</button>
      </form>
      <div className="prompt-examples"><h2>이런 건 어때요?</h2><div className="example-grid">{EXAMPLES.map((example) => <button key={example.title} className={`example-chip ${prompt === example.prompt ? 'example-chip--selected' : ''}`} type="button" aria-pressed={prompt === example.prompt} onClick={() => { setPrompt(example.prompt); inputRef.current?.focus(); }}><span aria-hidden="true">{example.icon}</span>{example.title}</button>)}</div></div>
    </div>
  );
}
