import { Location } from 'history'


export function deserializeSearch(search: string = location.search): IMapLike {
    const params: IMapLike = {}

    search
        .replace(/^\?/, '')
        .split('&')
        .forEach(pair => {
            if (!pair) {
                return
            }

            const [key, value] = pair.split('=', 2)
            params[key] = typeof value === 'undefined' ? true : decodeURIComponent(value.trim())
        })

    return params
}


export function serializeSearch(params?: IMapLike, ...extras: string[]): string {
    return Object
        .keys(params || {})
        .map(key => {
            let value = params[key]

            // Special case (anchor params)
            if (typeof value === 'undefined') {
                return key
            }

            // Normalize
            if (value instanceof Date) {
                value = value.toISOString()
            }
            else {
                value = value.toString().trim()
            }

            return `${key}=${encodeURIComponent(value)}`
        })
        .filter(v => !!v)
        .concat(extras)
        .join('&')
}


export function next(loc?: Location, ...extras: string[]): string {
    if (!loc) {
        loc = location as any
    }

    const { next: _, ...params } = deserializeSearch(loc.search)

    return serializeSearch(params, ...extras, `next=${loc.pathname}${encodeURIComponent(loc.search)}`)
}


interface IMapLike {
    [key: string]: any
}
