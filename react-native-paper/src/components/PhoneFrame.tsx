import type { ReactNode } from 'react';
import { View } from 'react-native';
import { ThemeProvider, type MD3Theme } from 'react-native-paper';
import { lightTheme } from '../theme/paperThemes';
import { ErrorBoundary } from './ErrorBoundary';

interface PhoneFrameProps {
  children: ReactNode;
  theme?: MD3Theme;
  label?: string;
  caption?: ReactNode | false;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Moldura de celular. O conteúdo é React Native Paper real, renderizado via
 * react-native-web; o tema é aplicado com o ThemeProvider do próprio Paper.
 */
export function PhoneFrame({ children, theme = lightTheme, label, caption, size = 'md', className = '' }: PhoneFrameProps) {
  return (
    <figure className={`phone phone--${size} ${className}`}>
      <div className="phone__device" style={{ background: theme.colors.background }}>
        <div className="phone__status" style={{ color: theme.colors.onBackground }} aria-hidden>
          <span>9:41</span>
          <span className="phone__notch" />
          <span className="phone__dots">
            <i />
            <i />
            <i />
          </span>
        </div>
        <div className="phone__screen">
          <ErrorBoundary label={label ?? 'a demonstração'}>
            <ThemeProvider theme={theme}>
              <View style={{ flex: 1, backgroundColor: theme.colors.background }}>{children}</View>
            </ThemeProvider>
          </ErrorBoundary>
        </div>
      </div>
      {caption !== false && (
        <figcaption className="phone__caption">
          {caption ?? <span className="live-badge">Ao vivo · react-native-paper</span>}
        </figcaption>
      )}
    </figure>
  );
}
