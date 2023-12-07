import React, { useEffect, useRef, useState } from 'react'

import {selectAppState,} from "../store/slices/AppSlice";
import { useAppDispatch, useAppSelector } from '../store/storeHooks';
import Peer from "simple-peer";

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

  const leaveCall = () => {
    setCallEnded(true);
    window.location.reload();
  };

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
    <>
    <div>VideoCallView</div>
    <div>
    <div>
      {UserVideo}
      {PartnerVideo}
    </div>
    <div>
        <button onClick={callPeer}>Call</button>
    </div>
    <div>
      {incomingCall}
    </div>
  </div>
  </>
  )
}

export default VideoCallView