import { describe, expect, it } from 'vitest';
import { validatePromptLength } from './validatePromptLength';

describe('validatePromptLength', () => {
  it.each([0, 499, 500])('%i자 프롬프트를 허용한다', (length) => {
    expect(validatePromptLength('가'.repeat(length))).toEqual({ length, isValid: true });
  });

  it('501자 프롬프트를 거부한다', () => {
    expect(validatePromptLength('가'.repeat(501))).toEqual({ length: 501, isValid: false });
  });

  it('공백과 줄바꿈도 길이에 포함한다', () => {
    expect(validatePromptLength(` ${'a'.repeat(499)}\n`)).toEqual({ length: 501, isValid: false });
  });

  it('서로게이트 쌍 이모지는 한 글자로 센다', () => {
    expect(validatePromptLength('😀'.repeat(500))).toEqual({ length: 500, isValid: true });
  });
});
