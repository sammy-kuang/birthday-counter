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

    private jsonChange: string = "";

    constructor(props: CardListState) {
        super(props);

        var loadStorage = localStorage.getItem("birthdays")
        var arr: Birthday[] = loadStorage ? loadBirthdays(loadStorage) : []

        this.state = {
            cards: arr,
            nextBirthdayIdx: 0,
        };

        this.jsonChange = serializeBirthdays(this.state.cards)

        this.getNextBirthday.bind(this)
        this.onTextBoxUpdate = this.onTextBoxUpdate.bind(this)
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

    updateState(newState: CardListState) {
        this.setState(newState)
        // serialize into localStorage
        localStorage.setItem("birthdays", serializeBirthdays(newState.cards))

        // update the text box
        this.jsonChange = serializeBirthdays(newState.cards)
        const textBox = document.getElementById("BirthdayCardTextInput") as HTMLInputElement
        textBox.value = this.jsonChange
    }

    addBlankCard() {
        const n: Birthday = { title: "New", date: BirthdayCard.STARTING_DATE.toDate() };
        var x = [...this.state.cards, n]
        this.updateState({ cards: x, nextBirthdayIdx: this.state.nextBirthdayIdx })
    }

    onCardChange(index: number, newTitle: string, newDate: Date) {
        const newState = this.state.cards;
        newState[index] = { title: newTitle, date: newDate };
        this.updateState({ cards: newState, nextBirthdayIdx: this.state.nextBirthdayIdx })
    }

    generateDateAfterNow(monthInd: number, day: number) {
        var now: Date = new Date(Date.now());
        var out: Date = new Date(now.getFullYear(), monthInd, day);

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
            var a: Date = this.generateDateAfterNow(ad.getMonth(), ad.getDate());
            var b: Date = this.generateDateAfterNow(bd.getMonth(), bd.getDate());

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

    renderTodayBirthday() {
        for (let i = 0; i < this.state.cards.length; i++) {
            let birthday: Birthday = this.state.cards[i]
            let date = birthday.date
            let now = new Date(Date.now())
            let nowMonth = now.getMonth()
            let nowDay = now.getDate()

            if (date.getMonth() === nowMonth && date.getDate() === nowDay) {
                let interval = intervalToDuration({ start: date, end: now }).years
                if (interval) {
                    return (
                        <header className="TodayBirthday">
                            <p>🎉 Today's Birthday: {birthday.title} 🎉</p>
                            <p>{birthday.title} is {interval} {Math.abs(interval) > 1 ? "years" : "year"} old!</p>
                        </header>
                    );
                }
            }
        }
        return null
    }


    deleteCard(idx: number) {
        var x: Birthday[] = this.state.cards.filter((item, i) => i !== idx);

        this.updateState({ cards: x, nextBirthdayIdx: 0 })
    }

    onTextBoxUpdate(event: React.KeyboardEvent) {
        if (event.key === "Enter") {
            var newCards = loadBirthdays(((event.target) as HTMLInputElement).value)
            this.updateState({ cards: newCards, nextBirthdayIdx: 0 })
        }
    }

    render() {
        return (
            <div>
                <header className="App-header">
                    Birthday Countdown Tool
                </header>

                {this.renderTodayBirthday()}

                <header className="Subheader">
                    Coming up: {this.calculateTimeBirthday()}
                </header>


                <ul>
                    {this.state.cards.map((card, idx) => (
                        <li key={card.title+":"+idx}>
                            <BirthdayCard title={card.title} date={card.date} onDelete={() => this.deleteCard(idx)} onUpdated={(newTitle, newDate) => { this.onCardChange(idx, newTitle, newDate) }}></BirthdayCard>
                        </li>
                    ))};
                </ul>

                <div className="content">
                    <button className="BirthdayCardButton" onClick={() => { this.addBlankCard() }}>
                        <p className="BirthdayCardText">Add new birthday</p>
                    </button>
                </div>

                <div className="content">
                    <input type="text"
                        className="BirthdayCardTextInput"
                        id="BirthdayCardTextInput"
                        defaultValue={this.jsonChange}
                        alt="Press enter to update"
                        onKeyDown={this.onTextBoxUpdate}
                        onChange={(event) => { this.jsonChange = event.target.value }}
                    >
                    </input>
                </div>

            </div>
        );
    }
}
