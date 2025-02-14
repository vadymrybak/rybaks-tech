import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import ImageIcon from "@mui/icons-material/Image";

const actions = [
  { icon: <ImageIcon />, name: "Add screenshots" },
  { icon: <CreateNewFolderIcon />, name: "Add game" },
];

export default function SpeedDialComponent() {
  return (
    <SpeedDial ariaLabel="SpeedDial basic example" sx={{ position: "absolute", bottom: 16, right: 16 }} icon={<SpeedDialIcon />}>
      {actions.map((action) => (
        <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} />
      ))}
    </SpeedDial>
  );
}
