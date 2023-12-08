import Logo from "./logo";

export default function LogoType({ className }: { className?: string }) {
  return (
    <span className={`flex items-center font-mono font-medium ${className}`}>
      <Logo />
      U0
    </span>
  );
}
