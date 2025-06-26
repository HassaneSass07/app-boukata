import { useColorScheme as _useColorScheme } from 'react-native';

/**
 * Hook personnalisé pour obtenir le thème actuel (light ou dark).
 */
export function useColorScheme() {
  return _useColorScheme();
}
