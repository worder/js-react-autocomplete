import React from 'react';
import PropTypes from 'prop-types';

const KEY_CODE_UP = 38;
const KEY_CODE_DOWN = 40;
const KEY_CODE_ENTER = 13;

const Input = ({
  theme,
  value,
  allowTraversing,
  onMoveUp,
  onChange,
  onMoveDown,
  onConfirm,
  onShowItems,
  ...props
}) => {
  const onKeyDown = e => {
    const { keyCode } = e;

    if (!allowTraversing) {
      switch (keyCode) {
        case KEY_CODE_DOWN:
          e.preventDefault();
          onShowItems();
          break;
        default:
          break;
      }
    } else {
      switch (keyCode) {
        case KEY_CODE_UP:
          e.preventDefault();
          onMoveUp();
          break;
        case KEY_CODE_DOWN:
          e.preventDefault();
          onMoveDown();
          break;
        default:
          break;
      }
    }

    switch (keyCode) {
      case KEY_CODE_ENTER:
        e.preventDefault();
        onConfirm();
        break;
      default:
        break;
    }
  };

  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      {...props}
      {...theme('ac-input', 'input')}
    />
  );
};

Input.propTypes = {
  theme: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onMoveUp: PropTypes.func.isRequired,
  onMoveDown: PropTypes.func.isRequired,
  allowTraversing: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onShowItems: PropTypes.func.isRequired
};

export default Input;
