/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line react/prop-types
const DefaultItemRender = ({ children, theme, events }) => (
  <li {...theme} {...events}>
    {children}
  </li>
);

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
    const {
      itemValue,
      itemIndex,
      selected,
      onItemSelect,
      theme,
      progress,
      renderItem
    } = this.props;

    const { hover } = this.state;

    const styles = ['item'];
    if (selected) {
      styles.push('itemSelected');
    }
    if (hover) {
      styles.push('itemHover');
    }

    const itemProps = {
      events: {
        onClick: () => onItemSelect(itemIndex),
        onMouseEnter: this.onMouseEnter,
        onMouseLeave: this.onMouseLeave
      },
      theme: theme('ac-itm', ...styles),
      selected,
      hover,
      progress
    };

    const ItemComp = renderItem || DefaultItemRender;
    return <ItemComp {...itemProps}>{itemValue}</ItemComp>;
  }
}

Item.propTypes = {
  itemValue: PropTypes.string.isRequired,
  itemIndex: PropTypes.number.isRequired,
  theme: PropTypes.func.isRequired,
  onItemSelect: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  renderItem: PropTypes.func,
  progress: PropTypes.bool.isRequired
};

Item.defaultProps = {
  renderItem: null
};

export default Item;
