import * as moment from 'moment'


const DEFAULT_FORMAT = 'MM/DD/YY HH:mm'


export function humanize(timestamp: string) {
    return moment(timestamp).fromNow()
}


export function elapsed(timestamp: string, end = moment()) {
    return moment(timestamp).to(end, true)
}


export function format(timestamp, fmt = DEFAULT_FORMAT) {
    return moment(timestamp).format(fmt)
}
