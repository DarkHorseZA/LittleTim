import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/colors';
import { fonts } from '../theme/type';
import { BottomSheet } from './BottomSheet';
import { Button } from './Button';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  onConfirm: () => void;
  onCancel: () => void;
};

// A calm, in-app confirmation, used in place of a system Alert for anything
// destructive, so the moment stays inside the app's own quiet voice. The
// cancel is always the easy, safe default (ghost, full width, listed first);
// the destructive action is clearly marked but not shouty.
export function ConfirmSheet({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  destructive = false,
  icon,
  onConfirm,
  onCancel,
}: Props) {
  if (!visible) return null;

  return (
    <BottomSheet onDismiss={onCancel} dismissLabel={cancelLabel}>
      {icon ? (
        <View style={styles.iconWrap}>
          <Ionicons
            name={icon}
            size={24}
            color={destructive ? colors.danger : colors.clay}
          />
        </View>
      ) : null}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      <Button
        title={confirmLabel}
        variant={destructive ? 'danger' : 'primary'}
        onPress={onConfirm}
        size="lg"
        // A destructive action is a warning moment; never a celebratory feel.
        haptic="none"
        style={styles.confirmBtn}
      />
      <View style={{ height: 10 }} />
      <Button title={cancelLabel} variant="ghost" onPress={onCancel} size="lg" />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.clayWash,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 14,
  },
  title: {
    fontFamily: fonts.serifBold,
    fontSize: 24,
    lineHeight: 30,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.inkSoft,
    textAlign: 'center',
    marginBottom: 22,
  },
  confirmBtn: {
    width: '100%',
  },
});
