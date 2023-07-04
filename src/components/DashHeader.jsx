import React, { useContext, useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../connectFB/firebase";
import { WalletContext } from "../context/WalletContextProvider";
import { signOut } from "firebase/auth";
import styled from "@emotion/styled";
import {
  AccountBox,
  ExitToApp,
  MailOutline,
  NotificationsNone,
  Pets,
} from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  InputBase,
  Badge,
  Avatar,
  MenuItem,
  Menu,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
const StyledToolbar = styled(Toolbar)({
  display: "flex",
  gap: "5%",
  justifyContent: "space-between",
});
// const Search = styled("div")(({ theme }) => ({
//   backgroundColor: "#fff",
//   padding: "0 20px",
//   borderRadius: "50px",
//   flexGrow: 1,
//   maxWidth: 800,
// }));
const Icons = styled(Box)(({ theme }) => ({
  display: "block",
  alignItems: "center",
  gap: "20px",
  
}));
const UserBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  
}));

function DashHeader() {
  const navigate = useNavigate();
  const publicKey = useContext(WalletContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  //   useEffect(() => {
  //     const checkPublicKey = async () => {
  //       signOut(auth);
  //       navigate("/");
  //     };
  //     checkPublicKey();
  //   }, [publicKey]);

  useEffect(() => {
    const checkPublicKey = async () => {
      try {
        var resolvedPublicKey = await publicKey;
        if (resolvedPublicKey) {
          console.log(resolvedPublicKey);
          const usersRef = collection(db, "users");
          const q = query(
            usersRef,
            where("publicKey", "==", resolvedPublicKey)
          );
          const querySnapshot = await getDocs(q);
          console.log(querySnapshot);
          if (querySnapshot.empty) {
            navigate("/register");
          } else {
            navigate("/login");
          }
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error(error);
      }
    };
    checkPublicKey();
  }, [publicKey]);

  return (
    <AppBar position="sticky">
      <StyledToolbar>
        <Typography variant="h6" sx={{ display: { xs: "none", sm: "block" } }}>
          <Link to={"/"}>LOGO</Link>
        </Typography>
        <Pets sx={{ display: { xs: "block", sm: "none" } }} />
        {/* <Search>
          <InputBase
            placeholder="Search..."
            style={{ width: "100%", height: 40, color: "#333" }}
            autoComplete="off"
            spellCheck="false"
          />
        </Search> */}
        <div className="bg-[#20252e] flex items-center justify-between px-2 py-3">
          <WalletMultiButton />
        </div>
        <Icons sx={{ display: { xs: "none", sm: "flex" } }}>
          <Link to="/targets">
            <Button variant="contained" color="secondary">
              Thêm mục tiêu
            </Button>
          </Link>
          <Badge badgeContent={4} color="error">
            <MailOutline />
          </Badge>
          <Badge badgeContent={4} color="error">
            <NotificationsNone />
          </Badge>
        </Icons>
        <UserBox>
          <Avatar
            id="demo-positioned-button"
            aria-controls={open ? "demo-positioned-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            sx={{ width: 30, height: 30 }}
            src="https://images.pexels.com/photos/762527/pexels-photo-762527.jpeg?auto=compress&cs=tinysrgb&w=600"
          />
          <Typography variant="span">John</Typography>
        </UserBox>
      </StyledToolbar>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <AccountBox fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Link to={"/profile"}>Profile</Link>
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </AppBar>
  );
}
export default DashHeader;
