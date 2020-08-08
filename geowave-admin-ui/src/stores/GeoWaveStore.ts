import { observable, action } from "mobx"
import { ErrorStore } from "./ErrorStore"
import { FilesStore } from "./FilesStore"

/**
 * abstract class for all GeoWave commands to inherent from
 */
export abstract class GeoWaveStore {
    @observable isSubmitting: boolean = false
    @observable messages: IStoreStatus[] = []

    constructor(protected errorStore: ErrorStore, protected filesStore: FilesStore) {
    }

    /**
     * resets the component
     */
    @action
    reset(): void {
    }
}

export interface IStoreStatus {
    storeId: string
    status: string
}