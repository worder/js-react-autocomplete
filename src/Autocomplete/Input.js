import React, { Component } from "react";
import PropTypes from "prop-types";

const KEY_CODE_UP = 38;
const KEY_CODE_DOWN = 40;
const KEY_CODE_ENTER = 13;

class Input extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    onMoveUp: PropTypes.func,
    onMoveDown: PropTypes.func,
    theme: PropTypes.func
  };

  constructor() {
    super();
  }

  render() {
    const {
      onChange,
      theme,
      allowSelection,
      onMoveUp,
      onMoveDown,
      onConfirm,
      onShowItems,
      value,
      ...props
    } = this.props;

    const onKeyDown = (onMoveUp, onMoveDown) => e => {
      const listTravelEvent = e => {
        switch (e.keyCode) {
          case KEY_CODE_UP:
            onMoveUp();
            break;
          case KEY_CODE_DOWN:
            onMoveDown();
            break;
          case KEY_CODE_ENTER:
            onConfirm();
            break;
        }
      };

      const visibilityStateEvent = e => {
        switch (e.keyCode) {
          case KEY_CODE_DOWN:
            onShowItems();
            break;
        }
      };

      if (!allowSelection) {
        switch (e.keyCode) {
          case KEY_CODE_DOWN:
            e.preventDefault();
            visibilityStateEvent(e);
            break;
        }
      } else {
        switch (e.keyCode) {
          case KEY_CODE_UP:
          case KEY_CODE_DOWN:
          case KEY_CODE_ENTER:
            e.preventDefault();
            listTravelEvent(e);
        }
      }
    };

    return (
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown(onMoveUp, onMoveDown)}
        {...theme("ac-input", "autocomplete__input")}
        {...props}
      />
    );
  }
}

export default Input;
