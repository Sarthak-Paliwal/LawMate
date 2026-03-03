import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div 
      className={`card p-6 ${hover ? 'transition-transform duration-300 hover:-translate-y-1 hover:shadow-md' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool,
};

export default Card;
