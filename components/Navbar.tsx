import { Box } from "lucide-react";
import { useOutletContext } from "react-router";

import Button from "./Button";

const Navbar = () => {
  const { isSignedIn, userName, signInHandler, signOutHandler } =
    useOutletContext<AuthContext>();

  const handleAuthClick = async () => {
    if (isSignedIn) {
      try {
        await signOutHandler();
      } catch (error) {
        throw new Error("Something went wrong", { cause: error });
      }
    } else {
      try {
        await signInHandler();
      } catch (error) {
        throw new Error("Something went wrong", { cause: error });
      }
    }
  };

  return (
    <header className="navbar">
      <nav className="inner">
        <div className="left">
          <div className="brand">
            <Box className="logo" />
            <span className="name">Roomify</span>
          </div>

          <ul className="links">
            <a href="#">Product</a>
            <a href="#">Pricing</a>
            <a href="#">Community</a>
            <a href="#">Enterprise</a>
          </ul>
        </div>
        <div className="actions">
          {isSignedIn ? (
            <>
              <span className="greeting">
                {userName ? `Hi, ${userName}` : "Signed in"}
              </span>

              <Button className="btn" size="sm" onClick={handleAuthClick}>
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="ghost" onClick={handleAuthClick}>
                Log In
              </Button>
              <a href="#" className="cta">
                Get Started
              </a>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
