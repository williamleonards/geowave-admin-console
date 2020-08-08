import { action, observable, runInAction } from 'mobx'

import { ErrorStore } from './ErrorStore'
import * as http from '../utils/http'


export class SystemStore {
    @observable componentVersions: IComponentVersion[] = []
    @observable datastores: IDataStore[] = []
    @observable indices: IIndex[] = []
    @observable isFetchingDataStores: boolean = false
    @observable isFetchingIndices: boolean = false
    @observable isFetchingInfo: boolean = false
    @observable operations: IOperation[] = []
    @observable recordCount: number = -1

    
    constructor(private errorStore: ErrorStore) {
    }

    @action
    async fetchDataStores() {
        console.debug('[stores.system] Fetching datastores')

        this.isFetchingDataStores = true

        try {
            const { data } = await http.get<IDatastoresResponse>('/api/sys/datastores')

            // Validate and normalize
            if (!Array.isArray(data.datastores)) {
                this.errorStore.append('Datastores listing failed', 'The server returned missing and/or malformed data.')
                return
            }

            runInAction(() => this.datastores = data.datastores.sort(this.sortDataStores))
        }
        catch (err) {
            if (http.isSessionExpired(err)) {
                return
            }

            console.error('[stores.system] Data Stores fetch failed:', err)

            const description = err.response
                ? `A server error prevents listing data stores (HTTP ${err.response.status} ${err.response.statusText}).`
                : 'An application prevents requesting and/or processing data stores listing.'

            this.errorStore.append('Could not list datastores', description, err)
        }
        finally {
            runInAction(() => this.isFetchingDataStores = false)
        }
    }

    @action
    async fetchIndices() {
        console.debug('[stores.system] Fetching indices')

        this.isFetchingIndices = true

        try {
            const { data } = await http.get<IIndicesResponse>('/api/sys/indices')

            // Validate and normalize
            if (!Array.isArray(data.indices)) {
                this.errorStore.append('Index listing failed', 'The server returned missing and/or malformed data.')
                return
            }

            runInAction(() => this.indices = data.indices)
        }
        catch (err) {
            if (http.isSessionExpired(err)) {
                return
            }

            console.error('[stores.system] Indices fetch failed:', err)

            const description = err.response
                ? `A server error prevents listing indices (HTTP ${err.response.status} ${err.response.statusText}).`
                : 'An application prevents requesting and/or processing index listing.'

            this.errorStore.append('Could not list indices', description, err)
        }
        finally {
            runInAction(() => this.isFetchingIndices = false)
        }
    }


    
    @action
    async fetchInfo() {
        console.debug('[stores.system] Fetching info')

        this.isFetchingInfo = true

        try {
            const { data } = await http.get<IInfoResponse>('/api/sys/info')

            // Validate and normalize
            if (!Array.isArray(data.operations) || !data.versions || !data.metrics) {
                this.errorStore.append('System info lookup failed', 'The server returned missing and/or malformed data.')
                return
            }

            const componentVersions = Object.keys(data.versions).sort().map(name => ({ name, version: data.versions[name] }))
            const operations = data.operations.sort((a, b) => a.timeStarted > b.timeStarted ? -1 : 1)
            const recordCount = data.metrics.records

            runInAction(() => {
                this.componentVersions = componentVersions
                this.operations = operations
                this.recordCount = recordCount
            })
        }
        catch (err) {
            if (http.isSessionExpired(err)) {
                return
            }

            console.error('[stores.system] Info fetch failed:', err)

            const description = err.response
                ? `A server error prevents requesting system information (HTTP ${err.response.status} ${err.response.statusText}).`
                : 'An application prevents requesting and/or processing system information.'

            this.errorStore.append('Could not get system info', description, err)
        }
        finally {
            runInAction(() => this.isFetchingInfo = false)
        }
    }

    /** sorts data stores alphabetically */
    private sortDataStores(ds1: IDataStore, ds2: IDataStore): number { 
        if (ds1.name < ds2.name) { return -1 }
        if (ds1.name > ds2.name) { return 1 }
        return 0
    }
}


export interface IComponentVersion {
    name: string
    version: string
}


export interface IDataStore {
    name: string
    type: string
    options: { [key: string]: string }
}


export interface IIndex {
    name: string
    type: string
    options: { [key: string]: string }
}


export interface IOperation {
    identifier: string
    status: 'pending' | 'running' | 'success' | 'error'
    timeStarted: string
    timeStopped: string
}


interface IDatastoresResponse {
    datastores: IDataStore[]
}


export interface IIndicesResponse {
    indices: IIndex[]
}


interface IInfoResponse {
    operations: IOperation[]
    metrics: { records: number }
    versions: { [key: string]: string }
}