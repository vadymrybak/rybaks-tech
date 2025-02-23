import { observer } from "mobx-react-lite";
import Box from "@mui/material/Box";
import SpeedDialComponent from "../../components/SpeedDial.component";
import UserGames from "../../components/UserGames/UserGames.component";
import { useStores } from "../../stores/RootStore";
import CreateGameModal from "../../components/CreateGameModal/CreateGameModal";
import ScreenshotModal from "../../components/ScreenshotModal/ScreenshotModal";
import UploadInProgress from "../../components/UploadInProgress/UploadInProgress";

export const Self = observer(() => {
  const { selfPageStore } = useStores();

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "background.paper", display: "flex", height: "100%" }}>
      <SpeedDialComponent />
      <UserGames />
      <CreateGameModal open={selfPageStore.createGameModalOpen} />
      <UploadInProgress isOpen={selfPageStore.uploadInProgress} />
      <ScreenshotModal
        isOpen={selfPageStore.screenshotModalOpen}
        handleClose={() => {
          selfPageStore.toggleScreenshotModalOpen(false);
        }}
        screenshot={selfPageStore.activeScreenshot}
      />
    </Box>
  );
});
