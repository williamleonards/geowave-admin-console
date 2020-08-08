export const KB = 2 ** 10
export const MB = 2 ** 20
export const GB = 2 ** 30
export const TB = 2 ** 40
export const PB = 2 ** 50


export function humanize(n: number) {
    if (n >= PB) {
        return `${(n / PB).toFixed(1)}PB`
    }
    if (n >= TB) {
        return `${(n / TB).toFixed(1)}TB`
    }
    if (n >= GB) {
        return `${(n / GB).toFixed(1)}GB`
    }
    if (n >= MB) {
        return `${(n / MB).toFixed(1)}MB`
    }
    if (n >= KB) {
        return `${(n / KB).toFixed(1)}KB`
    }
    return `${n.toFixed(0)}B`
}
