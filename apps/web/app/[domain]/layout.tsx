import { NavMobile, Nav, Footer } from "@u0/ui";

export default function CustomDomainLayout(props) {
  return (
    <div className="flex min-h-screen flex-col justify-between">
      <NavMobile />
      <Nav />
      {props.children}
      <Footer />
    </div>
  );
}
