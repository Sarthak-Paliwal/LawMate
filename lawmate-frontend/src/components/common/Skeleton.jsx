import React from 'react';
import PropTypes from 'prop-types';

const Skeleton = ({ width, height, rounded = 'md', className = '', style = {} }) => {
  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  const finalStyle = {
    width: width || '100%',
    height: height || '1rem',
    ...style,
  };

  return (
    <div 
      className={`skeleton ${roundedClasses[rounded]} ${className}`}
      style={finalStyle}
    />
  );
};

Skeleton.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  rounded: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Skeleton;
