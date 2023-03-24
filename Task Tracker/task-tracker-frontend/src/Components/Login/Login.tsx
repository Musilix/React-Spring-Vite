import { Users } from "@prisma/client";
import { useContext } from "react";
import { AuthContext } from "../../Hooks/AuthContext";
import useInput from "../../Hooks/useInput";
import { login } from "../../Services/UsersService";

export default function Login() {
  const [username, handleUsername, resetUsername] = useInput("");
  const { setUser } = useContext(AuthContext);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const currUser: Users = await login(username);

    if (currUser) {
      setUser(currUser);
      resetUsername();
      window.location.reload();
    }
  };

  return (
    <div id="login-form-wrap">
      <h2>Log into your account</h2>
      <form>
        <input
          type="text"
          value={username}
          onChange={(e) => handleUsername(e)}
          placeholder="Username"
        />
        <button type="submit" onClick={(e) => handleSubmit(e)}>
          Login
        </button>
      </form>
    </div>
  );
}
