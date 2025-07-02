// client/src/components/Input.js
import React from 'react';
import PropTypes from 'prop-types';

function Input({ type, placeholder = '', value, onChange, required = false }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
    />
  );
}

Input.propTypes = {
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
};

export default Input;