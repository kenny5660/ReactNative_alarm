import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Image, Text, View, Switch, Button } from 'react-native';
import { TimeInput } from '../components/TimeInput';
import Icon from 'react-native-ico-material-design';
import { Picker as SelectPicker } from '@react-native-picker/picker';

export class AlarmListItem extends Component {
    state = {
        is_active: this.props.alarm_data.is_active,
        selectedRadio: this.props.alarm_data.radioStation
    };

    onTimeChange = (selectedDate) => {
        this.props.alarm_data.time = selectedDate;
        if (this.props.onChange) {
            this.props.onChange(this.props.alarm_data);
        }
    };
    onActiveChange = (event) => {
        console.log(this.state.is_active);
        this.props.alarm_data.is_active = !this.state.is_active;
        this.setState({ is_active: !this.state.is_active });
        if (this.props.onChange) {
            this.props.onChange(this.props.alarm_data);
        }
    };
    onPickerChange = (itemValue, itemIndex) => {
        this.setState({ selectedRadio: itemValue });
        this.props.alarm_data.radioStation = itemValue;
        if (this.props.onChange) {
            this.props.onChange(this.props.alarm_data);
        }
    }
    onRemove = (event) => {
        console.log("remove");
        if (this.props.onRemove) {
            this.props.onRemove(this.props.alarm_data);
        }
    }
    render = () => {
        return (
            <View style={styles.container}>
                <TimeInput
                    style={styles.alarm_time_text}
                    value={this.props.alarm_data.time}
                    onChange={this.onTimeChange}
                />
                <View style={styles.picker}>
                    <SelectPicker
                        mode="dialog"
                        selectedValue={this.state.selectedRadio}
                        onValueChange={this.onPickerChange}>
                        <SelectPicker.Item label="Techno" value="techno" />
                        <SelectPicker.Item label="Classic" value="classic" />
                        <SelectPicker.Item label="Hiphop" value="hiphop" />
                    </SelectPicker>

                </View>

                <View style={styles.switch}>
                    <Switch
                        style={styles.switch}
                        value={this.state.is_active}
                        onValueChange={this.onActiveChange}
                    />
                </View>

                <TouchableOpacity onPress={this.onRemove}>
                    <Icon name="rubbish-bin-delete-button" />
                </TouchableOpacity>
            </View >
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 15,
        borderBottomColor: '#b0b0b0',
        borderBottomWidth: 0.4,
    },
    alarm_time_text: {
        fontSize: 25,
    },
    switch: {
        flex: 1,
        marginRight: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    picker: {
        flex: 1,
        //height: 50,
        //width: 100,
        //alignItems: 'center',
        //justifyContent: 'center',
    },
});