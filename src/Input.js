import React from 'react';
import PropTypes from 'prop-types';

const KEY_CODE_UP = 38;
const KEY_CODE_DOWN = 40;
const KEY_CODE_ENTER = 13;

// eslint-disable-next-line react/prop-types
const DefaultRender = ({ events, value, theme }) => (
  <input type="text" value={value} {...events} {...theme} />
);

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }

  render() {
    const {
      theme,
      value,
      progress,
      allowTraversing,
      onMoveUp,
      onChange,
      onMoveDown,
      onConfirm,
      onShowItems,
      onFocus,
      renderInput
    } = this.props;

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

    const inputProps = {
      value,
      progress,
      events: {
        onChange: e => onChange(e.target.value),
        onKeyDown,
        onFocus
      },
      theme: theme('ac-input', 'input')
    };

    const InputComp = renderInput || DefaultRender;

    return <InputComp {...inputProps} />;
  }
}

Input.propTypes = {
  theme: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onMoveUp: PropTypes.func.isRequired,
  onMoveDown: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  allowTraversing: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onShowItems: PropTypes.func.isRequired,
  renderInput: PropTypes.func,
  progress: PropTypes.bool.isRequired
};

Input.defaultProps = {
  renderInput: null
};

export default Input;
