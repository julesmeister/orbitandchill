/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

interface ActionButtonProps {
  onClick?: () => void;
  href?: string;
  title: string;
  variant: 'view' | 'pin' | 'edit' | 'delete';
  isActive?: boolean;
  children: React.ReactNode;
  className?: string;
  label?: string;
}

const gradientStyles = {
  view: 'from-transparent via-green-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%]',
  pin: 'from-transparent via-pink-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%]',
  edit: 'from-transparent via-blue-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%]',
  delete: 'from-transparent via-red-200/20 to-transparent translate-x-[100%] group-hover:translate-x-[-100%]'
};

const baseStyles = "group relative px-3 md:px-4 py-2 md:py-3 border-r border-black hover:bg-black hover:text-white transition-all duration-300 overflow-hidden";

export default function ActionButton({ 
  onClick, 
  href, 
  title, 
  variant, 
  isActive = false, 
  children, 
  className = "",
  label
}: ActionButtonProps) {
  const gradientClass = gradientStyles[variant];
  
  const buttonContent = (
    <>
      <div className={`absolute inset-0 bg-gradient-to-r ${gradientClass} transition-transform duration-700`}></div>
      <div className="relative flex items-center space-x-2">
        <div>{children}</div>
        {label && (
          <span className="hidden md:inline xl:hidden text-sm font-medium">{label}</span>
        )}
      </div>
    </>
  );

  const finalClassName = `${baseStyles} ${
    isActive 
      ? 'bg-[#ff91e9] text-black hover:bg-black hover:text-white' 
      : 'bg-white text-black'
  } ${className}`;

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={finalClassName}
        title={title}
      >
        {buttonContent}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={finalClassName}
      title={title}
    >
      {buttonContent}
    </button>
  );
}