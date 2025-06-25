import * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", ...props }, ref) => {
    const base = "rounded-xl px-4 py-2 font-semibold transition focus:outline-none"
    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 shadow",
      outline: "bg-white border border-blue-600 text-blue-600 hover:bg-blue-50",
    }
    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${className}`}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

