import React, { useEffect } from "react";
import { useState } from "react";
import { Button, Box, TextField } from "@mui/material";
import DesoApi from "./libs/desoApi";
import axios from "axios";
import "./Notifications.css";
import { AiFillHeart } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { BiComment } from "react-icons/bi";
import { FaMoneyBillAlt } from "react-icons/fa";
import { RiVipDiamondFill } from "react-icons/ri";
import { FiSend } from "react-icons/fi";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
const Notification = () => {
  const [username, setUsername] = useState("");
  const [desoApi, setDesoApi] = useState(null);

  const [deneme, setDeneme] = useState([]);
  const [listPublicKeys, setListPublicKeys] = useState([]);
  const [likerInfo, setLikerInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] =useState(false);
  const [isDisabled, setIsDisabled] = useState(false)
  const deneme2 = () => {
    setListPublicKeys([1, 2, 3]);
    setLikerInfo([1, 2, 3]);
  };
  useEffect(() => {
    const da = new DesoApi();
    setDesoApi(da);
  }, []);

  const getImagesAndNames = async () => {
    console.log("liker ınfo 1", likerInfo);
    console.log(deneme2);
    await axios
      .post(
        "https://deso-get-profile-pictures.herokuapp.com/api/get-users-username-and-profile-picture",
        { ListPublicKey: listPublicKeys }
      )
      .then((res) => res.data.map((x) => likerInfo?.push(x)));
    console.log("liker ınfo 2", likerInfo);
    // setLoading(false);
  };
  const filterNotifications = async () => {
    setLoading(true);
    setOpen(true)
    const PublicKeyBase58Check = username;
    const notificationsCall = await desoApi.getNotifications(
      PublicKeyBase58Check
    );
    console.log("notificationsCall", notificationsCall);
    await notificationsCall?.Notifications.map((notification) =>
      listPublicKeys.push(
        notification?.Metadata?.TransactorPublicKeyBase58Check
      )
    );
    await getImagesAndNames();
    setDeneme(
      notificationsCall?.Notifications.map((notification, index) => {
        if (notification?.Metadata?.TxnType === "LIKE") {
          return (
            <Box sx={{ mb: 2 }}>
              <ul>
                <li key={index}>
                  <img src={likerInfo[index]?.ProfilePicture} alt="pp"></img>
                  <h3>&ensp;{likerInfo[index]?.UserName}</h3>
                  <p> &ensp;Liked your post. &ensp;</p>
                  <a
                    href={`https://diamondapp.com/posts/${notification?.Metadata?.LikeTxindexMetadata?.PostHashHex}`}
                    style={{ cursor: "pointer", textDecoration: "none" }}
                    target="blank"
                  >
                    See more...
                  </a>
                  <span style={{ color: "red" }}>
                    {" "}
                    <AiFillHeart />
                  </span>
                </li>
              </ul>
            </Box>
          );
        }
        if (notification?.Metadata?.TxnType === "DAO_COIN_TRANSFER") {
          return (
            <>
              <ul>
                <li key={index}>
                  <img src={likerInfo[index]?.ProfilePicture} alt="pp"></img>
                  <h3>&ensp;{likerInfo[index]?.UserName}</h3>{" "}
                  <p>&ensp; Transferred DAO Coins</p>
                  <span style={{ color: "#0058F7" }}>
                    <FaMoneyBillAlt />
                  </span>
                </li>
              </ul>
            </>
          );
        }
        if (notification?.Metadata?.TxnType === "FOLLOW") {
          return (
            <>
              <ul>
                <li key={index}>
                  <img src={likerInfo[index]?.ProfilePicture} alt="pp"></img>
                  <h3>&ensp;{likerInfo[index]?.UserName}</h3>{" "}
                  <p>&ensp;Followed you.</p>
                  <span style={{ color: "#3f1446" }}>
                    {" "}
                    <CgProfile />
                  </span>
                </li>
              </ul>
            </>
          );
        }
        if (notification?.Metadata?.TxnType === "BASIC_TRANSFER") {
          if (
            notification?.Metadata?.BasicTransferTxindexMetadata
              .DiamondLevel === 0
          ) {
            return (
              <>
                <ul>
                  <li key={index}>
                    <img src={likerInfo[index]?.ProfilePicture} alt="pp"></img>
                    <h3>&ensp;{likerInfo[index]?.UserName}</h3>&ensp;Sent you{" "}
                    {notification?.Metadata?.BasicTransferTxindexMetadata
                      ?.TotalInputNanos / 1000000000}
                    DESO
                    <span style={{ color: "green" }}>
                      <FaMoneyBillAlt />
                    </span>
                  </li>
                </ul>
              </>
            );
          } else {
            return (
              <>
                <ul>
                  <li key={index}>
                    <img src={likerInfo[index]?.ProfilePicture} alt="pp"></img>
                    <h3>&ensp;{likerInfo[index]?.UserName}</h3>&ensp; Sent you{" "}
                    {
                      notification?.Metadata?.BasicTransferTxindexMetadata
                        .DiamondLevel
                    }{" "}
                    Diamond
                    <span style={{ color: "#07bef5a6" }}>
                      <RiVipDiamondFill />
                    </span>
                  </li>
                </ul>
              </>
            );
          }
        }
        if (notification?.Metadata?.TxnType === "CREATOR_COIN_TRANSFER") {
          return (
            <>
              <ul>
                <li key={index}>
                  <img src={likerInfo[index]?.ProfilePicture} alt="pp"></img>
                  <h3>&ensp;{likerInfo[index]?.UserName}</h3>&ensp;Sent you
                  &ensp;
                  {notification?.Metadata?.CreatorCoinTransferTxindexMetadata
                    ?.CreatorCoinToTransferNanos / 1000000000}
                  {
                    notification?.Metadata?.CreatorCoinTransferTxindexMetadata
                      ?.CreatorUsername
                  }{" "}
                  Coins
                  <span style={{ color: "#002fa7" }}>
                    <FiSend />
                  </span>
                </li>
              </ul>
            </>
          );
        }
        if (notification?.Metadata?.TxnType === "SUBMIT_POST") {
          return (
            <>
              <ul>
                <li key={index}>
                  <img src={likerInfo[index]?.ProfilePicture} alt="pp"></img>
                  <h3>&ensp;{likerInfo[index]?.UserName}</h3>&ensp;Mentioned you
                  in a post &ensp;
                  <a
                    href={`https://diamondapp.com/posts/${notification?.Metadata?.SubmitPostTxindexMetadata?.PostHashBeingModifiedHex}`}
                    style={{ cursor: "pointer", textDecoration: "none" }}
                    target="blank"
                  >
                    See more...
                  </a>
                  <span>
                    <BiComment />
                  </span>
                </li>
              </ul>
            </>
          );
        }
        if (notification?.Metadata?.TxnType === "CREATOR_COIN") {
          return (
            <>
              <ul>
                <li key={index}>
                  <img src={likerInfo[index]?.ProfilePicture} alt="pp"></img>
                  <h3>&ensp;{likerInfo[index]?.UserName}</h3>
                  &ensp;Bought{" "}
                  {notification?.Metadata?.BasicTransferTxindexMetadata
                    ?.TotalInputNanos / 1000000000}{" "}
                  DESO from your coin
                  <span style={{ color: "green" }}>
                    <FaMoneyBillAlt />
                  </span>
                </li>
              </ul>
            </>
          );
        }
      })
    );
    setLoading(false);
    setOpen(false)
    setIsDisabled(true)
    //SUBMIT_POST CREATOR_COIN "FOLLOW" DAO_COIN_TRANSFER "LIKE" NFT_TRANSFER "BASIC_TRANSFER" COIN_TRANSFER
  };
  return (
    <div>
      <Box sx={{ mb: 2 }}>
        <TextField
          sx={{ width: "100%", mb: 2 }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          label="Get notifications of any profile using his/her public key"
        />
      </Box>
      <Box style={{display:"flex",justifyContent:"center"}}>
        <Button sx={{ mb: 2 }} variant="contained" onClick={filterNotifications} disabled={isDisabled}>
          Get notifications
        </Button></Box>


        <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>


      {!loading ? deneme : ""}
    </div>
  );
};

export default Notification;
