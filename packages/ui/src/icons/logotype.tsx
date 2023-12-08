import Logo from "./logo";

export default function LogoType({ className }: { className?: string }) {
  return (
    <span className={`font-inter flex items-center font-medium ${className}`}>
      <Logo />
      U0
    </span>
  );
}
