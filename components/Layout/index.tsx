import { Body } from "../Body";
import { CommonHead } from "../CommonHead";
import { Footer } from "../Footer";
import { Header } from "../Header";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <CommonHead />
      <Header />
      <Body>{children}</Body>
      <Footer />
    </>
  );
}
