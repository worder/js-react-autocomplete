import React from 'react';
import PropTypes from 'prop-types';

import Item from './Item';

const Items = ({
  items,
  theme,
  visible,
  renderItem,
  onItemSelect,
  selectedItemIndex,
  ...props
}) => {
  const itemsStyles = ['autocomplete__items'];
  if (items.length === 0 || !visible) {
    itemsStyles.push('autocomplete__items--hidden');
  }

  return (
    <ul {...theme('ac-items', ...itemsStyles)} {...props}>
      {items.map((itemData, i) => (
        <Item
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          itemIndex={i}
          theme={theme}
          onItemSelect={onItemSelect}
          selected={i === selectedItemIndex}
          itemValue={renderItem(itemData)}
        />
      ))}
    </ul>
  );
};

Items.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  items: PropTypes.array.isRequired,
  theme: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  renderItem: PropTypes.func.isRequired,
  onItemSelect: PropTypes.func.isRequired,
  selectedItemIndex: PropTypes.number
};

Items.defaultProps = {
  selectedItemIndex: null
};

export default Items;
