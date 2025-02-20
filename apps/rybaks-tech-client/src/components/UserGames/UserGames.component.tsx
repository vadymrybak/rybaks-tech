import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import * as React from "react";
import { useStores } from "../../stores/RootStore";
import { observer } from "mobx-react-lite";
import { IUserGame } from "../../types/apiService.interfaces";
import ScreenshotList from "../ScreenshotList";

import "./UserGames.styles.scss";
import { Loader } from "../Loader/Loader";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`vertical-tabpanel-${index}`} aria-labelledby={`vertical-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const UserGames = observer(() => {
  const { selfPageStore } = useStores();

  useEffect(() => {
    selfPageStore.loadView();
  }, []);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    selfPageStore.handleTabChange(newValue);
  };

  return (
    <div className="UserGames">
      {selfPageStore.gamesLoaded ? (
        <>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={selfPageStore.activeGameTab}
            onChange={handleChange}
            sx={{ borderRight: 1, borderColor: "divider" }}
          >
            {selfPageStore.userGames.map((game: IUserGame) => {
              return <Tab key={game.id} label={game.name} value={game.id} id={game.id.toString()} />;
            })}
          </Tabs>
          {selfPageStore.screenshotsLoaded ? (
            selfPageStore.userGames.map((game: IUserGame) => {
              return (
                <TabPanel key={game.id} value={selfPageStore.activeGameTab} index={game.id}>
                  <ScreenshotList />
                </TabPanel>
              );
            })
          ) : (
            <Loader />
          )}
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
});

export default UserGames;
