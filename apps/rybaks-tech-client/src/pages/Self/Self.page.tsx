import { observer } from "mobx-react-lite";
import Box from "@mui/material/Box";
import SpeedDialComponent from "../../components/SpeedDial.component";
import UserGames from "../../components/UserGames/UserGames.component";
// import { useStores } from "../../stores/RootStore";

export const Self = observer(() => {
  // const { appLoaded, user } = useStores();
  
  return (
    <Box sx={{ flexGrow: 1, bgcolor: "background.paper", display: "flex", height: "90vh" }}>
      <SpeedDialComponent />
      <UserGames />
    </Box>
  );
});
