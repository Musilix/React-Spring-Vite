import { useContext, useEffect } from "react";
import { AuthContext } from "../../Hooks/AuthContext";
import { logout } from "../../Services/UsersService";
import "./Nav.css";

export default function Nav({ showLoginModal }: { showLoginModal: Function }) {
  const { user } = useContext(AuthContext);

  const handleLogout = (e: any) => {
    e.preventDefault();

    logout();
    window.location.reload();
  };

  return (
    <>
      <nav>
        <ul>
          <li>
            <div>
              <a href="/">
                <img src="/tasktracker.svg" alt="Logo Image" />
              </a>
            </div>
          </li>
          <li>
            {user ? (
              <button onClick={(e) => handleLogout(e)}>LOGOUT</button>
            ) : (
              <button onClick={() => showLoginModal()}>LOGIN</button>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
}
