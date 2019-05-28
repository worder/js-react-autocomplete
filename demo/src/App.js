import React from 'react';
import axios from 'axios';
import Autocomplete from '../../src/Autocomplete';

function* fetchSuggestions(value) {
  try {
    const res = yield axios.get(`https://restcountries.eu/rest/v2/name/${value}`);
    // return res.data.reduce((a, v) => a.push(v.name) && a, []).slice(0, 10);
    return res.data.slice(0, 10);
  } catch (err) {
    return [];
  }
}

const App = () => (
  <React.Fragment>
    <Autocomplete
      debounce={300}
      onSuggestionsRequested={fetchSuggestions}
      getDisplayValue={item => item.name}
      onSelected={(item, value) => console.log(`${item.alpha2Code} - ${value}`)}
    />
  </React.Fragment>
);

export default App;
