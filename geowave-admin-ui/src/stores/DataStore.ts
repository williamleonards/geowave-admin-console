import { action, computed, runInAction, observable } from 'mobx'

import * as http from '../utils/http'
import { IStoreStatus, GeoWaveStore } from './GeoWaveStore'

export class DataStore extends GeoWaveStore {
    @observable addStoreName: string = ''

    @computed
    get canAdd(): boolean {
        return Boolean(this.addStoreName)
    }

    @computed
    canClear(storeName: string): boolean {
        return Boolean(storeName)
    }

    @action
    reset() {
        super.reset()
        this.addStoreName = ''
    }

    @action
    async addStore() {
        if (!this.canAdd) {
            return
        }

        this.isSubmitting = true

        try {

            const name = {"name": this.addStoreName}
            const response =  await http.post<IStoreStatus>('/api/sys/addRedisStore', name)
            runInAction(() => this.messages.push(response.data))

            this.reset()
        }
        catch (err) {
            if (http.isSessionExpired(err)) {
                return
            }

            console.error('[stores.store] Failed to start:', err)

            const description = err.response
                ? `A server error prevents starting this store (HTTP ${err.response.status} ${err.response.statusText}).`
                : 'An application prevents starting this store.'

            this.errorStore.append('Could not start store', description, err)
        }
        finally {
            runInAction(() => this.isSubmitting = false)
        }
    }

    @action
    async removeStore(storeName: string) {  
        this.isSubmitting = true

        try {
            const name = {"name": storeName}
            const response = await http.post<IStoreStatus>('/api/sys/removeStore', name)
            runInAction(() => this.messages.push(response.data))

            this.reset()
        }
        catch (err) {
            if (http.isSessionExpired(err)) {
                return
            }

            console.error('[stores.store] Failed to start:', err)

            const description = err.response
                ? `A server error prevents removing this store (HTTP ${err.response.status} ${err.response.statusText}).`
                : 'An application prevents removing this store.'

            this.errorStore.append('Could not remove store', description, err)
        }
        finally {
            runInAction(() => this.isSubmitting = false)
        }
    }

    @action
    async clearStore(storeName: string) {  
        if (!this.canClear) {
            return
        }
        this.isSubmitting = true

        try {
            const name = {"name": storeName}
            const response = await http.post<IStoreStatus>('/api/sys/clearStore', name)
            runInAction(() => this.messages.push(response.data))

            this.reset()
        }
        catch (err) {
            if (http.isSessionExpired(err)) {
                return
            }

            console.error('[stores.store] Failed to start:', err)

            const description = err.response
                ? `A server error prevents clearing this store (HTTP ${err.response.status} ${err.response.statusText}).`
                : 'An application prevents clearing this store.'

            this.errorStore.append('Could not clear store', description, err)
        }
        finally {
            runInAction(() => this.isSubmitting = false)
        }
    }

    @action
    changeAddStoreName(value: string) {
        this.addStoreName = value
    }
}
