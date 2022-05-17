import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';


export class TimeInput extends Component {
    value = new Date()
    state = {
        time_text: "",
        is_show: false
    };
    constructor(props) {
        super(props);
        this.value = props.value;
        this.state.time_text = this.time_to_str(this.value);
    }
    time_to_str(date) {
        return ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
    }
    onDateChange = (event, selectedDate) => {
        selectedDate.setSeconds(0);
        this.value = selectedDate;
        this.setState({ time_text: this.time_to_str(this.value) });
        this.setState({ is_show: false });
        if (this.props.onChange) {
            this.props.onChange(selectedDate);
        }
    };
    onPress = () => {
        this.setState({ is_show: true });
    }
    render = () => {
        return (
            <View style={this.props.style}>
                <TouchableOpacity onPress={this.onPress}>
                    <Text style={this.props.style}>{this.state.time_text}</Text>
                </TouchableOpacity>
                {this.state.is_show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={this.value}
                        mode="time"
                        is24Hour={true}
                        onChange={this.onDateChange}
                    />
                )}</View>
        );
    };
}