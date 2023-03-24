import useInput from "../../Hooks/useInput";

export default function Login({ props }: { props: any }) {
  const [username, handleUsername, resetUsername] = useInput("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // console.log(username);
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
