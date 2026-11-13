import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PromptInput } from './PromptInput';

describe('PromptInput', () => {
  it('프롬프트가 비어 있으면 생성 버튼이 비활성이다', () => {
    render(<PromptInput onGenerate={vi.fn()} isLoading={false} />);
    expect(screen.getByRole('button', { name: '컴포넌트 생성' })).toBeDisabled();
  });

  it('입력하면 버튼이 활성화되고 클릭 시 입력값으로 onGenerate가 호출된다', async () => {
    const onGenerate = vi.fn();
    const user = userEvent.setup();
    render(<PromptInput onGenerate={onGenerate} isLoading={false} />);

    await user.type(screen.getByRole('textbox'), '프로필 카드');
    const submit = screen.getByRole('button', { name: '컴포넌트 생성' });
    expect(submit).toBeEnabled();

    await user.click(submit);
    expect(onGenerate).toHaveBeenCalledWith('프로필 카드');
  });

  it('로딩 중에는 생성 버튼이 비활성이고 "생성 중..." 을 보여준다', () => {
    render(<PromptInput onGenerate={vi.fn()} isLoading={true} />);
    expect(screen.getByRole('button', { name: '생성 중...' })).toBeDisabled();
  });

  it('501자를 붙여 넣으면 생성 버튼을 비활성화한다', async () => {
    const user = userEvent.setup();
    render(<PromptInput onGenerate={vi.fn()} isLoading={false} />);
    await user.click(screen.getByRole('textbox'));
    await user.paste('가'.repeat(501));
    expect(screen.getByRole('button', { name: '컴포넌트 생성' })).toBeDisabled();
  });

  it('길이 초과 오류를 입력란과 연결해 안내한다', async () => {
    const user = userEvent.setup();
    render(<PromptInput onGenerate={vi.fn()} isLoading={false} />);
    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.paste('가'.repeat(501));
    expect(screen.getByRole('alert')).toHaveTextContent('프롬프트는 500자 이하로 입력해주세요.');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(/프롬프트는 500자 이하로 입력해주세요\./);
  });

  it('현재 글자 수와 제한을 표시한다', async () => {
    const user = userEvent.setup();
    render(<PromptInput onGenerate={vi.fn()} isLoading={false} />);
    await user.click(screen.getByRole('textbox'));
    await user.paste('😀가');
    expect(screen.getByText('2 / 500자')).toBeInTheDocument();
  });

  it.each(['{Control>}{Enter}{/Control}', '{Meta>}{Enter}{/Meta}'])('초과 입력은 %s 단축키로도 제출하지 않는다', async (shortcut) => {
    const onGenerate = vi.fn();
    const user = userEvent.setup();
    render(<PromptInput onGenerate={onGenerate} isLoading={false} />);
    await user.click(screen.getByRole('textbox'));
    await user.paste('가'.repeat(501));
    await user.keyboard(shortcut);
    expect(onGenerate).not.toHaveBeenCalled();
  });

  it('정확히 500자이면 제출한다', async () => {
    const onGenerate = vi.fn();
    const user = userEvent.setup();
    render(<PromptInput onGenerate={onGenerate} isLoading={false} />);
    await user.click(screen.getByRole('textbox'));
    await user.paste('가'.repeat(500));
    await user.click(screen.getByRole('button', { name: '컴포넌트 생성' }));
    expect(onGenerate).toHaveBeenCalledWith('가'.repeat(500));
  });

  it('초과 입력을 줄이면 오류가 사라지고 제출이 다시 가능하다', async () => {
    const user = userEvent.setup();
    render(<PromptInput onGenerate={vi.fn()} isLoading={false} />);
    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.paste('가'.repeat(501));
    expect(screen.getByRole('alert')).toBeInTheDocument();
    await user.keyboard('{Backspace}');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(screen.getByRole('button', { name: '컴포넌트 생성' })).toBeEnabled();
  });
});
