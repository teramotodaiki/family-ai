import type React from 'react';

type Locale = 'ja' | 'en';

export type I18nProps = {
  ja?: string;
  en?: string;
  children?: ((text: string) => React.ReactNode) | undefined;
  locale?: Locale;
};

function selectText(ja?: string, en?: string, locale: Locale = 'ja'): string {
  return locale === 'ja' ? (ja ?? en ?? '') : (en ?? ja ?? '');
}

export default function I18n(props: I18nProps): React.ReactElement | null {
  const { ja, en, children, locale = 'ja' } = props;
  const text = selectText(ja, en, locale);
  if (typeof children === 'function') {
    return <>{children(text)}</>;
  }
  return <>{text}</>;
}

export const I18nUtil = {
  selectText,
};
