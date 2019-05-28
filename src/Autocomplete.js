/* eslint-disable class-methods-use-this */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import themeable from 'react-themeable';
import PropTypes from 'prop-types';
import co from 'co';
import _ from 'lodash';

import Input from './Input';
import Items from './Items';

import defaultTheme from './theme.module.css';

class Autocomplete extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
      displayValue: '',
      suggestions: [],
      fetching: false,
      selectedItemIndex: null,
      itemsVisible: false
    };

    this.setCurrentItem = this.setCurrentItem.bind(this);
    this.confirmCurrentItem = this.confirmCurrentItem.bind(this);
  }

  componentWillMount() {
    this.performFetchDebounced =
      this.props.debounce > 0
        ? _.debounce(this.performFetch, this.props.debounce)
        : this.performFetch;

    document.addEventListener('mouseup', this.onDocumentMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.onDocumentMouseUp);
  }

  onDocumentMouseUp = event => {
    // walk tree
    let node = event.target;
    while (node !== null && node !== document) {
      if (node.getAttribute('data-autocomplete-container') === 'true') {
        // ignore clicks inside autocomplete
        return;
      }
      node = node.parentNode;
    }
    this.hideItems();
  };

  onInputChange = value => {
    const { onSuggestionsClearRequested } = this.props;

    this.setState({ value, displayValue: value });

    if (value.trim().length > 0) {
      this.setState({
        fetching: true
      });

      this.performFetchDebounced(value);
    } else {
      onSuggestionsClearRequested.bind(this)();
    }
  };

  onSuggestionsFetched(suggestions) {
    this.setState({
      suggestions,
      fetching: false,
      selectedItemIndex: null,
      itemsVisible: suggestions.length > 0
    });
  }

  setCurrentItem(selectedItemIndex) {
    this.setState(prevState => {
      return {
        selectedItemIndex,
        displayValue:
          selectedItemIndex !== null
            ? this.props.getDisplayValue(prevState.suggestions[selectedItemIndex])
            : prevState.value
      };
    });
  }

  getCurrentItemData() {
    const { suggestions, selectedItemIndex } = this.state;
    if (selectedItemIndex !== null) {
      return suggestions[selectedItemIndex];
    }

    return false;
  }

  moveCursor = n => {
    const { selectedItemIndex } = this.state;
    const { length } = this.state.suggestions;

    let nextIndex;
    if (selectedItemIndex !== null) {
      nextIndex = selectedItemIndex + n;
      if (nextIndex < 0 || nextIndex >= length) {
        nextIndex = null;
      }
    } else if (n > 0) {
      nextIndex = 0;
    } else {
      nextIndex = length - 1;
    }
    this.setCurrentItem(nextIndex);
  };

  cursorUp = () => {
    this.moveCursor(-1);
  };

  cursorDown = () => {
    this.moveCursor(1);
  };

  showItems = () => {
    this.setState({ itemsVisible: true });
  };

  hideItems = () => {
    this.setState({ itemsVisible: false });
  };

  performFetch(value) {
    const { onSuggestionsRequested } = this.props;

    const onlyFor = val => res => {
      if (this.state.value === val) {
        this.onSuggestionsFetched(res);
      }
    };

    co(onSuggestionsRequested(value)).then(onlyFor(value));
  }

  confirmCurrentItem() {
    const currentItem = this.getCurrentItemData();
    const { value, displayValue } = this.state;
    this.props.onSelected(currentItem, currentItem ? displayValue : value);
    this.hideItems();
  }

  render() {
    const styles = this.props.theme;
    const theme = themeable(styles);
    const { itemsVisible, displayValue, suggestions, selectedItemIndex } = this.state;

    const renderItemWrap = getDisplayValue => item => this.props.renderItem(item, getDisplayValue);

    return (
      <div {...theme('ac-con', 'autocomplete')} data-autocomplete-container>
        <Input
          theme={theme}
          value={displayValue}
          allowSelection={itemsVisible}
          onChange={this.onInputChange}
          onMoveUp={this.cursorUp}
          onMoveDown={this.cursorDown}
          onShowItems={this.showItems}
          onConfirm={this.confirmCurrentItem}
        />
        <Items
          theme={theme}
          items={suggestions}
          visible={itemsVisible}
          selectedItemIndex={selectedItemIndex}
          renderItem={renderItemWrap(this.props.getDisplayValue)}
          onItemSelect={i => {
            this.setCurrentItem(i);
            this.hideItems();
          }}
        />
      </div>
    );
  }
}

export default Autocomplete;

Autocomplete.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  theme: PropTypes.object,
  renderItem: PropTypes.func,
  onSuggestionsRequested: PropTypes.func,
  onSuggestionsClearRequested: PropTypes.func,
  onSelected: PropTypes.func,
  getDisplayValue: PropTypes.func,
  debounce: PropTypes.number
};

Autocomplete.defaultProps = {
  *onSuggestionsRequested() {
    return yield;
  },
  onSuggestionsClearRequested() {
    this.setState({ suggestions: [] });
  },
  onSelected() {},
  renderItem(item, getDisplayValue) {
    return getDisplayValue(item);
  },
  getDisplayValue(item) {
    return item;
  },
  debounce: 100,
  theme: defaultTheme
};
