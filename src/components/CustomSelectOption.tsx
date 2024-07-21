import React from 'react';
import {Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../Utils/ColorUtils';

interface SelectOptionProps {
  onPress: () => void;
  title: string;
  isSelect?: boolean;
}

export const CustomSelectOption: React.FC<SelectOptionProps> = ({
  onPress,
  title,
  isSelect = true,
}) => {
  return (
    <Pressable onPress={onPress} style={[styles.button, shadowStyle]}>
      <View style={styles.mainViewOne}>
        <Text style={styles.txt}>{title}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  mainViewOne: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mainViewTwo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  label: {
    textDecorationLine: 'underline',
    color: COLORS.fcmbPurple,
  },
  linkLabel: {
    marginRight: 4,
    fontSize: 12,
    marginTop: 2,
  },
  linkText: {
    textDecorationLine: 'underline',
    color: COLORS.fcmbPurple,
    fontSize: 14,
  },
  button: {
    height: 80,
    borderColor: '#e9e9ea',
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
  },
  txt: {
    color: COLORS.fcmbPurple,
    fontSize: 14,
  },
});

const shadowStyle = Platform.select({
  ios: {
    shadowColor: COLORS.lightGray,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 3.84,
  },
  android: {
    elevation: 4,
    shadowColor: COLORS.lightGray,
    shadowRadius: 3.84,
  },
});
