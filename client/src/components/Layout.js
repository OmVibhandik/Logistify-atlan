import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Logistics Platform
          </Typography>
          {isAuthenticated ? (
            <>
              <Typography variant="body1" sx={{ mr: 2 }}>
                Welcome, {user.name} ({user.role})
              </Typography>

              {user.role === "user" && (
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/user-dashboard"
                >
                  Dashboard
                </Button>
              )}
              {user.role === "driver" && (
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/driver-dashboard"
                >
                  Dashboard
                </Button>
              )}
              {user.role === "user" && (
                <Button color="inherit" component={RouterLink} to="/book">
                  New Booking
                </Button>
              )}
              {user.role === "admin" && (
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/admin-dashboard"
                >
                  Admin Dashboard
                </Button>
              )}
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
              <Button color="inherit" component={RouterLink} to="/register">
                Register
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/admin-register"
              >
                Admin Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container
        component="main"
        maxWidth="lg"
        sx={{ mt: 4, mb: 4, flexGrow: 1 }}
      >
        {children}
      </Container>
      <Box
        component="footer"
        sx={{ py: 3, px: 2, mt: "auto", backgroundColor: "background.paper" }}
      >
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Logistics Platform. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;