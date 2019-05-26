import React from "react";
import Autocomplete from "./Autocomplete/Autocomplete";
import axios from "axios";

const fetchSuggestions = (value, cb) => {
  axios.get(`https://restcountries.eu/rest/v2/name/${value}`).then(res => {
    cb(res.data.reduce((a, v) => (a.push(v.name), a), []));
  });
};

const App = () => (
  <React.Fragment>
    <Autocomplete onSuggestionsRequested={fetchSuggestions} />
  </React.Fragment>
);

export default App;
