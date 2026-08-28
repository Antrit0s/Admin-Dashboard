import { ArrowBack, Home, SentimentDissatisfied } from "@mui/icons-material";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 3,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 6 },
            textAlign: "center",
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "error.light",
              color: "error.dark",
              mb: 3,
            }}
          >
            {" "}
            <SentimentDissatisfied sx={{ fontSize: 44 }} />
          </Box>
          <Typography
            variant="h1"
            color="primary"
            sx={{
              fontSize: { xs: "5rem", sm: "7rem" },
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -2,
              mb: 1,
            }}
          >
            404
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
            Page Not Found
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 420, mx: "auto" }}
          >
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </Typography>
          {/* buttons to go back or go to home */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{ textTransform: "none", px: 3, borderRadius: 2 }}
            >
              Go Back
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<Home />}
              onClick={() => navigate("/")}
              sx={{ textTransform: "none", px: 3, borderRadius: 2 }}
            >
              Back to Dashboard
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
