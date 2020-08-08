import axios, { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios'

const TIMEOUT = 30000

let _onUnauthorizedSubscribers: Callback[] = []

const _client: any = axios.create({
    timeout: TIMEOUT,
    validateStatus(status: number) {
        if (status === 401) {
            _notifyUnauthorizedSubscribers()
        }

        return status >= 200 && status < 300
    },
})

const _server: any = axios.create({
    headers:{
      'content-type':'application/json'
    },
    baseURL: 'http://127.0.0.1:8000',
    timeout: TIMEOUT,
    validateStatus(status: number) {
        if (status === 401) {
            _notifyUnauthorizedSubscribers()
        }

        return status >= 200 && status < 300
    },
})


export function del<T>(url: string, config?: AxiosRequestConfig): IResponse<T> {
    return _client.delete(url, config)
}


export function get<T>(url: string, config?: AxiosRequestConfig): IResponse<T> {
    return _client.get(url, config)
}

export function post<T>(url: string, data?: any, config?: AxiosRequestConfig): IResponse<T> {
    return _client.post(url, data, config)
}

export function getServer<T>(url: string, config?: AxiosRequestConfig): IResponse<T> {
    return _server.get(url, config)
}

export function postServer<T>(url: string, data?: any, config?: AxiosRequestConfig): IResponse<T> {
    return _server.post(url, data, config)
}

export function put<T>(url: string, data?: any, config?: AxiosRequestConfig): IResponse<T> {
    return _client.put(url, data, config)
}


export function onUnauthorized(func: Callback): Callback {
    if (typeof func !== 'function') {
        throw new Error('callback must be a function')
    }

    _onUnauthorizedSubscribers.push(func)

    // Enable subscribers to unsubscribe
    return () => {
        _onUnauthorizedSubscribers = _onUnauthorizedSubscribers.filter(f => f === func)
    }
}


export function isSessionExpired(err: AxiosError) {
    return err.response && err.response.status === 401
}


export interface IResponse<T> extends AxiosPromise<T> {
    data: T
}


type Callback = () => void


//
// Helpers
//

function _notifyUnauthorizedSubscribers() {
    if (!_onUnauthorizedSubscribers.length) {
        return
    }

    console.debug('[http] Notifying subscribers of HTTP 401')

    _onUnauthorizedSubscribers.forEach(callback => {
        try {
            callback()
        }
        catch (err) {
            console.error('[http] Error in subscriber callback:', err)
        }
    })
}