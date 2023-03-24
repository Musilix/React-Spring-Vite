import { useContext } from "react";
import { AuthContext } from "../../Hooks/AuthContext";
import "./Nav.css";
export default function Nav({
  showLoginModal,
  handleLogout,
}: {
  showLoginModal: Function;
  handleLogout: Function;
}) {
  const { user } = useContext(AuthContext);

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
              <button onClick={() => handleLogout()}>LOGOUT</button>
            ) : (
              <button onClick={() => showLoginModal()}>LOGIN</button>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
}
