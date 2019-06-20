import React, { Component } from 'react';
import themeable from 'react-themeable';
import PropTypes from 'prop-types';
import co from 'co';
import _ from 'lodash';

import Input from './Input';
import Items from './Items';

const defaultTheme = {
  container: 'autocomplete__container',
  containerOpen: 'autocomplete__container--open',
  input: 'autocomplete__input',
  item: 'autocomplete__item',
  itemSelected: 'autocomplete__item--selected',
  itemHover: 'autocomplete__item--hover',
  items: 'autocomplete__items',
  itemHidden: 'autocomplete__items--hidden'
};

class Autocomplete extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      displayValue: props.value,
      suggestions: [],
      selectedItemIndex: null,
      closed: true
    };

    this.setCurrentItem = this.setCurrentItem.bind(this);
    this.confirmCurrentItem = this.confirmCurrentItem.bind(this);
  }

  componentDidMount() {
    const { debounce } = this.props;
    this.performFetchDebounced =
      debounce > 0 ? _.debounce(this.performFetch, debounce) : this.performFetch;

    if (typeof document !== 'undefined') {
      document.addEventListener('mouseup', this.onDocumentMouseUp);
    }
  }

  componentWillUnmount() {
    if (typeof document !== 'undefined') {
      document.removeEventListener('mouseup', this.onDocumentMouseUp);
    }
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
    const { onSuggestionsClearRequested, onChange } = this.props;

    this.setState({
      value,
      displayValue: value,
      closed: false
    });

    if (value.trim().length > 0) {
      this.performFetchDebounced(value);
    } else {
      onSuggestionsClearRequested.bind(this)();
    }

    onChange(value);
  };

  onSuggestionsFetched(suggestions) {
    this.setState({
      suggestions: suggestions || [],
      selectedItemIndex: null,
      closed: false
    });
  }

  getSuggestions() {
    // eslint-disable-next-line react/destructuring-assignment
    return this.props.suggestions !== false ? this.props.suggestions : this.state.suggestions;
  }

  setCurrentItem(selectedItemIndex) {
    const { getDisplayValue } = this.props;
    const suggestions = this.getSuggestions();
    this.setState(prevState => ({
      selectedItemIndex,
      displayValue:
        selectedItemIndex !== null
          ? getDisplayValue(suggestions[selectedItemIndex])
          : prevState.value
    }));
  }

  getItemData(index) {
    const suggestions = this.getSuggestions();
    return suggestions[index] || false;
  }

  moveCursor = n => {
    const { selectedItemIndex } = this.state;
    const { length } = this.getSuggestions();

    if (length > 0) {
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
    }
  };

  cursorUp = () => {
    this.moveCursor(-1);
  };

  cursorDown = () => {
    this.moveCursor(1);
  };

  showItems = () => {
    this.setState({ closed: false });
  };

  hideItems = () => {
    this.setState({ closed: true });
  };

  confirmItem = index => {
    this.setCurrentItem(index);
    const itemData = this.getItemData(index);
    const { value } = this.state;
    const { onSelected, onChange, getDisplayValue } = this.props;
    let confirmedValue;
    if (itemData) {
      confirmedValue = getDisplayValue(itemData);
    } else {
      confirmedValue = value;
    }
    onSelected(itemData, confirmedValue);
    onChange(confirmedValue);
    this.hideItems();
  };

  confirmCurrentItem() {
    const { selectedItemIndex } = this.state;
    this.confirmItem(selectedItemIndex);
  }

  performFetch(forValue) {
    const { onSuggestionsRequested } = this.props;
    if (onSuggestionsRequested) {
      const onlyFor = val => res => {
        // eslint-disable-next-line react/destructuring-assignment
        if (this.state.value === val) {
          this.onSuggestionsFetched(res);
        }
      };
      co(onSuggestionsRequested(forValue)).then(onlyFor(forValue));
    }
  }

  render() {
    const styles = this.props.theme;
    const theme = themeable(styles);
    const { closed, displayValue, selectedItemIndex } = this.state;

    const suggestions = this.getSuggestions();
    const listVisible = !closed && suggestions.length > 0;
    const containerStyles = ['container'];
    if (listVisible) {
      containerStyles.push('containerOpen');
    }

    return (
      <div {...theme('ac-con', ...containerStyles)} data-autocomplete-container>
        <Input
          renderInput={this.props.renderInput}
          theme={theme}
          value={displayValue}
          progress={this.props.progress}
          allowTraversing={listVisible}
          onChange={this.onInputChange}
          onMoveUp={this.cursorUp}
          onMoveDown={this.cursorDown}
          onShowItems={this.showItems}
          onFocus={this.showItems}
          onConfirm={this.confirmCurrentItem}
        />
        <Items
          renderItems={this.props.renderItems}
          renderItem={this.props.renderItem}
          progress={this.props.progress}
          theme={theme}
          items={suggestions}
          visible={listVisible}
          selectedItemIndex={selectedItemIndex}
          getDisplayValue={this.props.getDisplayValue}
          onItemSelect={i => {
            this.confirmItem(i);
            this.hideItems();
          }}
        />
      </div>
    );
  }
}

export default Autocomplete;

Autocomplete.propTypes = {
  theme: PropTypes.object,
  onSuggestionsRequested: PropTypes.func,
  onSuggestionsClearRequested: PropTypes.func,
  onSelected: PropTypes.func,
  getDisplayValue: PropTypes.func,
  debounce: PropTypes.number,
  suggestions: PropTypes.array,
  progress: PropTypes.bool,
  onChange: PropTypes.func,
  renderItems: PropTypes.func,
  renderItem: PropTypes.func,
  renderInput: PropTypes.func,
  value: PropTypes.string
};

Autocomplete.defaultProps = {
  renderItems: null,
  renderItem: null,
  renderInput: null,
  onSuggestionsRequested: null,
  onSuggestionsClearRequested() {
    this.setState({ suggestions: [] });
  },
  onSelected: () => {},
  onChange: () => {},
  getDisplayValue(item) {
    if (typeof item === 'object') {
      throw new Error(
        'list item is object, you should implement getDisplayValue(item) function and pass it to autocomplete props'
      );
    }
    return item;
  },
  debounce: 100,
  theme: defaultTheme,
  suggestions: false,
  progress: false,
  value: ''
};
