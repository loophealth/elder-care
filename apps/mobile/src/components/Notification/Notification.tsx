import React, {useState, useEffect} from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { requestPermissionAndToken, onMessageListener, useAuth, updateUserToken } from '@loophealth/api';
import { MessagePayload } from 'firebase/messaging';

export const Notification = () => {
  const { user } = useAuth();
  const [notification, setNotification] = useState({title: '', body: ''});
  const [fcmToken, setFcmToken] = useState<string>("");

  useEffect(()=>{
    if (user !== null) {
      requestPermissionAndToken(setFcmToken);
    }
  },[user])

  const notify = () =>  toast(<ToastDisplay/>); 
  function ToastDisplay() {
    return (
      <div>
        <p><b>{notification?.title}</b></p>
        <p>{notification?.body}</p>
      </div>
    );
  };

  useEffect(() => {
    if (notification?.title ){
     notify()
    }
  }, [notification]);

  useEffect(()=>{
    if(fcmToken){
      updateUserToken(user?.phoneNumber || "", fcmToken);
      onMessageListener()
      .then((payload: MessagePayload) => {
          console.log("Notification Received => ", payload);
          setNotification({title: payload?.notification?.title || "", body: payload?.notification?.body || ""});
      })
      .catch((err) => console.log('failed: ', err));
    }
  },[fcmToken]);

  return (
     <Toaster/>
  )
}
