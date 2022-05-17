import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { notificationService } from './NotificationService';
import BackgroundTimer from 'react-native-background-timer';
export class AlarmItem {
    id;
    time;
    is_active;
    radioStation;
    notifId;
    timerId;
    onAlarmRun;
    constructor(time, is_active, id = null, onAlarmRun = null, radioStation = "techno") {
        if (id === null) {
            this.id = uuidv4();
        }
        else {
            this.id = id;
        }
        this.notifId = null;
        this.timerId = null;
        this.time = time;
        this.is_active = is_active;
        this.onAlarmRun = onAlarmRun;
        this.radioStation = radioStation;
    }
    print() {
        console.log(`id: ${this.id}  time: ${this.time} is_active: ${this.is_active}`);
    }
    time_to_str() {
        return ("0" + this.time.getHours()).slice(-2) + ":" + ("0" + this.time.getMinutes()).slice(-2);
    }
    addNotification() {
        if (this.todayTime() < Date.now()) {
            return;
        }
        console.log("addAlarmNotification " + this.todayTime());

        this.notifId = notificationService.AddScheduleNotification({
            channelId: "default-channel-id",
            date: this.todayTime(),
            title: `Alarm runnig`,
            message: `Alarm at ${this.time_to_str()}`,
            playSound: true,
            soundName: 'default',
        });
    }
    cancelNotification() {
        if (this.notifId) {
            notificationService.cancelScheduleNotification(this.notifId);
        }
    }
    todayTime() {
        let today = new Date();
        today.setHours(this.time.getHours());
        today.setMinutes(this.time.getMinutes());
        today.setSeconds(this.time.getSeconds());
        return today;
    }
    updateSchedulers() {
        if (this.is_active) {

            if (this.onAlarmRun && this.todayTime() >= Date.now()) {
                console.log("addTimer " + (this.todayTime() - Date.now()));
                this.timerId = BackgroundTimer.setTimeout(() => {
                    this.onAlarmRun(this);
                }, this.todayTime() - Date.now());
            }
            this.cancelNotification();
            this.addNotification();
        }
        else {
            this.cancelNotification();
            if (this.timerId) {
                BackgroundTimer.clearInterval(this.timerId);
            }

        }
    }
}

export class AlarmStorage {
    id_prefix = "AlarmStorage";
    storageId(id) {
        return `${this.id_prefix}-${id}`
    }

    async AddAlarm(item) {
        const jsonValue = JSON.stringify(item);
        await AsyncStorage.setItem(this.storageId(item.id), jsonValue);

    };
    async RemoveAlarm(id) {
        AsyncStorage.removeItem(this.storageId(id));
    };
    async UpdateAlarm(id, item) {
        console.log("UpdateAlarm");
        item.print();
        this.RemoveAlarm(id);
        this.AddAlarm(item);
    };
    async GetAlarmList(onAlarmRun) {
        allKeys = await AsyncStorage.getAllKeys();

        alarmStorageKeys = allKeys.filter(word => word.startsWith(`${this.id_prefix}`));

        alarmList = [];
        for (let elem of alarmStorageKeys) {
            jsonValue = await AsyncStorage.getItem(elem);
            jsonValue = JSON.parse(jsonValue);
            alarmList.push(new AlarmItem(new Date(jsonValue.time), jsonValue.is_active, jsonValue.id, onAlarmRun, jsonValue.radioStation));
        }
        alarmList = alarmList.sort(function (a, b) {
            return a.time - b.time;
        });
        for (let elem of alarmList) {
            elem.print();
        }
        return alarmList;
    }

}