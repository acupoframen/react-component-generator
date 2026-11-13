import { useState, useEffect } from 'react';
import { PromptInput } from './components/PromptInput';
import { ComponentCard } from './components/ComponentCard';
import { useComponentGenerator } from './hooks/useComponentGenerator';
import type { Provider } from './types';
import './App.css';

const PROVIDER_CONFIG = {
  anthropic: { label: 'Anthropic', placeholder: 'sk-ant-...' },
  google: { label: 'Google', placeholder: 'AIza...' },
} as const;

function App() {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [provider, setProvider] = useState<Provider>('google');
  const [keyError, setKeyError] = useState<string | null>(null);
  const [envKeys, setEnvKeys] = useState<Record<Provider, boolean>>({ anthropic: false, google: false });
  const { components, isLoading, error, generate, removeComponent, clearAll } = useComponentGenerator();

  useEffect(() => {
    fetch('/api/config').then((res) => res.json()).then((data) => setEnvKeys(data.envKeys)).catch(() => {});
  }, []);

  const hasEnvKey = envKeys[provider];
  const hasKey = !!apiKey.trim() || hasEnvKey;
  const handleGenerate = (prompt: string) => {
    if (!hasKey) {
      setKeyError(`${PROVIDER_CONFIG[provider].label} API 키를 입력해주세요.`);
      document.getElementById('api-key')?.focus();
      return;
    }
    setKeyError(null);
    void generate(prompt, apiKey.trim() || undefined, provider);
  };

  return (
    <div className="app">
      <header className="desktop-header">
        <a className="brand" href="#main"><span className="brand-icon" aria-hidden="true">{'</>'}</span> Component Studio<span className="edition">레트로 에디션</span></a>
        <span className="desktop-caption">아이디어를 실행 가능한 UI로.</span>
      </header>
      <main id="main" className="studio-window">
        <div className="window-titlebar"><span><span aria-hidden="true">▧</span> React 컴포넌트 생성기</span><span className="window-grip" aria-hidden="true" /></div>
        <div className="window-toolbar"><span>새로운 아이디어를 기다리는 작업실</span><span className="session-badge"><span className={`status-light ${isLoading ? 'status-light--busy' : ''}`} />{isLoading ? '작업 중' : '준비됨'}</span></div>
        <div className="workspace">
          <aside className="composer-sidebar" aria-label="컴포넌트 생성 설정">
            <section className="composer-panel" aria-label="컴포넌트 생성"><PromptInput onGenerate={handleGenerate} isLoading={isLoading} /></section>
            <section className="settings-panel" aria-labelledby="settings-heading">
              <h2 id="settings-heading">AI 연결 설정</h2>
              <div className="provider-select">
                <label htmlFor="provider">AI 제공자</label>
                <select id="provider" value={provider} onChange={(e) => { setProvider(e.target.value as Provider); setApiKey(''); setKeyError(null); }}>
                  {Object.entries(PROVIDER_CONFIG).map(([key, { label }]) => <option key={key} value={key}>{label}</option>)}
                </select>
              </div>
              <div className="api-key-input">
                <label htmlFor="api-key">API 키</label>
                <div className="api-key-field">
                  <input id="api-key" type={showKey ? 'text' : 'password'} value={apiKey} onChange={(e) => { setApiKey(e.target.value); setKeyError(null); }} placeholder={hasEnvKey ? '서버에 설정된 키 사용 중' : PROVIDER_CONFIG[provider].placeholder} aria-invalid={!!keyError} aria-describedby="key-status" autoComplete="off" spellCheck={false} />
                  <button className="btn-toggle-key" onClick={() => setShowKey(!showKey)} type="button" aria-pressed={showKey}>{showKey ? '숨기기' : '보기'}</button>
                </div>
                <p id="key-status" className={`key-status ${hasKey ? 'key-status--ready' : ''}`}>{hasEnvKey ? '서버의 API 키가 연결되어 있습니다.' : apiKey.trim() ? '입력한 키로 생성합니다.' : 'API 키를 입력하면 생성을 시작할 수 있어요.'}</p>
                {keyError && <p className="key-error" role="alert">{keyError}</p>}
              </div>
            </section>
          </aside>
          <section className="results-section" aria-labelledby="results-heading" aria-busy={isLoading}>
            <div className="results-header"><div className="results-heading"><h2 id="results-heading">작업대</h2><span className="result-count">{components.length}개의 컴포넌트</span></div>{components.length > 0 && <button className="btn-clear" onClick={clearAll}>전체 삭제</button>}</div>
            {error && <div className="error-banner" role="alert"><strong>생성하지 못했어요.</strong><p>{error}</p></div>}
            {components.length === 0 && !isLoading && (
              <div className="empty-state">
                <div className="empty-illustration" aria-hidden="true"><div className="mini-window"><div className="mini-title">hello-component.jsx<span>▧</span></div><div className="mini-content"><span className="code-brackets">{'{ }'}</span><div className="mini-code"><i /><i /><i /></div></div><div className="mini-status"><span />Ready to create</div></div><span className="pixel-cursor">↖</span></div>
                <div className="empty-copy"><span className="empty-note">빈 화면, 무한한 가능성.</span><h2>다음 아이디어를<br />여기서 만들어보세요.</h2><p>만들고 싶은 UI를 설명해주세요.<br />미리보기와 React 코드가 이곳에 나타납니다.</p><a href="#prompt" className="start-link">첫 컴포넌트 만들기 <span aria-hidden="true">↗</span></a></div>
                <div className="empty-tip"><span aria-hidden="true">✳</span><p>어디서 시작할지 모르겠다면?<br /><strong>왼쪽 예시 프롬프트를 골라보세요.</strong></p></div>
              </div>
            )}
            {isLoading && <div className="loading-card" role="status"><div className="loading-track"><span /></div><h3>아이디어를 코드로 옮기는 중…</h3><p>완성되면 이곳에서 바로 확인할 수 있어요.</p></div>}
            <div className="results-grid">{components.map((component) => <ComponentCard key={component.id} component={component} onRemove={removeComponent} onRegenerate={handleGenerate} isLoading={isLoading} />)}</div>
          </section>
        </div>
        <footer className="window-statusbar"><span>{isLoading ? '컴포넌트 생성 중…' : '설명하고, 만들고, 바로 확인하세요.'}</span><span>{PROVIDER_CONFIG[provider].label}<span className="status-separator" />React + JSX</span><span className="resize-grip" aria-hidden="true" /></footer>
      </main>
      <footer className="desktop-footer"><span>작은 컴포넌트에서 시작하는 큰 아이디어.</span><span>Component Studio</span></footer>
    </div>
  );
}
export default App;
