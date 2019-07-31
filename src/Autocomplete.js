import React, { Component } from 'react'
import themeable from 'react-themeable'
import PropTypes from 'prop-types'

import Input from './Input'
import Items from './Items'

const defaultTheme = {
  container: 'autocomplete__container',
  containerOpen: 'autocomplete__container--open',
  input: 'autocomplete__input',
  item: 'autocomplete__item',
  itemSelected: 'autocomplete__item--selected',
  itemHover: 'autocomplete__item--hover',
  items: 'autocomplete__items',
  itemHidden: 'autocomplete__items--hidden',
}

class Autocomplete extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: props.initialValue,
      displayValue: props.initialValue,
      suggestions: [],
      suggestionsForValue: '',
      selectedItemIndex: null,
      closed: true,
    }

    this.setCurrentItem = this.setCurrentItem.bind(this)
    this.confirmCurrentItem = this.confirmCurrentItem.bind(this)
  }

  componentDidMount() {
    if (typeof document !== 'undefined') {
      document.addEventListener('mouseup', this.onDocumentMouseUp)
    }
  }

  componentDidUpdate(prevProps) {
    if (this.state.suggestions !== this.props.suggestions) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(prevState => ({
        suggestions: this.props.suggestions,
        suggestionsForValue: prevState.value,
        selectedItemIndex: null,
      }))
    }
    if (
      !prevProps.initialValue &&
      this.props.initialValue &&
      prevProps.initialValue !== this.props.initialValue
    ) {
      this.setState(() => ({
        displayValue: this.props.initialValue,
      }))
    }
  }

  componentWillUnmount() {
    if (typeof document !== 'undefined') {
      document.removeEventListener('mouseup', this.onDocumentMouseUp)
    }
  }

  onDocumentMouseUp = event => {
    // walk tree
    let node = event.target
    while (node !== null && node !== document) {
      if (node.getAttribute('data-autocomplete-container') === 'true') {
        // ignore clicks inside autocomplete
        return
      }
      node = node.parentNode
    }
    this.hideItems()
  }

  onInputChange = value => {
    const { onChange } = this.props

    this.setState({
      value,
      displayValue: value,
      closed: false,
    })

    onChange(value)
  }

  getSuggestions() {
    return this.state.suggestions
  }

  setCurrentItem(selectedItemIndex) {
    const { itemToText } = this.props
    const suggestions = this.getSuggestions()
    this.setState(prevState => ({
      selectedItemIndex,
      displayValue:
        selectedItemIndex !== null ? itemToText(suggestions[selectedItemIndex]) : prevState.value,
    }))
  }

  getItemData(index) {
    const suggestions = this.getSuggestions()
    return suggestions[index] || false
  }

  moveCursor = n => {
    const { selectedItemIndex } = this.state
    const { length } = this.getSuggestions()

    if (length > 0) {
      let nextIndex
      if (selectedItemIndex !== null) {
        nextIndex = selectedItemIndex + n
        if (nextIndex < 0 || nextIndex >= length) {
          nextIndex = null
        }
      } else if (n > 0) {
        nextIndex = 0
      } else {
        nextIndex = length - 1
      }
      this.setCurrentItem(nextIndex)
    }
  }

  cursorUp = () => {
    this.moveCursor(-1)
  }

  cursorDown = () => {
    this.moveCursor(1)
  }

  showItems = () => {
    this.setState({ closed: false })
  }

  hideItems = () => {
    this.setState({ closed: true })
  }

  confirmItem = index => {
    this.setCurrentItem(index)
    const itemData = this.getItemData(index)
    const { value } = this.state
    const { onSelected, onChange, itemToText } = this.props
    let confirmedValue
    if (itemData) {
      confirmedValue = itemToText(itemData)
    } else {
      confirmedValue = value
    }
    onSelected(itemData, confirmedValue)
    onChange(confirmedValue)
    this.hideItems()
  }

  confirmCurrentItem() {
    const { selectedItemIndex } = this.state
    this.confirmItem(selectedItemIndex)
  }

  render() {
    const styles = this.props.theme
    const theme = themeable(styles)
    const { closed, displayValue, selectedItemIndex } = this.state

    const suggestions = this.getSuggestions()
    const listVisible = !closed && suggestions.length > 0
    const containerStyles = ['container']
    if (listVisible) {
      containerStyles.push('containerOpen')
    }

    return (
      <div {...theme('ac-con', ...containerStyles)} data-autocomplete-container>
        <Input
          theme={theme}
          renderInput={this.props.renderInput}
          value={displayValue}
          progress={this.props.progress}
          allowTraversing={listVisible}
          onChange={this.onInputChange}
          onMoveUp={this.cursorUp}
          onMoveDown={this.cursorDown}
          onShowItems={this.showItems}
          onFocus={this.showItems}
          onConfirm={this.confirmCurrentItem}
          placeholder={this.props.placeholder}
        />
        <Items
          theme={theme}
          renderItems={this.props.renderItems}
          renderItem={this.props.renderItem}
          renderValue={this.props.renderValue}
          itemToText={this.props.itemToText}
          items={suggestions}
          inputValue={this.state.suggestionsForValue}
          progress={this.props.progress}
          visible={listVisible}
          selectedItemIndex={selectedItemIndex}
          highlightWith={this.props.highlightWith}
          highlightValue={this.props.highlightValue}
          onItemSelect={i => {
            this.confirmItem(i)
            this.hideItems()
          }}
        />
      </div>
    )
  }
}

export default Autocomplete

Autocomplete.propTypes = {
  theme: PropTypes.object,
  onSelected: PropTypes.func,
  suggestions: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  progress: PropTypes.bool,
  onChange: PropTypes.func,
  renderItems: PropTypes.func,
  renderItem: PropTypes.func,
  renderInput: PropTypes.func,
  renderValue: PropTypes.func,
  itemToText: PropTypes.func,
  initialValue: PropTypes.string,
  highlightWith: PropTypes.node,
  highlightValue: PropTypes.string,
  placeholder: PropTypes.string,
}

Autocomplete.defaultProps = {
  renderValue: null,
  renderItems: null,
  renderItem: null,
  renderInput: null,
  onSelected: () => {},
  onChange: () => {},
  itemToText(item) {
    if (typeof item === 'object') {
      throw new Error(
        'list item is object, you should implement itemToText(item) function and pass it to autocomplete props',
      )
    }
    return item
  },
  theme: defaultTheme,
  suggestions: false,
  progress: false,
  initialValue: '',
  highlightWith: null,
  highlightValue: null,
  placeholder: '',
}
