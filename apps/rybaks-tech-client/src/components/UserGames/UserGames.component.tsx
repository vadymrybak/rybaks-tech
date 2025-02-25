import { Avatar, Box, Drawer, List, ListItem, ListItemButton, ListItemText, Tooltip } from "@mui/material";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStores } from "../../stores/RootStore";
import { IUserGame } from "../../types/apiService.interfaces";
import ScreenshotList from "../ScreenshotList";
import { Loader } from "../Loader/Loader";

import "./UserGames.styles.scss";

const drawerWidth = 80;

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
                    <Tooltip title={game.name} placement="right" enterDelay={500}>
                    <ListItemText
                      sx={{ display: "flex", justifyContent: "center" }}
                      primary={
                        game.icon ? (
                          <Avatar className="imageIcon" sx={{ width: 56, height: 56 }} alt={game.name} variant="rounded" src={`data:image/jpeg;base64,${game.icon}`} />
                        ) : (
                          game.name
                        )
                      }
                    />
                    </Tooltip>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", p: 0 }}>
            {selfPageStore.gamesLoaded ? <ScreenshotList /> : <Loader />}
          </Box>
        </>
      ) : (
        <Loader />
      )}
    </Box>
  );
});

export default UserGames;
