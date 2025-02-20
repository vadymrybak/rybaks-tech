import { Box, Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStores } from "../../stores/RootStore";
import { IUserGame } from "../../types/apiService.interfaces";
import ScreenshotList from "../ScreenshotList";
import { Loader } from "../Loader/Loader";

import "./UserGames.styles.scss";

const drawerWidth = 200;

const UserGames = observer(() => {
  const { selfPageStore } = useStores();

  useEffect(() => {
    selfPageStore.loadView();
  }, []);

  return (
    <Box className="UserGames">
      {selfPageStore.gamesLoaded ? (
        <>
          <Drawer
            className="drawer"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
              },
            }}
            variant="permanent"
            anchor="left"
          >
            <List>
              {selfPageStore.userGames.map((game: IUserGame) => (
                <ListItem key={game.id} disablePadding>
                  <ListItemButton
                    selected={selfPageStore.activeGameTab === game.id}
                    onClick={() => {
                      selfPageStore.handleTabChange(game.id);
                    }}
                  >
                    <ListItemText sx={{ textAlign: "center" }} primary={game.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", p: 0 }}>
            {selfPageStore.screenshotsLoaded ? <ScreenshotList /> : <Loader />}
          </Box>
        </>
      ) : (
        <Loader />
      )}
    </Box>
  );
});

export default UserGames;
