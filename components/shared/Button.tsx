import styles from "./Button.module.css";

type ButtonVariant = "1" | "2" | "white" | "system" | undefined;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  $variant?: ButtonVariant;
  children?: React.ReactElement;
  className?: string;
}

const getVariantClass = (variant: ButtonVariant = "system"): string => {
  switch (variant) {
    case "1":
      return styles.variant1;
    case "2":
      return styles.variant2;
    case "white":
      return styles.variantWhite;
    case "system":
      return styles.variantSystem;
    default:
      return styles.variant1;
  }
};

const Button = ({ children, $variant, className, ...props }: ButtonProps) => {
  const variantClass = getVariantClass($variant);
  const buttonClass =
    `${styles.button} ${variantClass} ${className || ""}`.trim();

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
};

export default Button;
