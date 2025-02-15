import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { useEffect } from "react";
import * as React from "react";
import { useStores } from "../stores/RootStore";
import { observer } from "mobx-react-lite";
import { IUserGame } from "../types/apiService.interfaces";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`vertical-tabpanel-${index}`} aria-labelledby={`vertical-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const UserGames = observer(() => {
  const { selfPageStore } = useStores();

  useEffect(() => {
    selfPageStore.getUserGames();
  }, []);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    console.log("handleChange", newValue);
  };

  return (
    selfPageStore.gamesLoaded && (
      <>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={selfPageStore.activeGameTab}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: "divider" }}
        >
          {selfPageStore.userGames.map((game: IUserGame) => {
            return <Tab key={game.id} label={game.name} {...a11yProps(game.id)} />;
          })}
        </Tabs>
        {selfPageStore.userGames.map((game: IUserGame) => {
          return (
            <TabPanel key={game.id} value={selfPageStore.activeGameTab} index={game.id}>
              {game.name}
            </TabPanel>
          );
        })}
      </>
    )
  );
});

export default UserGames;
