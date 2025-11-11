import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  icon, 
  ...props 
}) => {
  const className = `button button--${variant} button--${size}`;
  
  return (
    <button className={className} {...props}>
      {icon && <span className="button__icon">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;