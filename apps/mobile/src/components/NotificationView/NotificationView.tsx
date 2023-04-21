import {useState, useEffect} from 'react'
import { Toaster } from 'react-hot-toast';
import { requestPermissionAndToken, onMessageListener, useAuth, updateUserToken } from '@loophealth/api';
import { MessagePayload } from 'firebase/messaging';

export const NotificationView = () => {
  const { user } = useAuth();
  const [fcmToken, setFcmToken] = useState<string>("");

  useEffect(()=>{
    if (user !== null) {
      requestPermissionAndToken(setFcmToken);
    }
  },[user])

  useEffect(()=>{
    const notificationListener = async () => {
      try {
        const payload: MessagePayload = await onMessageListener();
        if(payload?.notification && payload?.notification?.title){
          const {title, body} = payload?.notification;
            const notificationOptions = {
              body: body,
              icon: 'https://global-uploads.webflow.com/619b33946e0527b5a12bec15/61f8edaecca71a1ae15ec68b_loop-logo-moss.svg',
              actions: [{action:'ok', title: 'Done'},{action:'dismiss', title: 'Dismiss'}]
            }
            if ("serviceWorker" in navigator) {
              navigator.serviceWorker.getRegistrations().then(registration => {
                //here is where we're trigerring the handler with the receieved
                // title and options from the payload
                registration[0].showNotification(title, notificationOptions);
              });
            }
        }
      } catch(err) {
        console.log('onMessageListener error: ', err)
      }
    }
    
    if(fcmToken){
      updateUserToken(user?.phoneNumber || "", fcmToken);
      notificationListener();
    }
    return () => {

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[fcmToken]);

  return (
     <Toaster/>
  )
}
