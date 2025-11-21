import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ThreeDotButtonProps {
  onPress: () => void;
  size?: number;
  color?: string;
  buttonSize?: number;
}

const ThreeDotButton: React.FC<ThreeDotButtonProps> = ({
  onPress,
  size = 20,
  color = '#b3b3b3',
  buttonSize = 32,
}) => {
  return (
    <TouchableOpacity style={[styles.actionButton, { width: buttonSize, height: buttonSize }]} onPress={onPress}>
      <Ionicons name="ellipsis-horizontal" size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ThreeDotButton;
