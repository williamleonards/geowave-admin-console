import { action, computed, observable, runInAction } from 'mobx'

import * as http from '../utils/http'
import { GeoWaveStore, IStoreStatus } from './GeoWaveStore'
import { SOURCE_TYPE } from '../components/data-management/SourceList'

export class IngestStore extends GeoWaveStore {
    @observable indices: string[] = []
    @observable datastore: string = ''
    @observable sourceType: SOURCE_TYPE = SOURCE_TYPE.UPLOAD
    @observable sourceUris: string[] = []

    @computed
    get canStart(): boolean {
        if (!this.datastore) {
            return false
        }

        if (this.sourceType === SOURCE_TYPE.UPLOAD) {
            return !this.filesStore.isUploading
                && !this.filesStore.isEmpty
        }

        return this.sourceUris.length !== 0
    }

    @action
    reset() {
        super.reset()
        this.datastore = ''
        this.indices = []
    }

    @action
    async start() {
        if (!this.canStart) {
            return
        }

        this.isSubmitting = true

        const data = {
            datastore: this.datastore,
            indices: this.indices,
            sourceUris: this.sourceType === SOURCE_TYPE.UPLOAD ? this.filesStore.uris : this.sourceUris,
        }

        try {
            const response = await http.post<IStoreStatus>('/api/ingest', data)

            this.messages.push(response.data)

            this.reset()
        }
        catch (err) {
            if (http.isSessionExpired(err)) {
                return
            }

            console.error('[stores.ingest] Failed to start:', err)

            const description = err.response
                ? `A server error prevents starting this ingest (HTTP ${err.response.status} ${err.response.statusText}).`
                : 'An application prevents starting this ingest.'

            this.errorStore.append('Could not start ingest', description, err)
        }
        finally {
            runInAction(() => this.isSubmitting = false)
        }
    }

    @action
    changeDataStore(name: string) {
        this.datastore = name
    }

    @action
    changeSourceType(type: SOURCE_TYPE) {
        this.sourceType = type
        this.sourceUris = []
    }

    @action
    changeSourceUris(uris: string[]) {
        this.sourceUris = uris
    }

    @action
    toggleIndex(name: string) {
        if (this.indices.includes(name)) {
            this.indices = this.indices.filter(s => s !== name)
            return
        }

        this.indices.push(name)
    }
}
