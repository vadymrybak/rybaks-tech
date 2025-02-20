import { Box, CircularProgress } from "@mui/material";

export const Loader = () => {
  return (
    <Box
      className="loader"
      sx={{
        width: "100%", // Set width to 100%
        p: 2, // Optional: Add padding
      }}
    >
      <CircularProgress />
    </Box>
  );
};
