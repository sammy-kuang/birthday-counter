import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DateField, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { Component, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/en' // import locale
import { Birthday } from '../model/Birthday';
dayjs.locale('en') // use locale


interface CardProp {
    title : string,
    date : Date,
    onUpdated : (newText : string, newDate : Date) => void;
}

export class BirthdayCard extends Component<CardProp, Birthday>{
    constructor(props: CardProp) {
        super(props);
        this.state = {
            title: props.title,
            date: props.date,
        }
    }

    render() {
        const theme = createTheme({
            palette: {
                mode: "light"
            }
        });

        return (
            <div className="content">
                <div className="BirthdayCard">
                    <input type="text" className="BirthdayCardText" defaultValue={this.state.title} onChange={(event) => {
                        this.setState({ title: event.target.value })
                    }}>
                    </input>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <ThemeProvider theme={theme}>
                            <DatePicker
                                sx={{ bgcolor: 'background.paper' }}
                                value={dayjs('2004-01-01')}
                                onChange={(value) => {
                                    if (value != null) {
                                        this.setState({title: this.state.title, date: value.toDate() })
                                        console.log("observed state change")
                                        this.props.onUpdated(this.state.title,value.toDate())
                                    }
                                }}
                            ></DatePicker>
                        </ThemeProvider>
                    </LocalizationProvider>
                </div>
            </div>
        );
    }
}