import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    children,
    disabled,
    type = "button",
    ...props
}, ref) => {
    return (
        <button
            type={type}
            className={twMerge(`
                w-1/4
                rounded-full 
                bg-cyan-950 
                border-4 
                border-cyan-700
                text-3xl 
                py-10 
                disabled:cursor-not-allowed 
                disabled:opacity-50 
                text-cyan-500
                font-semibold 
                hover:bg-cyan-700 
                hover:text-cyan-300
                hover:scale-105 
                transition
            `,
                className
            )}
            disabled={disabled}
            ref={ref}
            {...props}
        >
            {children}
        </button>
    )
})

Button.displayName = "button"

export default Button
