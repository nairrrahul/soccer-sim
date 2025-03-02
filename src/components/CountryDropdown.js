import React, { useState } from 'react';
import countryStats from "../configs/CountryStats.json";

// Sample list of countries
const countries = Object.keys(countryStats);


const CountryDropdown = ({onSelect}) => {
  const [input, setInput] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value.length >= 2) {
      const regex = new RegExp(value.split('').join('.*'), 'i'); 
      const matches = countries.filter(country => regex.test(country));
      setFilteredCountries(matches);
    } else {
      setFilteredCountries([]);
    }
  };

  const handleCountrySelect = (country) => {
    setInput(country);
    setFilteredCountries([]);
    onSelect(country);
  };

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Start typing a country..."
        style={{ padding: '8px', width: '200px' }}
      />
      {filteredCountries.length > 0 && (
        <ul style={{ border: '1px solid #ccc', maxHeight: '150px', overflowY: 'auto', listStyleType: 'none', padding: 0 }}>
          {filteredCountries.map((country, index) => (
            <li
              key={index}
              onClick={() => handleCountrySelect(country)}
              style={{ padding: '8px', cursor: 'pointer' }}
            >
              {country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CountryDropdown;