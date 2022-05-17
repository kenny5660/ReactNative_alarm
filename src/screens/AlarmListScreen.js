import React, { Component } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { AlarmListItem } from '../components/AlarmListItem';
import { Button, ScrollView, Text, Switch, Alert } from 'react-native';
import { AlarmItem, AlarmStorage } from '../AlarmStorage';
import RadioPlayer, { RadioPlayerEvents, RadioPlayerMetadata, } from 'react-native-radio-player';
import { Picker } from '@react-native-picker/picker';


export class AlarmListScreen extends Component {
    state = {
        list: [
            { id: 0, time: new Date(), is_active: true },
            { id: 1, time: new Date(2011, 5, 1, 8, 30, 0, 0), is_active: false },
            { id: 2, time: new Date(), is_active: false }
        ],
        isLoading: false,
    };
    alarmStorage = new AlarmStorage();
    constructor(props) {
        super(props);
        this.alarmStorage.GetAlarmList(this.run_alarm).then((val) => {
            this.setState({ list: val });
        });
        console.log("this.state.list " + this.state.list);
    }

    run_alarm = (alarm) => {
        const radio_stations = {
            techno: "https://str.pcradio.ru/deep_voc_house-hi",
            classic: "https://str.pcradio.ru/one_ottoclassic-hi",
            hiphop: "https://str.pcradio.ru/delta_hiphop-hi"
        }
        RadioPlayer.radioURLWithMetadataSeparator(radio_stations[alarm.radioStation], "-");
        RadioPlayer.play();

        Alert.alert(
            "Alarm running",
            `Alarm at ${alarm.time_to_str()}`,
            [
                {
                    text: "Ok",
                    onPress: () => RadioPlayer.stop(),
                    style: "default",
                },
            ],
            {
                cancelable: false,
                onDismiss: () =>
                    RadioPlayer.stop(),
            }
        );
    }

    onItemChange = (item) => {
        item.updateSchedulers();
        this.alarmStorage.UpdateAlarm(item.id, item);

    };
    onItemRemove = async (item) => {

        console.log("Remove " + item.id);
        item.is_active = false;
        item.updateSchedulers();
        await this.alarmStorage.RemoveAlarm(item.id);
        this.setState({ list: await this.alarmStorage.GetAlarmList(this.run_alarm) });
    };
    _updateList = async () => {
        this.setState({ list: await this.alarmStorage.GetAlarmList(this.run_alarm) });
    }

    //keyExtractor = (item) => item.time.getTime();
    keyExtractor = (item) => item.id;
    renderItem = ({ item }) => {
        return (
            <AlarmListItem
                onChange={this.onItemChange}
                onRemove={this.onItemRemove}
                alarm_data={item}
            />
        );
    };
    _AddButtonOnPress = async () => {
        await this.alarmStorage.AddAlarm(new AlarmItem(new Date(Date.now() + (10 * 1000)), false, null, this.run_alarm));
        this._updateList()
    }

    render = () => {
        const { isLoading, list } = this.state;

        return (
            <View style={styles.container}>
                <FlatList
                    data={list}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                />
                <Button onPress={this._AddButtonOnPress} title="Add new alarm" accessibilityLabel="Tap on Me" />
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});