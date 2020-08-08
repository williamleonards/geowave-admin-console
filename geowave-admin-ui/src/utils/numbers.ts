const TRILLION = 1_000_000_000_000
const BILLION  = 1_000_000_000
const MILLION  = 1_000_000
const THOUSAND = 1_000


export function humanize(n: number, abbrev = true): string {
    if (n >= TRILLION) {
        return `${(n / TRILLION).toFixed(1)}${abbrev ? 'T' : ' trillion'}`
    }

    if (n >= BILLION) {
        return `${(n / BILLION).toFixed(1)}${abbrev ? 'B' : ' billion'}`
    }

    if (n >= MILLION) {
        return `${(n / MILLION).toFixed(1)}${abbrev ? 'M' : ' million'}`
    }

    if (n >= THOUSAND) {
        return `${(n / THOUSAND).toFixed(1)}${abbrev ? 'K' : ' thousand'}`
    }

    return n.toString()
}


export function round(n: number, precision: number = 3) {
    return Math.round(n * Math.pow(10, precision)) * Math.pow(10, -precision)
}
