import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { IScreenshot } from "../../types/apiService.interfaces";

const style = {
  position: "relative",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  bgcolor: "transparent",
  boxShadow: 24,
};

interface IScreenshotModalProps {
  isOpen: boolean;
  screenshot: IScreenshot | null;
  handleClose: () => void;
}

export default function ScreenshotModal(props: IScreenshotModalProps) {
  return (
    <div>
      <Modal open={props.isOpen} onClose={props.handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <img style={{ width: "95%" }} src={`https://app-screenshots.s3.cloud.ru/26-screenhots/1/${props.screenshot?.filename}`} />
        </Box>
      </Modal>
    </div>
  );
}
