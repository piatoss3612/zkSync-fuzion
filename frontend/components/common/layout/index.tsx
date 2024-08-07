import React from "react";
import LayoutContainer from "./LayoutContainer";
import LayoutContent from "./LayoutContent";
import Footer from "./Footer";
import Navbar from "./navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <LayoutContainer>
      <Navbar />
      <LayoutContent>{children}</LayoutContent>
      <Footer />
    </LayoutContainer>
  );
};

export default Layout;
