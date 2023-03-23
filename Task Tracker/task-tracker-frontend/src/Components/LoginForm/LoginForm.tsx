import { useContext, useState } from "react";
import { AuthContext } from "../../Hooks/AuthContext";
import { login, logout } from "../../Services/UsersService";
export default function LoginForm() {
  const [username, setUsername] = useState("");
  const { user, setUser } = useContext(AuthContext);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // send a sign in user req to API
    const signedInUser = await login(username);

    console.log(JSON.stringify(signedInUser));
    // grab the user returned and store it in the auth context
    setUser({ ...signedInUser });

    // do anything with the cookie returned?
  };

  // const handleLogout = () => {
  //   // clear cookie of user
  //   logout();

  //   // unset user
  //   setUser(null);
  // };

  const handleChange = (e: any) => {
    setUsername(e.target.value);
  };

  return (
    <>
      <h2>Login, Bud</h2>
      <div>
        <form>
          <input
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => handleChange(e)}
          />
          <button onClick={(e) => handleSubmit(e)}>Login</button>
        </form>
      </div>
    </>
  );
}
