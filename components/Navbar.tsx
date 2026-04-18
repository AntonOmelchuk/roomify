import { Box } from "lucide-react";
import Button from "./Button";
import { useOutletContext } from "react-router";

const Navbar = () => {
  const { isSignedIn, userName, signInHandler, signOutHandler } =
    useOutletContext<AuthContext>();

  const handleAuthClick = async () => {
    if (isSignedIn) {
      try {
        await signOutHandler();
      } catch (error) {
        throw new Error("Something went wrong");
      }
    } else {
      try {
        await signInHandler();
      } catch (error) {
        throw new Error("Something went wrong");
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
