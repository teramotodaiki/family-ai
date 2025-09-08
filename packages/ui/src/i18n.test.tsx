import I18n, { I18nUtil } from './i18n';

describe('I18n Component', () => {
  it('should be defined', () => {
    expect(I18n).toBeDefined();
  });
});

describe('I18nUtil', () => {
  describe('selectText', () => {
    it('should return Japanese text by default', () => {
      const result = I18nUtil.selectText('こんにちは', 'Hello');
      expect(result).toBe('こんにちは');
    });

    it('should return English text when locale is en', () => {
      const result = I18nUtil.selectText('こんにちは', 'Hello', 'en');
      expect(result).toBe('Hello');
    });

    it('should fallback to English when Japanese is not provided', () => {
      const result = I18nUtil.selectText(undefined, 'Hello');
      expect(result).toBe('Hello');
    });

    it('should fallback to Japanese when English is not provided and locale is en', () => {
      const result = I18nUtil.selectText('こんにちは', undefined, 'en');
      expect(result).toBe('こんにちは');
    });

    it('should return empty string when no text is provided', () => {
      const result = I18nUtil.selectText();
      expect(result).toBe('');
    });

    it('should return empty string when both texts are undefined', () => {
      const result = I18nUtil.selectText(undefined, undefined);
      expect(result).toBe('');
    });
  });
});
