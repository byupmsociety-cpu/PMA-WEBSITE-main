import { Outlet } from "react-router-dom";
import Navigation from "../Navigation";
import Footer from "../Footer";

const PublicLayout = () => {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;
