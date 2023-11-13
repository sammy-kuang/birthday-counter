import React, { Component } from 'react';
import { BirthdayCard } from './BirthdayCard';
// import dayjs from 'dayjs';
import { formatDuration, intervalToDuration, isBefore } from 'date-fns'
import { Birthday, loadBirthdays, serializeBirthdays } from '../model/Birthday';

interface CardListState {
    cards: Birthday[];
    nextBirthdayIdx: number;
}

export class CardList extends Component<{}, CardListState> {
    private timer: NodeJS.Timeout | undefined; // represent the timer for updating the view every second
    private interval: number = 500; // every half second

    constructor(props: CardListState) {
        super(props);

        var loadStorage = localStorage.getItem("birthdays")
        var arr : Birthday[] = loadStorage ? loadBirthdays(loadStorage) : []

        this.state = {
            cards: arr,
            nextBirthdayIdx: 0
        };

        this.getNextBirthday.bind(this)
    }

    componentDidMount(): void {
        this.timer = setInterval(() => {
            this.setState((prevState) => ({ cards: prevState.cards, nextBirthdayIdx: this.getNextBirthday() }))
        }, this.interval);
    }

    componentWillUnmount(): void {
        if (this.timer) {
            clearInterval(this.timer)
        }
    }

    updateState(newState : CardListState) {
        this.setState(newState)
        // serialize into localStorage
        localStorage.setItem("birthdays", serializeBirthdays(newState.cards))
    }

    addBlankCard() {
        const n: Birthday = { title: "New", date: BirthdayCard.STARTING_DATE.toDate() };
        // this.setState((prevState) => ({ cards: [...prevState.cards, n], nextBirthdayIdx: prevState.nextBirthdayIdx }))
        this.updateState({cards: [...this.state.cards, n], nextBirthdayIdx: this.state.nextBirthdayIdx})
    }

    onCardChange(index: number, newTitle: string, newDate: Date) {
        const newState = this.state.cards;
        newState[index] = { title: newTitle, date: newDate };
        // this.setState((prevState) => ({ cards: newState, nextBirthdayIdx: prevState.nextBirthdayIdx }));
        this.updateState({ cards: newState, nextBirthdayIdx: this.state.nextBirthdayIdx })
    }

    generateDateAfterNow(monthInd : number, day : number) {
        var now : Date = new Date(Date.now());
        var out : Date = new Date(now.getFullYear(), monthInd, day);

        if (isBefore(out, now)) {
            out.setFullYear(now.getFullYear() + 1);
        }

        return out;
    } 

    getNextBirthday(): number {
        var n: number = 0;

        for (let i = n; i < this.state.cards.length; i++) {
            var ad = this.state.cards[i].date;
            var bd = this.state.cards[n].date;
            var a : Date = this.generateDateAfterNow(ad.getMonth(), ad.getDate());
            var b : Date = this.generateDateAfterNow(bd.getMonth(), bd.getDate());

            if (isBefore(a, b)) {
                n = i;
            }
        }

        return n;
    }

    calculateTimeBirthday() {
        if (this.state.cards.length < 1)
            return "n/a";

        var n: Birthday = this.state.cards[this.state.nextBirthdayIdx];
        var d: Date = n.date;
        var now: Date = new Date(Date.now());
        var next = new Date(now.getFullYear(), d.getMonth(), d.getDate());

        if (isBefore(next, now)) {
            next.setFullYear(now.getFullYear() + 1);
        }

        const duration: Duration = intervalToDuration({ start: now, end: next })
        var out = formatDuration(duration).replace(" month", "mth").replace(" days", "d").replace(" hour", "hr").replace(" minute", "min").replace(" second", "sec");
        return n.title + " in " + out
    }

    deleteCard(idx : number) {
        var x : Birthday[] = [];

        for (let i = 0; i < this.state.cards.length; i++) {
            if (i !== idx) {
                x.push(this.state.cards[i])
            }
        }

        // this.setState((prevState) => (
        //     {cards: x, nextBirthdayIdx: 0}
        // ))

        this.updateState({cards: x, nextBirthdayIdx: 0})
    }

    render() {
        return (
            <div>
                <header className="App-header">
                    Birthday Countdown Tool
                </header>

                <header className="Subheader">
                    Coming up: {this.calculateTimeBirthday()}
                </header>


                {this.state.cards.map((card, idx) => (
                    <div>
                        <BirthdayCard title={card.title} date={card.date} onDelete={() => this.deleteCard(idx)} onUpdated={(newTitle, newDate) => { this.onCardChange(idx, newTitle, newDate) }}></BirthdayCard>
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
