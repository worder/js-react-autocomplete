import React from 'react'
import PropTypes from 'prop-types'

import Item from './Item'

// eslint-disable-next-line react/prop-types
const DefaultItemsComp = ({ children, theme }) => <ul {...theme}>{children}</ul>

const Items = ({
  renderItem,
  renderItems,
  renderValue,
  items,
  inputValue,
  theme,
  progress,
  visible,
  onItemSelect,
  selectedItemIndex,
  highlightWith,
  highlightValue,
  itemToText,
}) => {
  const itemsStyles = ['items']
  if (!visible) {
    itemsStyles.push('itemsHidden')
  }

  const itemsProps = {
    visible,
    progress,
    theme: theme('ac-items', ...itemsStyles),
  }

  const ItemsComp = renderItems || DefaultItemsComp

  return (
    <ItemsComp {...itemsProps}>
      {items.map((itemData, i) => (
        <Item
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          itemIndex={i}
          item={itemData}
          items={items}
          inputValue={inputValue}
          theme={theme}
          progress={progress}
          onItemSelect={onItemSelect}
          selected={i === selectedItemIndex}
          renderValue={renderValue}
          renderItem={renderItem}
          itemToText={itemToText}
          highlightWith={highlightWith}
          highlightValue={highlightValue}
        />
      ))}
    </ItemsComp>
  )
}

Items.propTypes = {
  renderItem: PropTypes.func,
  renderItems: PropTypes.func,
  renderValue: PropTypes.func,
  itemToText: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  inputValue: PropTypes.string.isRequired,
  theme: PropTypes.func.isRequired,
  progress: PropTypes.bool.isRequired,
  visible: PropTypes.bool.isRequired,
  onItemSelect: PropTypes.func.isRequired,
  selectedItemIndex: PropTypes.number,
  highlightWith: PropTypes.node,
  highlightValue: PropTypes.string,
}

Items.defaultProps = {
  selectedItemIndex: null,
  renderItem: null,
  renderItems: null,
  renderValue: null,
  highlightValue: null,
  highlightWith: null,
}

export default Items
