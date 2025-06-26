import React from 'react';
import { TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';

export const HapticTab = (props) => {
  return (
    <TouchableOpacity
      {...props}
      onPress={() => {
        Haptics.selectionAsync(); // Retour haptique léger
        props.onPress?.();
      }}
    >
      {props.children}
    </TouchableOpacity>
  );
};
