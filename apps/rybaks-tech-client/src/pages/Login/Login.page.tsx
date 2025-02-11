import { observer } from "mobx-react-lite";
import { TextField, Button, Grid2, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { useStores } from "../../stores/RootStore";

export const LoginForm = observer(() => {
  const { doLogin, isLoggingIn } = useStores();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // Implement your login logic here
    console.log("Username:", username);
    console.log("Password:", password);

    doLogin(username, password);

    // Reset form fields
    setUsername("");
    setPassword("");
  };

  return (
    <Grid2 container justifyContent="center" style={{ minHeight: "100vh" }}>
      <Grid2>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Typography variant="h5" style={{ marginBottom: "20px" }}>
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField label="Username" variant="outlined" margin="normal" fullWidth value={username} onChange={(e) => setUsername(e.target.value)} required />
            <TextField label="Password" type="password" variant="outlined" margin="normal" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button loading={isLoggingIn} disabled={isLoggingIn} type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: "20px" }}>
              Login
            </Button>
          </form>
        </Paper>
      </Grid2>
    </Grid2>
  );
});
