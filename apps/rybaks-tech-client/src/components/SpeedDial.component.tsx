import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import ImageIcon from "@mui/icons-material/Image";
import { useRef } from "react";
import { useStores } from "../stores/RootStore";

const actions = [
  { icon: <ImageIcon />, name: "Add screenshots", action: "upload" },
  { icon: <CreateNewFolderIcon />, name: "Add game", action: "addGame" },
];

export default function SpeedDialComponent() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { selfPageStore } = useStores();

  const handleActionClick = (action: string) => {
    if (action === "upload") {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      console.log("Selected file:", files);
      selfPageStore.uploadScreenshots(files);
    }
  };

  return (
    <>
      <input
        type="file"
        multiple
        ref={fileInputRef}
        style={{ display: "none" }} // Hide the file input
        onChange={handleFileChange}
      />

      <SpeedDial ariaLabel="SpeedDial basic example" sx={{ position: "absolute", bottom: 16, right: 16 }} icon={<SpeedDialIcon />}>
        {actions.map((action) => (
          <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} onClick={() => handleActionClick(action.action)} />
        ))}
      </SpeedDial>
    </>
  );
}
