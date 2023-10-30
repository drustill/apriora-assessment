import { forwardRef } from "react";
import { twMerge } from "tailwind-merge"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  type,
  disabled,
  ...props
}, ref) => {
  return (
    <input
      type={type}
      className={twMerge(
        `
        flex 
        w-full
        rounded-md 
        bg-gray-900
        border-4
        border-cyan-600
        px-3 
        py-3 
        text-lg 
        disabled:cursor-not-allowed 
        disabled:opacity-50
        text-white
        focus:outline-none
      `,
        disabled && 'opacity-75',
        className
      )}
      disabled={disabled}
      ref={ref}
      {...props}
    />
  )
});

Input.displayName = "Input";

export default Input