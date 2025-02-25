import React, { useState } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";

// Styles for the modal
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

interface CreateGameModalProps {
  open: boolean;
  gameCreating: boolean;
  handleClose: () => void;
  handleGameCreate: (gameName: string, base64icon: string) => void;
}

const CreateGameModal = (props: CreateGameModalProps) => {
  const [formData, setFormData] = useState({ gameName: "", base64icon: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormData({ base64icon: "", gameName: "" });
    props.handleGameCreate(formData.gameName, formData.base64icon);
  };

  return (
    <div>
      <Modal open={props.open} onClose={props.handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Добавить новую игру
          </Typography>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
            <TextField
              autoComplete="off"
              label="Название игры"
              variant="outlined"
              name="gameName"
              value={formData.gameName}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              multiline
              maxRows={5}
              autoComplete="off"
              label="Base64 иконка"
              variant="outlined"
              name="base64icon"
              value={formData.base64icon}
              onChange={handleChange}
              margin="normal"
            />
            <Button
              loading={props.gameCreating}
              disabled={props.gameCreating || formData.base64icon.length === 0 || formData.gameName.length === 0}
              type="submit"
              variant="contained"
              sx={{ mt: 2 }}
            >
              Создать
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default CreateGameModal;
