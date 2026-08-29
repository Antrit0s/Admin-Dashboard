import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLazyLoginQuery } from "../../Store/api/authApi.ts";
import { useAppDispatch } from "../../Store/Store.ts";
import { useLocation, useNavigate } from "react-router-dom";
import { setCredentials } from "../../Store/Slices/authSlice.ts";
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// define login scheme must at least be 1 char and string 
const loginSchema = z.object({
  username: z.string().min(1, "username is required"),
  password: z.string().min(1, "password is required"),
});
type LoginFormValues = z.infer<typeof loginSchema>;
export default function Login() {
  // handle server error and password visibilty toggler
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });
  const [triggerLogin, { isLoading }] = useLazyLoginQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      const result = await triggerLogin(values).unwrap();
      if (result.length === 0) {
        setServerError("Invalid username or password");
        return;
      }
      //if user found generate token
      const user = result[0];
      const token = `token-${user.id}`;
      dispatch(setCredentials({ user, token }));
      const form =
        (location.state as { from?: Location })?.from?.pathname || "/";
      navigate(form, { replace: true });
    } catch {
      setServerError("something Went wrong. Please try agian.");
    }
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
          // header
        >
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            Sign in
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
            Enter your credentials to sign in
          </Typography>
      {/* error show to user */}
          {serverError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {serverError}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {/*  username and password fields */}
            <TextField
              label="username"
              fullWidth
              margin="normal"
              autoFocus
              {...register("username")}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
            <TextField
              label="password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      {/* password toggler button  */}
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        aria-label="toggle password visibility"
                        disabled={isLoading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ mt: 2, textTransform: "none", borderRadius: 2 }}
            >
              {isLoading ? "Signing in ..." : "Sign in"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
