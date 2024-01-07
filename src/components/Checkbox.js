// components/Checkbox.js
import React from 'react';
import { CheckBox, Text } from 'react-native-elements';

const Checkbox = ({ label, isChecked, onToggle }) => {
  return (
    <CheckBox
      title={label}
      checked={isChecked}
      onPress={onToggle}
      containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
    />
  );
};

export default Checkbox;
