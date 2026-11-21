import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';

export default function Index() {
  const { colors, space, typography } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg, padding: space['space-5'], gap: space['space-3'] }]}>
      <Text style={[typography['display-lg'], { color: colors.text }]}>Trivia confianza</Text>
      <Text style={[typography.body, { color: colors['text-muted'] }]}>
        Project base ready: fonts, theme tokens and Supabase client.
      </Text>
      <Text style={[typography['number-md'], { color: colors['brand-text'] }]}>+12</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
