import { observer } from "mobx-react-lite";
import { TextField, Button, Grid2, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { useStores } from "../../stores/RootStore";
import "./Login.page.scss";

export const LoginForm = observer(() => {
  const { doLogin, isLoggingIn } = useStores();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: any) => {
    event.preventDefault();

    doLogin(username, password);
  };

  return (
    <div className="loginPage">
      <Grid2 container justifyContent="center" alignContent={"center"}>
        <Grid2>
          <Paper elevation={3} style={{ padding: "20px" }}>
            <Typography variant="h5" style={{ marginBottom: "20px" }}>
              Вход
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField disabled={isLoggingIn} label="Логин" variant="outlined" margin="normal" fullWidth value={username} onChange={(e) => setUsername(e.target.value)} required />
              <TextField disabled={isLoggingIn} label="Пароль" type="password" variant="outlined" margin="normal" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} required />
              <Button loading={isLoggingIn} disabled={isLoggingIn} type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: "20px" }}>
                Войти
              </Button>
            </form>
          </Paper>
        </Grid2>
      </Grid2>
    </div>
  );
});
