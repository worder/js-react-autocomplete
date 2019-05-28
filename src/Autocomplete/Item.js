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
    const { renderItem, itemIndex, itemData, selected, onItemSelect, theme, ...props } = this.props;

    const { hover } = this.state;

    const styles = ['autocomplete__item'];
    if (selected) {
      styles.push('autocomplete__item--selected');
    }
    if (hover) {
      styles.push('autocomplete__item--hover');
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
        {renderItem(itemData)}
      </li>
    );
  }
}

Item.propTypes = {
  itemIndex: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  itemData: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]).isRequired,
  renderItem: PropTypes.func.isRequired,
  theme: PropTypes.func.isRequired,
  onItemSelect: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired
};

export default Item;
