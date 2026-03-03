import React from 'react';
import PropTypes from 'prop-types';

const Spinner = ({ size = 'md', className = '' }) => {
  return (
    <div 
      className={`spinner ${size} ${className}`}
      role="status"
      aria-label="loading"
    />
  );
};

Spinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default Spinner;
