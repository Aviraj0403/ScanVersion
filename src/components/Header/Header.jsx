import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  useScrollTrigger,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
} from "@mui/material";
import { FaGithub, FaUtensils, FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import CartOverview from "../../pages/cart/CartOverview";
import Username from "../../pages/user/Username";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { keyframes } from "@mui/system";
// import "./Header.css"

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

const Header = () => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <AppBar
      position="fixed"
      className="header"
      sx={{
        backgroundColor: trigger ? "#004353" : "#fff",
        color: trigger ? "#fff" : "#111",
        transition: "background-color 0.3s ease, color 0.3s ease",
        zIndex: 1000,
        animation: trigger ? `${colorChange} 2s infinite` : "none",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          width: "100%",
          mx: "auto",
          p: "0.5rem",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <Link
          to="/"
          style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "inherit" }}
        >
          <FaUtensils style={{ fontSize: "2.5rem", color: trigger ? "#FBBF24" : "#FB923C" }} />
          <Box sx={{ display: "flex", flexDirection: "column", ml: 1 }}>
            <Typography variant="h6" component="h1" sx={{ fontWeight: "bold", color: trigger ? "#FBBF24" : "#FB923C" }}>
              BR Tech
            </Typography>
            <Username sx={{ mt: 0.5, fontSize: "0.75rem", color: trigger ? "#fff" : "#111" }} />
          </Box>
        </Link>

        {!isMobile && (
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              mt: 1,
            }}
          >
            <InputBase
              placeholder="Search…"
              startAdornment={<SearchIcon sx={{ color: "gray", mr: 1 }} />}
              sx={{
                pl: 2,
                pr: 4,
                py: 0.5,
                bgcolor: "grey.100",
                borderRadius: 50,
                width: "100%",
                maxWidth: 300,
                transition: "all 0.3s ease",
                "&:hover": { bgcolor: "grey.200", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" },
              }}
            />
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isMobile ? (
            <IconButton
              onClick={handleClick}
              sx={{
                borderRadius: "50%",
                p: 1,
                color: "inherit",
                transition: "color 0.3s ease",
              }}
            >
              <FaBars style={{ fontSize: "2.5rem" }} />
            </IconButton>
          ) : (
            <>
              <IconButton
                component="div"
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
              <IconButton
                component="a"
                href="https://github.com/BrTech-Restaurant/ScanVersion/"
                sx={{
                  borderRadius: "50%",
                  p: 1,
                  color: "inherit",
                  transition: "color 0.3s ease",
                  animation: `${iconHover} 0.6s ease-in-out`,
                  "&:hover": { color: trigger ? "#FBBF24" : "#FB923C" },
                }}
              >
                <FaGithub style={{ fontSize: "2.5rem" }} />
              </IconButton>
            </>
          )}
        </Box>
      </Toolbar>

      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        sx={{ mt: `var(--header-height)` }} // Adjust for the dynamic header height
      >
        <MenuItem onClick={handleClose}>
          <Link to="/cart" style={{ textDecoration: "none", color: "inherit" }}>
            Cart Overview
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link to="/profile" style={{ textDecoration: "none", color: "inherit" }}>
            Profile
          </Link>
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;
