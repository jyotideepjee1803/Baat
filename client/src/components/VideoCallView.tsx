import React, { useEffect, useRef, useState } from 'react'
import { Button, Container, Grid, Paper, Typography, } from '@mui/material';
import {selectAppState} from "../store/slices/AppSlice";
import { useAppDispatch, useAppSelector } from '../store/storeHooks';
import Peer from "simple-peer";
import { Phone, PhoneDisabled } from '@mui/icons-material';

function VideoCallView() {

  const { loggedInUser, selectedCall, clientSocket} = useAppSelector(selectAppState);
  const [stream, setStream] = useState<MediaStream>();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState("");
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const userVideo = useRef<HTMLVideoElement>(null);
  const partnerVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // dispatch(
    //   setClientSocket(io(SOCKET_ENDPOINT, { transports: ["websocket"] }) as any)
    // );
    newCallSocketEventHandler();
  }, []);

  //Socket event handlers 
  const newCallSocketEventHandler = () =>{
    navigator.mediaDevices.getUserMedia({video : true, audio : true}).then(stream=>{
      setStream(stream);
      if(userVideo.current){
        userVideo.current.srcObject = stream;
      }
    })

    clientSocket.off("hey")
    .on("hey", (data : any) => {
        setReceivingCall(true);
        setCaller(data.from);
        setCallerSignal(data.signal);
      })
  }

  // useEffect(()=>{
  //   if(!clientSocket) return;

  //   if (!isSocketConnected && clientSocket) {
  //     clientSocket.emit("init_user", loggedInUser?._id);
  //     clientSocket.on("user_connected", () => {
  //       // console.log("socket connected");
  //       dispatch(setSocketConnected(true));
  //     });
  //   }

  //   newCallSocketEventHandler();
  // })

  function callPeer() {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", data => {
      clientSocket.emit("callUser", { userToCall: selectedCall?._id, signalData: data, from: loggedInUser?._id })
    })

    peer.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    clientSocket.on("callAccepted", (signal : any) => {
      setCallAccepted(true);
      peer.signal(signal);
    })

    clientSocket.on("callEnded",()=>{
      console.log("call-ended");
      setCallEnded(true);
      // window.location.reload();
    })
  }

  function acceptCall() {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", data => {
      clientSocket.emit("acceptCall", { signal: data, to: caller })
    })

    peer.on("stream", stream => {
      if(partnerVideo.current){
        partnerVideo.current.srcObject = stream;
      }
    });

    peer.signal(callerSignal);
  }

  function leaveCall(){
    setCallEnded(true);
    clientSocket.emit("endCall", {to: caller })
    window.location.reload();
  }

  let UserVideo;
  if (stream) {
    UserVideo = (
      <video style={{width: 100, height: 100}} playsInline ref={userVideo} autoPlay />
    );
  }

  let PartnerVideo;
  if (callAccepted) {
    PartnerVideo = (
      <video style={{width: 100, height: 100}} playsInline ref={partnerVideo} autoPlay />
    );
  }

  let incomingCall;
  if (receivingCall) {
    incomingCall = (
      <div>
        <h1>{caller} is calling you</h1>
        <button onClick={acceptCall}>Accept</button>
      </div>
    )
  }

  return (
    <div className='`chatpageDiv chatpageView col flex-column p-2 user-select-none'>
    <div className="flex flex-col justify-between w-full h-screen p-1">
     <div className={`grid grid-cols-$2 grid-rows-1 gap-1 flex-1`}>
      {stream && (
            <video style={{width :'300px'}} playsInline muted ref={userVideo} autoPlay />
      )}
      {callAccepted && !callEnded && (
            <video style={{width :'300px'}} playsInline ref={partnerVideo} autoPlay/>
      )}
    </div>
    <div style={{display: 'flex', flexDirection :'column', justifyContent: 'center', alignItems: 'center'}}>
        <form style={{display: 'flex',flexDirection: 'column',alignItems:'center'}} noValidate autoComplete="off">
          {callAccepted && !callEnded ? (
            <Button variant="contained" color="secondary" startIcon={<PhoneDisabled fontSize="large" />} fullWidth onClick={leaveCall} sx={{marginTop :20, alignSelf:'center'}}>
              Hang Up
            </Button>
          ) : (
            <Button variant="contained" color="primary" startIcon={<Phone fontSize="large" />} fullWidth onClick={callPeer} sx={{marginTop :20, alignSelf:'center'}}>
              Call
            </Button>
          )}
        </form>
        {receivingCall && !callAccepted && (
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <h1>{caller} is calling:</h1>
          <Button variant="contained" color="primary" onClick={acceptCall}>
              Answer
          </Button>
          </div>
        )}
    </div>
    </div>
    </div>
  )
}

export default VideoCallView