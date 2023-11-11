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
    title: string,
    date: Date,
    onUpdated: (newText: string, newDate: Date) => void;
    onDelete: () => void;
}

export class BirthdayCard extends Component<CardProp, Birthday>{

    public static STARTING_DATE: dayjs.Dayjs = dayjs('2004-06-17')

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
                    <input type="text" className="BirthdayCardText" defaultValue={"New"} onChange={(event) => {
                        this.setState((prevState) => ({ title: event.target.value, date: prevState.date }))
                        console.log(event.target.value, this.state.title)
                        this.props.onUpdated(event.target.value, this.state.date)
                    }}>
                    </input>
                    <div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <ThemeProvider theme={theme}>
                                <DatePicker
                                    sx={{ bgcolor: 'background.paper' }}
                                    value={BirthdayCard.STARTING_DATE}
                                    onChange={(value) => {
                                        if (value != null) {
                                            this.setState({ title: this.state.title, date: value.toDate() })
                                            this.props.onUpdated(this.state.title, value.toDate())
                                        }
                                    }}
                                ></DatePicker>
                            </ThemeProvider>
                        </LocalizationProvider>
                        <button onClick={() => this.props.onDelete()}>x</button>
                    </div>
                </div>
            </div>
        );
    }
}