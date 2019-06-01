/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Item extends Component {
  constructor() {
    super();

    this.state = {
      hover: false
    };

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseEnter() {
    this.setState({ hover: true });
  }

  onMouseLeave() {
    this.setState({ hover: false });
  }

  render() {
    const { itemValue, itemIndex, selected, onItemSelect, theme, ...props } = this.props;

    const { hover } = this.state;

    const styles = ['item'];
    if (selected) {
      styles.push('itemSelected');
    }
    if (hover) {
      styles.push('itemHover');
    }

    return (
      <li
        {...theme('ac-itm', ...styles)}
        onClick={() => onItemSelect(itemIndex)}
        onKeyDown={() => {}} // TODO: implement
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        {...props}
      >
        {itemValue}
      </li>
    );
  }
}

Item.propTypes = {
  itemValue: PropTypes.string.isRequired,
  itemIndex: PropTypes.number.isRequired,
  theme: PropTypes.func.isRequired,
  onItemSelect: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired
};

export default Item;
