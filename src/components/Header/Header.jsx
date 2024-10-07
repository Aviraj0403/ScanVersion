import React, { useState, useCallback } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  useScrollTrigger,
  useTheme,
  useMediaQuery,
  InputBase,
} from "@mui/material";
import { FaUtensils } from "react-icons/fa";
import { Link } from "react-router-dom";
import CartOverview from "../../pages/cart/CartOverview";
import Username from "../../pages/user/Username";
import SearchIcon from "@mui/icons-material/Search";
import { keyframes } from "@mui/system";

const colorChange = keyframes`
  0% { color: #FB923C; }
  50% { color: #FBBF24; }
  100% { color: #987b71; }
`;

const iconHover = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const Header = ({ setSearchQuery }) => {
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 100 });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [cartOpen, setCartOpen] = useState(false);

  const handleCartToggle = useCallback(() => {
    setCartOpen((prev) => !prev);
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const appBarStyles = {
    backgroundColor: trigger ? "#004353" : "#fff",
    color: trigger ? "#fff" : "#111",
    transition: "background-color 0.3s ease, color 0.3s ease",
    zIndex: 1000,
    animation: trigger ? `${colorChange} 2s infinite` : "none",
    minHeight: '64px',
  };

  const toolbarStyles = {
    display: "flex",
    justifyContent: isMobile ? "flex-start" : "space-between",
    alignItems: "center",
    maxWidth: "1200px",
    width: "100%",
    mx: "auto",
    padding: isMobile ? '0 10px' : '0',
  };

  const inputStyles = {
    pl: 2,
    pr: 4,
    py: 0.5,
    bgcolor: "grey.100",
    borderRadius: 50,
    width: isMobile ? "100%" : "300px",
    transition: "all 0.3s ease",
    "&:hover": {
      bgcolor: "grey.200",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
    }
  };

  return (
    <>
      <AppBar position="fixed" sx={appBarStyles}>
        <Toolbar sx={toolbarStyles}>
          <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "inherit" }}>
            <FaUtensils style={{ fontSize: "2.5rem", color: trigger ? "#FBBF24" : "#FB923C" }} />
            <Box sx={{ display: "flex", flexDirection: "column", ml: 1 }}>
              <Typography variant="h6" component="h1" sx={{ fontWeight: "bold", color: trigger ? "#FBBF24" : "#FB923C" }}>
                BR Tech
              </Typography>
              <Username sx={{ mt: 0.5, fontSize: "0.75rem", color: trigger ? "#fff" : "#111" }} />
            </Box>
          </Link>

          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", mt: 1 }}>
            <InputBase
              placeholder="Search…"
              startAdornment={<SearchIcon sx={{ color: "gray", mr: 1 }} />}
              onChange={handleSearchChange}
              sx={inputStyles}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={handleCartToggle}
              aria-label="Toggle cart overview"
              sx={{
                borderRadius: "50%",
                p: 1,
                color: "inherit",
                transition: "color 0.3s ease",
                animation: `${iconHover} 0.6s ease-in-out`,
                "&:hover": { color: trigger ? "#FBBF24" : "#FB923C" },
              }}
            >
              <CartOverview />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {cartOpen && <CartOverview onClose={() => setCartOpen(false)} />}
    </>
  );
};

export default Header;
