import { observer } from "mobx-react-lite";
import Box from "@mui/material/Box";
import SpeedDialComponent from "../../components/SpeedDial.component";
import UserGames from "../../components/UserGames/UserGames.component";
import { useStores } from "../../stores/RootStore";
import CreateGameModal from "../../components/CreateGameModal/CreateGameModal";
import ScreenshotModal from "../../components/ScreenshotModal/ScreenshotModal";
import UploadInProgress from "../../components/UploadInProgress/UploadInProgress";

export const Self = observer(() => {
  const { selfPageStore, user } = useStores();

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "background.paper", display: "flex", height: "100%" }}>
      <SpeedDialComponent />
      <UserGames />
      <UploadInProgress
        gameName={selfPageStore.userGames.find((g) => g.id === selfPageStore.activeGameTab)?.name}
        amount={selfPageStore.filesAmount}
        isOpen={selfPageStore.uploadInProgress}
      />
      <CreateGameModal
        gameCreating={selfPageStore.gameCreating}
        handleGameCreate={selfPageStore.handleCreateNewGame}
        open={selfPageStore.createGameModalOpen}
        handleClose={() => {
          selfPageStore.toggleCreateGameModalOpen(false);
        }}
      />
      <ScreenshotModal
        isOpen={selfPageStore.screenshotModalOpen}
        handleClose={() => {
          selfPageStore.toggleScreenshotModalOpen(false);
        }}
        userid={user?.id}
        gameid={selfPageStore.activeGameTab}
        screenshot={selfPageStore.activeScreenshot}
      />
    </Box>
  );
});
