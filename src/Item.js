/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Highlight from './Highlight'

const ValueCompDefault = ({ item, highlightValue, highlightWith, itemToText }) => (
  <React.Fragment>
    <Highlight value={highlightValue} {...(highlightWith ? { as: highlightWith } : {})}>
      {itemToText(item)}
    </Highlight>
  </React.Fragment>
)

ValueCompDefault.propTypes = {
  item: PropTypes.any.isRequired,
  highlightValue: PropTypes.string.isRequired,
  highlightWith: PropTypes.node,
  itemToText: PropTypes.func.isRequired,
}

ValueCompDefault.defaultProps = {
  highlightWith: null,
}

const ItemCompDefault = ({ children, theme, events }) => (
  <li {...theme} {...events}>
    {children}
  </li>
)

ItemCompDefault.propTypes = {
  children: PropTypes.node.isRequired,
  theme: PropTypes.func.isRequired,
  events: PropTypes.arrayOf(PropTypes.func).isRequired,
}

class Item extends Component {
  constructor() {
    super()

    this.state = {
      hover: false,
    }

    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
  }

  onMouseEnter() {
    this.setState({ hover: true })
  }

  onMouseLeave() {
    this.setState({ hover: false })
  }

  render() {
    const {
      itemIndex,
      item,
      items,
      inputValue,
      selected,
      onItemSelect,
      theme,
      progress,
      renderItem,
      renderValue,
      itemToText,
      highlightWith,
      highlightValue,
    } = this.props

    const { hover } = this.state

    const styles = ['item']
    if (selected) {
      styles.push('itemSelected')
    }
    if (hover) {
      styles.push('itemHover')
    }

    const itemProps = {
      events: {
        onClick: () => onItemSelect(itemIndex),
        onMouseEnter: this.onMouseEnter,
        onMouseLeave: this.onMouseLeave,
      },
      theme: theme('ac-itm', ...styles),
      selected,
      hover,
      progress,
    }

    const valueProps = {
      item,
      items,
      highlightValue: highlightValue || inputValue,
      highlightWith,
      itemToText,
    }

    const ValueComp = renderValue || ValueCompDefault
    const ItemComp = renderItem || ItemCompDefault

    return (
      <ItemComp {...itemProps}>
        <ValueComp {...valueProps} />
      </ItemComp>
    )
  }
}

Item.propTypes = {
  theme: PropTypes.func.isRequired,
  item: PropTypes.any.isRequired,
  items: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  itemIndex: PropTypes.number.isRequired,
  inputValue: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  progress: PropTypes.bool.isRequired,
  itemToText: PropTypes.func.isRequired,
  highlightWith: PropTypes.node,
  renderItem: PropTypes.func,
  renderValue: PropTypes.func,
  onItemSelect: PropTypes.func.isRequired,
  highlightValue: PropTypes.string,
}

Item.defaultProps = {
  highlightWith: null,
  renderItem: null,
  renderValue: null,
  highlightValue: null,
}

export default Item
