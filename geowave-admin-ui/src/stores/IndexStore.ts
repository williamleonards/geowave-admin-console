import { action, computed, runInAction, observable } from 'mobx'

import * as http from '../utils/http'
import { IStoreStatus, GeoWaveStore } from './GeoWaveStore'
import { IIndicesResponse, IIndex } from './SystemStore'

export class IndexStore extends GeoWaveStore {
    @observable storename: string = ''
    @observable indexname: string = ''
    @observable type: string = ''
    @observable isFetchingStoreIndices: boolean = false

    @computed
    get canStart(): boolean {
        return Boolean(this.storename && this.indexname && this.type)
    }

    @computed
    get canRemove(): boolean {
        return Boolean(this.storename && this.indexname)
    }

    @action
    reset() {
        super.reset()
        this.storename = ''
        this.indexname = ''
        this.type = ''
    }

    @action
    async startAdd() {
        if (!this.canStart) {
            return
        }

        this.isSubmitting = true

        try {
            const index = {"name": this.storename,
                            "index": this.indexname,
                            "type": this.type
                            }
            const response =  await http.post<IStoreStatus>('/api/sys/addIndex', index)

            runInAction(() => this.messages.push(response.data))

            this.reset()
        }
        catch (err) {
            if (http.isSessionExpired(err)) {
                return
            }

            console.error('[stores.index] Failed to start:', err)

            const description = err.response
                ? `A server error prevents adding this index (HTTP ${err.response.status} ${err.response.statusText}).`
                : 'An application prevents adding this index.'

            this.errorStore.append('Could not add index', description, err)
        }
        finally {
            runInAction(() => this.isSubmitting = false)
        }
    }


    @action
    async startRemove() {
        if (!this.canRemove) {
            return
        }

        this.isSubmitting = true

        try {
            const index = {"name": this.storename,
                            "index": this.indexname,
                            }
            const response =  await http.post<IStoreStatus>('/api/sys/removeIndex', index)

            runInAction(() => this.messages.push(response.data))

            this.reset()
        }
        catch (err) {
            if (http.isSessionExpired(err)) {
                return
            }

            console.error('[stores.index] Failed to start:', err)

            const description = err.response
                ? `A server error prevents removing this index (HTTP ${err.response.status} ${err.response.statusText}).`
                : 'An application prevents removing this index.'

            this.errorStore.append('Could not remove index', description, err)
        }
        finally {
            runInAction(() => this.isSubmitting = false)
        }
    }

    @action
    async fetchStoreIndices(storeName:string): Promise<IIndex[]> {
        console.debug('[stores.system] Fetching store indices')

        this.isFetchingStoreIndices = true
        let indices: IIndex[] = [];

        try {

            const name = {"name": storeName}
            const { data } = await http.post<IIndicesResponse>('/api/sys/listIndex', name)

            // Validate and normalize
            if (!Array.isArray(data.indices)) {
                this.errorStore.append('Store Index listing failed', 'The server returned missing and/or malformed data.')
                return []
            }

            indices = data.indices
        }
        catch (err) {
            if (http.isSessionExpired(err)) {
                return []
            }

            console.error('[stores.system] Store Indices fetch failed:', err)

            const description = err.response
                ? `A server error prevents listing store indices (HTTP ${err.response.status} ${err.response.statusText}).`
                : 'An application prevents requesting and/or processing store index listing.'

            this.errorStore.append('Could not list indices based on store', description, err)
        }
        finally {
            runInAction(() => this.isFetchingStoreIndices = false)
            return indices
        }
    }


    @action
    changeStoreName(value: string) {
        this.storename = value
    }

    @action
    changeIndexName(value: string) {
        this.indexname = value
    }

    @action
    changeTypeName(value: string) {
        this.type = value
    }
}