import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: Error };

/**
 * Uygulama genelinde yakalanmayan React render hatalarını yakalar.
 * Beyaz ekran yerine kullanıcıya anlamlı bir hata mesajı ve
 * "Yeniden Dene" butonu gösterir.
 */
export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Production'da buraya crash reporting (Sentry vb.) eklenebilir
    console.error('[ErrorBoundary]', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <View style={s.container}>
        <Text style={s.emoji}>⚽</Text>
        <Text style={s.title}>Bir şeyler ters gitti</Text>
        <Text style={s.desc}>
          Beklenmedik bir hata oluştu. Uygulamayı yeniden başlatmayı dene.
        </Text>
        <TouchableOpacity style={s.btn} onPress={this.handleRetry} activeOpacity={0.8}>
          <Text style={s.btnText}>Yeniden Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emoji: { fontSize: 48, marginBottom: 20 },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  desc: {
    color: '#475569',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  btn: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
