import PushNotification from 'react-native-push-notification';

export default class NotificationService {
  //onNotificaitn is a function passed in that is to be called when a
  //notification is to be emitted.
  constructor(onNotification) {
    this.configure(onNotification);
    this.lastId = 0;
    PushNotification.createChannel(
      {
        channelId: "default-channel-id", // (required)
        channelName: `Default channel`, // (required)
        channelDescription: "A default channel", // (optional) default: undefined.
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      (created) => console.log(`createChannel 'default-channel-id' returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }

  configure(onNotification) {
    PushNotification.configure({
      onNotification: onNotification,

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },

      popInitialNotification: true,
    });
  }

  //Appears right away 
  localNotification(title = "test", message = "test") {
    this.lastId++;
    PushNotification.localNotification({
      channelId: "default-channel-id",
      title: title,
      message: message,
      playSound: false,
      soundName: 'default'
    });
  }

  //Appears after a specified time. App does not have to be open.
  AddScheduleNotification(obj) {
    this.lastId++;
    obj.id = this.lastId;
    PushNotification.localNotificationSchedule(obj);
    return this.lastId;
  }
  cancelScheduleNotification(notifId) {
    console.log("cancelNotifi " + notifId);
    PushNotification.cancelLocalNotification('' + notifId);
  }

  checkPermission(cbk) {
    return PushNotification.checkPermissions(cbk);
  }

  cancelNotif() {
    PushNotification.cancelLocalNotifications({ id: '' + this.lastId });
  }

  cancelAll() {
    PushNotification.cancelAllLocalNotifications();
  }
}

export let notificationService = new NotificationService();