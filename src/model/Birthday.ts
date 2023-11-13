export interface Birthday {
    title : string,
    date : Date
}

export function serializeBirthdays(birthdays : Birthday[]) {
    return JSON.stringify(birthdays)
}

export function loadBirthdays (birthdaysJson : string) : Birthday[] {
    var arr : Birthday[] = JSON.parse(birthdaysJson)

    for (let i = 0; i < arr.length; i++) {
        arr[i] = {title: arr[i].title, date: new Date(arr[i].date)}
        // we call the date constructor as when a date object is serialized
        // it saves it as a string
    }

    return arr
}