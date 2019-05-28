/* eslint-disable class-methods-use-this */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import themeable from 'react-themeable';
import PropTypes from 'prop-types';
import co from 'co';

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

    this.selectItem = this.selectItem.bind(this);
  }

  componentWillMount() {
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

  onInputChange = e => {
    const { value } = e.target;

    const { onSuggestionsRequested, onSuggestionsClearRequested } = this.props;

    this.setState({ value, displayValue: value });

    if (value.trim().length > 0) {
      this.setState({
        fetching: true
      });

      const onlyFor = val => res => {
        if (this.state.value === val) {
          this.onSuggestionsFetched(res);
        }
      };

      co(onSuggestionsRequested(value)).then(onlyFor(value));
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

  getValueFromItem(item) {
    return item;
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
    this.selectItem(nextIndex);
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

  selectItem(selectedItemIndex) {
    this.setState(prevState => ({
      selectedItemIndex,
      displayValue: selectedItemIndex
        ? this.getValueFromItem(prevState.suggestions[selectedItemIndex])
        : prevState.value
    }));
  }

  renderItem(item) {
    return item;
  }

  render() {
    const styles = this.props.theme;
    const theme = themeable(styles);
    const { itemsVisible, displayValue, suggestions, selectedItemIndex } = this.state;

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
          onConfirm={this.hideItems}
        />
        <Items
          theme={theme}
          items={suggestions}
          visible={itemsVisible}
          selectedItemIndex={selectedItemIndex}
          renderItem={this.props.renderItem}
          onItemSelect={i => {
            this.selectItem(i);
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
  onSuggestionsClearRequested: PropTypes.func
};

Autocomplete.defaultProps = {
  *onSuggestionsRequested() {
    return yield;
  },
  onSuggestionsClearRequested() {
    this.setState({ suggestions: [] });
  },
  renderItem(item) {
    return item;
  },
  theme: defaultTheme
};
