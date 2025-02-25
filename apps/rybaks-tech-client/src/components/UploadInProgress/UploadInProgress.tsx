import { Box, Typography } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

interface IUploadInProgressProps {
  isOpen: boolean;
  amount: number;
  gameName: string | undefined;
}

export default function UploadInProgress(props: IUploadInProgressProps) {
  return (
    <div>
      <Backdrop sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })} open={props.isOpen}>
        <Box sx={{display: "flex", gap: "10px", justifyContent: "center", alignItems: "center"}}>
        <CircularProgress color="inherit" /> <Typography>Uploading {props.amount} files in {props.gameName}...</Typography>
        </Box>
      </Backdrop>
    </div>
  );
}
