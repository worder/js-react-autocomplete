import React from "react";
import Autocomplete from "./Autocomplete/Autocomplete";
import axios from "axios";

function* fetchSuggestions(value, cb) {
  try {
    const res = yield axios.get(
      `https://restcountries.eu/rest/v2/name/${value}`
    );
    return res.data.reduce((a, v) => a.push(v.name) && a, []).slice(0, 10);
  } catch (err) {
    return [];
  }
}

const App = () => (
  <React.Fragment>
    <Autocomplete onSuggestionsRequested={fetchSuggestions} />
  </React.Fragment>
);

export default App;
