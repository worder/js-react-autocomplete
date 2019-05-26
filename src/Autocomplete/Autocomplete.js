import React, { Component } from "react";

import Input from "./Input";
import Items from "./Items";
import Item from "./Item";

class Autocomplete extends Component {
  constructor() {
    super();

    this.state = {
      suggestions: []
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.onSuggestionsFetched = this.onSuggestionsFetched.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(
      this
    );
  }

  onSuggestionsRequested(value, cb) {}

  onSuggestionsClearRequested() {
    this.setState({ suggestions: [] });
  }

  onInputChange(e) {
    const {
      target: { value }
    } = e;

    let { onSuggestionsClearRequested, onSuggestionsRequested } = this.props;
    if (!onSuggestionsClearRequested) {
      onSuggestionsClearRequested = this.onSuggestionsClearRequested;
    }
    if (!onSuggestionsRequested) {
      onSuggestionsRequested = this.onSuggestionsRequested;
    }

    if (value.trim().length > 0) {
      onSuggestionsRequested(value, s => this.onSuggestionsFetched(s));
    } else {
      onSuggestionsClearRequested();
    }
  }

  onSuggestionsFetched(suggestions) {
    // console.log(suggestions);
    this.setState({ suggestions });
  }

  renderItem(item) {
    return item;
  }

  render() {
    let { renderItem } = this.props;
    if (!renderItem) {
      renderItem = this.renderItem;
    }

    return (
      <div>
        <Input onChange={this.onInputChange} />
        <Items>
          {this.state.suggestions.map((s, i) => (
            <Item key={i} item={s} renderItem={renderItem} />
          ))}
        </Items>
      </div>
    );
  }
}

export default Autocomplete;
