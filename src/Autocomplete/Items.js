import React, { Component } from "react";
import PropTypes from "prop-types";

import Item from "./Item";

class Items extends Component {
  render() {
    const {
      items,
      theme,
      visible,
      renderItem,
      onItemSelect,
      selectedItemIndex,
      ...props
    } = this.props;

    let itemsStyles = ["autocomplete__items"];
    if (items.length === 0 || !visible) {
      itemsStyles.push("autocomplete__items--hidden");
    }

    return (
      <ul {...theme("ac-items", ...itemsStyles)} {...props}>
        {items.map((itemData, i) => (
          <Item
            key={`ac-item-${i}`}
            theme={theme}
            renderItem={renderItem}
            onClick={() => onItemSelect(i)}
            selected={i === selectedItemIndex}
            itemData={itemData}
          />
        ))}
      </ul>
    );
  }
}

Items.propTypes = {
  items: PropTypes.array,
  theme: PropTypes.func,
  visible: PropTypes.bool,
  renderItem: PropTypes.func,
  onItemSelect: PropTypes.func
};

Items.defaultProps = {
  visible: true
};

export default Items;
