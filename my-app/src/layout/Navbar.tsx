import { Link } from "react-router-dom";
import {ModeToggle} from "@/components/mode-toggle";

function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <div className="flex gap-4">
        <Link to="/">Home</Link>
      </div>

      <ModeToggle />
    </nav>
  );
}

export default Navbar;
