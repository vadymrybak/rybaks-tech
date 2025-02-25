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
}

const CreateGameModal = (props: CreateGameModalProps) => {
  const [formData, setFormData] = useState({ name: "", email: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div>
      <Modal open={props.open}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Modal Title
          </Typography>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
            <TextField label="Name" variant="outlined" name="name" value={formData.name} onChange={handleChange} margin="normal" />
            <TextField label="Email" variant="outlined" name="email" value={formData.email} onChange={handleChange} margin="normal" />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Submit
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default CreateGameModal;
