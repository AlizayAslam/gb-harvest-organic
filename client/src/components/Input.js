import PropTypes from 'prop-types';

function Input({ type, placeholder, value, onChange, required = false, className = '' }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
    />
  );
}

Input.propTypes = {
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  className: PropTypes.string,
};

export default Input;