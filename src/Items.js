import React from 'react';
import PropTypes from 'prop-types';

import Item from './Item';

// eslint-disable-next-line react/prop-types
const DefaultItemsComp = ({ children, theme }) => <ul {...theme}>{children}</ul>;

const Items = ({
  items,
  theme,
  progress,
  visible,
  renderItem,
  renderItems,
  onItemSelect,
  selectedItemIndex,
  getDisplayValue
}) => {
  const itemsStyles = ['items'];
  if (!visible) {
    itemsStyles.push('itemsHidden');
  }

  const itemsProps = {
    visible,
    progress,
    theme: theme('ac-items', ...itemsStyles)
  };

  const ItemsComp = renderItems || DefaultItemsComp;

  return (
    <ItemsComp {...itemsProps}>
      {items.map((itemData, i) => (
        <Item
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          itemIndex={i}
          theme={theme}
          progress={progress}
          onItemSelect={onItemSelect}
          selected={i === selectedItemIndex}
          itemValue={getDisplayValue(itemData)}
          renderItem={renderItem}
        />
      ))}
    </ItemsComp>
  );
};

Items.propTypes = {
  items: PropTypes.array.isRequired,
  theme: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  onItemSelect: PropTypes.func.isRequired,
  getDisplayValue: PropTypes.func.isRequired,
  selectedItemIndex: PropTypes.number,
  renderItem: PropTypes.func,
  renderItems: PropTypes.func,
  progress: PropTypes.bool.isRequired
};

Items.defaultProps = {
  selectedItemIndex: null,
  renderItem: null,
  renderItems: null
};

export default Items;
