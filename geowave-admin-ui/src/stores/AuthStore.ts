import { action, autorun, computed, observable, runInAction } from 'mobx'

import { ErrorStore } from './ErrorStore'
import * as http from '../utils/http'


const SERIALIZATION_KEY = 'AUTH'


export class AuthStore {
    @observable username: string = ''
    @observable isBadCredentials: boolean = false
    @observable isLoggingIn: boolean = false
    @observable isSessionExpired: boolean = false

    constructor(private errorStore: ErrorStore, autosave = true, watchSession = true, state = deserialized<AuthStore>()) {
        if (state) {
            console.debug('[stores.auth] Deserialized session')
            this.username = state.username
        }

        if (autosave) {
            autorun(() => {
                console.debug('[stores.auth] Serializing session')
                serialized(this.isLoggedIn ? this : null)
            })
        }

        if (watchSession) {
            http.onUnauthorized(() => this.onSessionExpired())
        }
    }

    @computed
    get isLoggedIn(): boolean {
        return !!this.username
    }

    async checkCsrf(): Promise<void> {
        console.debug('[stores.auth] Contacting API to establish CSRF token')

        await http.get('/api/health')
    }

    async checkSession(): Promise<void> {
        console.debug('[stores.auth] Checking if still logged in')

        await http.get('/api/whoami')
    }

    @action
    onSessionExpired() {
        this.isSessionExpired = true
        this.username = ''
    }

    @action
    async login(username: string, password: string): Promise<void> {
        console.debug('[stores.auth] Logging in')

        this.isBadCredentials = false
        this.isLoggingIn = true
        this.isSessionExpired = false

        try {
            username = encodeURIComponent(username.trim())
            password = encodeURIComponent(password.trim())

            const response = await http.post<IUserProfile>('/api/login', `username=${username}&password=${password}`)

            runInAction(() => {
                this.username = response.data.username
            })
        }
        catch (err) {
            if (!err.response) {
                console.error('[stores.auth] Login failed:', err)

                this.errorStore.append('Cannot log in', `An application error prevents login (${err})`, err)
                return
            }

            switch (err.response.status) {
                case 401:
                    runInAction(() => this.isBadCredentials = true)
                    return
                case 403:
                    this.errorStore.append('Cannot start session', `You may already be logged in.  Please try again after clearing your browser's cookies.`)
                    return
                default:
                    this.errorStore.append('Cannot log in', `A server error prevents login (HTTP ${err.response.status} ${err.response.statusText})`)
                    return
            }
        }
        finally {
            runInAction(() => {
                this.isLoggingIn = false
            })
        }
    }

    @action
    async logout(): Promise<void> {
        if (!this.isLoggedIn) {
            return  // Nothing to do
        }

        console.debug('[stores.auth] Logging out')

        this.isLoggingIn = true

        try {
            this.username = ''

            await http.post('/api/logout')
        }
        catch (err) {
            if (http.isSessionExpired(err)) {
                return
            }

            const description = err.response
                ? `A server error occurred during logout (HTTP ${err.response.status} ${err.response.statusText}).`
                : 'An application occurred during logout.'

            this.errorStore.append('Logout Error', description, err)
        }
        finally {
            runInAction(() => {
                this.isLoggingIn = false
            })
        }
    }
}


//
// Helpers
//

function deserialized<T>(defaultValue: T = null): T {
    return JSON.parse(localStorage.getItem(SERIALIZATION_KEY)) || defaultValue
}


function serialized<T>(value: T): T {
    localStorage.setItem(SERIALIZATION_KEY, JSON.stringify(value))
    return value
}


//
// Types
//

interface IUserProfile {
    username: string
}
