import React, { Component } from 'react';
import { BirthdayCard } from './BirthdayCard';
import dayjs from 'dayjs';
import { formatDuration, intervalToDuration, isAfter, isBefore, isValid } from 'date-fns'
import { Birthday } from '../model/Birthday';

interface List {
    cards: Birthday[];
}

export class CardList extends Component<{}, List> {
    constructor(props: List) {
        super(props);
        this.state = {
            cards: []
        };
    }

    addBlankCard() {
        const n : Birthday = {title: "New", date : dayjs('2004-01-01').toDate()};
        this.setState((prevState) => ({cards: [...prevState.cards, n]}))
    }

    onCardChange(index: number, newTitle: string, newDate: Date) {
        const newState = this.state.cards;
        newState[index] = {title: newTitle, date : newDate};
        this.setState(({cards: newState}));
    }

    calculateTimeBirthday() {
        if (this.state.cards.length < 1)
            return "n/a";

        var n: Birthday = this.state.cards[0];
        var d: Date = n.date;
        var now: Date = new Date(Date.now());
        var next = new Date(now.getFullYear(), d.getMonth(), d.getDate());

        if (isBefore(next, now)) {
            next.setFullYear(now.getFullYear() + 1);
        }

        return next.toString();
    }

    render() {
        return (
            <div>
                <header className="App-header">
                    Birthday Countdown Tool
                </header>

                <header className="Subheader">
                    Days until next birthday: {this.calculateTimeBirthday()}
                </header>


                {this.state.cards.map((card, idx) => (
                    <div>
                        <BirthdayCard title={card.title} date={card.date} onUpdated={(newTitle, newDate) => { this.onCardChange(idx, newTitle, newDate) }}></BirthdayCard>
                    </div>
                ))};

                <div className="content">
                    <button className="BirthdayCardButton" onClick={() => { this.addBlankCard() }}>
                        <p className="BirthdayCardText">Add new birthday</p>
                    </button>
                </div>

            </div>
        );
    }
}
