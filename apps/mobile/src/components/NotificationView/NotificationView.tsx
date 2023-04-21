import {useState, useEffect} from 'react'
import { Toaster } from 'react-hot-toast';
import { requestPermissionAndToken, onMessageListener, useAuth, updateUserToken } from '@loophealth/api';
import { MessagePayload } from 'firebase/messaging';

export const NotificationView = () => {
  const { user } = useAuth();
  // const [notification, setNotification] = useState({title: '', body: ''});
  const [fcmToken, setFcmToken] = useState<string>("");

  useEffect(()=>{
    if (user !== null) {
      requestPermissionAndToken(setFcmToken);
    }
  },[user])

  // const notify = () =>  toast(<ToastDisplay/>); 
  // function ToastDisplay() {
  //   return (
  //     <div>
  //       <p><b>{notification?.title}</b></p>
  //       <p>{notification?.body}</p>
  //     </div>
  //   );
  // };

  // useEffect(() => {
  //   if (notification?.title ){
  //    notify()
  //   }
  // }, [notification]);

  useEffect(()=>{
    const notificationListener = async () => {
      try {
        const payload: MessagePayload = await onMessageListener();
        if(payload?.notification?.title){
          const notif = new Notification(payload?.notification?.title,{
            body: payload?.notification?.body,
            icon: 'https://global-uploads.webflow.com/619b33946e0527b5a12bec15/61f8edaecca71a1ae15ec68b_loop-logo-moss.svg'
          });
          notif.addEventListener('click', () => {
            window.open('https://elder-care-mobile.web.app');
            notif.close();
          });
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
  },[fcmToken]);

  return (
     <Toaster/>
  )
}
