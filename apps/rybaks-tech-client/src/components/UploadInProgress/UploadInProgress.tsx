import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

interface IUploadInProgressProps {
  isOpen: boolean;
}

export default function UploadInProgress(props: IUploadInProgressProps) {
  return (
    <div>
      <Backdrop sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })} open={props.isOpen}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
