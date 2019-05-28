import React from 'react';
import PropTypes from 'prop-types';

const KEY_CODE_UP = 38;
const KEY_CODE_DOWN = 40;
const KEY_CODE_ENTER = 13;

const Input = ({
  theme,
  value,
  allowSelection,
  onMoveUp,
  onChange,
  onMoveDown,
  onConfirm,
  onShowItems,
  ...props
}) => {
  const onKeyDown = e => {
    const { keyCode } = e;
    const listTravelEvent = key => {
      switch (key) {
        case KEY_CODE_UP:
          onMoveUp();
          break;
        case KEY_CODE_DOWN:
          onMoveDown();
          break;
        case KEY_CODE_ENTER:
          onConfirm();
          break;
        default:
          break;
      }
    };

    const visibilityStateEvent = key => {
      switch (key) {
        case KEY_CODE_DOWN:
          onShowItems();
          break;
        default:
          break;
      }
    };

    if (!allowSelection) {
      switch (keyCode) {
        case KEY_CODE_DOWN:
          e.preventDefault();
          visibilityStateEvent(keyCode);
          break;
        default:
          break;
      }
    } else {
      switch (keyCode) {
        case KEY_CODE_UP:
        case KEY_CODE_DOWN:
        case KEY_CODE_ENTER:
          e.preventDefault();
          listTravelEvent(keyCode);
          break;
        default:
          break;
      }
    }
  };

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      {...theme('ac-input', 'autocomplete__input')}
      {...props}
    />
  );
};

Input.propTypes = {
  theme: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onMoveUp: PropTypes.func.isRequired,
  onMoveDown: PropTypes.func.isRequired,
  allowSelection: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onShowItems: PropTypes.func.isRequired
};

export default Input;
