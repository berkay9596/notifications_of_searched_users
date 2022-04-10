import React, { useState, useEffect } from "react";
import { Box, Grid, Stack, Button } from "@mui/material";
import DesoIdentity from "./libs/desoIdentity";

import DesoApi from "./libs/desoApi";

import Notification from "./Notification";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [publicKey, setSetPublicKey] = useState(null);
  const [desoIdentity, setDesoIdentity] = useState(null);
  const [desoApi, setDesoApi] = useState(null)
  const IdentityUsersKey = "identityUsersV2";
  useEffect(() => {
    const di = new DesoIdentity();
    setDesoIdentity(di);
    const da = new DesoApi();
    setDesoApi(da);
    console.log(desoApi)
    let user = {};
    if (localStorage.getItem(IdentityUsersKey) === "undefined") {
      user = {};
    } else if (localStorage.getItem(IdentityUsersKey)) {
      user = JSON.parse(localStorage.getItem(IdentityUsersKey) || "{}");
    }

    if (user.publicKey) {
      setLoggedIn(true);
      setSetPublicKey(user.publicKey);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async () => {
    const user = await desoIdentity.loginAsync(2);
    setSetPublicKey(user.publicKey);
    setLoggedIn(true);
  };
  const logout = async () => {
    await desoIdentity.logout(publicKey);
    setSetPublicKey(null);
    setLoggedIn(false);
  };

  return (
    <>
      <iframe
        title="desoidentity"
        id="identity"
        frameBorder="0"
        src="https://identity.deso.org/embed?v=2"
        style={{
          height: "100vh",
          width: "100vw",
          display: "none",
          position: "fixed",
          zIndex: 1000,
          left: 0,
          top: 0,
        }}
      ></iframe>
      <Grid container>
        <Grid item sm={0} lg={4}></Grid>
        <Grid
          item
          sm={12}
          lg={4}
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Stack>
            <Box sx={{ mb: 2, mt: 2 }} style={{display:"flex",justifyContent:"center"}}>
              {loggedIn ? (
                <Button variant="contained" onClick={logout}>
                  Log Out
                </Button>
              ) : (
                <Button variant="contained" onClick={login}>
                  Login
                </Button>
              )}
            </Box>
            {loggedIn ? (
              <>
                <Box sx={{ mb: 2 }}>Logged in as : {publicKey}</Box>

                <Notification />
              </>
            ) : null}
          </Stack>
        </Grid>
    
      </Grid>
    </>
  );
}

export default App;
