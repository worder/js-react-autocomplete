import React, { Component } from "react";
import themeable from "react-themeable";
import co from "co";

import Input from "./Input";
import Items from "./Items";

import defaultTheme from "./theme.module.css";

const oneof = (a, b) => {
  return a ? a : b;
};

class Autocomplete extends Component {
  constructor() {
    super();

    this.state = {
      value: "",
      displayValue: "",
      suggestions: [],
      fetching: false,
      selectedItemIndex: null,
      itemsVisible: false
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.onSuggestionsFetched = this.onSuggestionsFetched.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(
      this
    );
    this.cursorUp = this.cursorUp.bind(this);
    this.cursorDown = this.cursorDown.bind(this);
    this.selectItem = this.selectItem.bind(this);
    this.showItems = this.showItems.bind(this);
    this.hideItems = this.hideItems.bind(this);
  }

  onSuggestionsRequested(value, cb) {}

  onSuggestionsClearRequested() {
    this.setState({ suggestions: [] });
  }

  onInputChange(e) {
    const { value } = e.target;

    const onSuggestionsRequested = oneof(
      this.props.onSuggestionsRequested,
      this.onSuggestionsRequested
    );
    const onSuggestionsClearRequested = oneof(
      this.props.onSuggestionsClearRequested,
      this.onSuggestionsClearRequested
    );

    this.setState({ value, displayValue: value });

    if (value.trim().length > 0) {
      this.setState({
        fetching: true
      });

      const onlyFor = value => res => {
        if (this.state.value === value) {
          this.onSuggestionsFetched(res);
        }
      };

      co(onSuggestionsRequested(value)).then(onlyFor(value));
    } else {
      onSuggestionsClearRequested();
    }
  }

  onSuggestionsFetched(suggestions) {
    //console.log(suggestions);

    this.setState({
      suggestions,
      fetching: false,
      selectedItemIndex: null,
      itemsVisible: suggestions.length > 0
    });
  }

  renderItem(item) {
    return item;
  }

  getValueFromItem(item) {
    return item;
  }

  selectItem(selectedItemIndex) {
    const displayValue =
      selectedItemIndex !== null
        ? this.getValueFromItem(this.state.suggestions[selectedItemIndex])
        : this.state.value;
    this.setState({ selectedItemIndex, displayValue });
  }

  moveCursor(n) {
    const { selectedItemIndex } = this.state;
    const { length } = this.state.suggestions;

    let nextIndex;
    if (selectedItemIndex !== null) {
      nextIndex = selectedItemIndex + n;
      if (nextIndex < 0 || nextIndex >= length) {
        nextIndex = null;
      }
    } else {
      if (n > 0) {
        nextIndex = 0;
      } else {
        nextIndex = length - 1;
      }
    }
    this.selectItem(nextIndex);
  }

  cursorUp() {
    this.moveCursor(-1);
  }

  cursorDown() {
    this.moveCursor(1);
  }

  showItems() {
    this.setState({ itemsVisible: true });
  }

  hideItems() {
    this.setState({ itemsVisible: false });
  }

  render() {
    const styles = this.props.theme ? this.props.theme : defaultTheme;
    const theme = themeable(styles);
    const renderItem = oneof(this.props.renderItem, this.renderItem);

    return (
      <div {...theme("ac-con", "autocomplete")}>
        <Input
          theme={theme}
          value={this.state.displayValue}
          allowSelection={this.state.itemsVisible}
          onChange={this.onInputChange}
          onMoveUp={this.cursorUp}
          onMoveDown={this.cursorDown}
          onShowItems={() => this.showItems}
          onConfirm={() => this.hideItems}
        />
        <Items
          items={this.state.suggestions}
          visible={this.state.itemsVisible}
          selectedItemIndex={this.state.selectedItemIndex}
          theme={theme}
          renderItem={renderItem}
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
