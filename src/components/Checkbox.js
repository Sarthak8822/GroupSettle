// components/Checkbox.js
import React from 'react';
import { CheckBox } from '@rneui/themed';

const Checkbox = ({ label, isChecked, onToggle }) => {
  return (
    <CheckBox
      title={label}
      checked={isChecked}
      onPress={onToggle}
      // Customize the following props based on your requirements
      iconType="material-community"
      checkedIcon="checkbox-marked"
      uncheckedIcon="checkbox-blank-outline"
      checkedColor="red"
    />
  );
};

export default Checkbox;
