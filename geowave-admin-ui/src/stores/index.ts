import { configure } from 'mobx'

import { AuthStore } from './AuthStore'
import { ErrorStore } from './ErrorStore'
import { IngestStore } from './IngestStore'
import { SystemStore } from './SystemStore'
import { FilesStore } from './FilesStore'
import { DataStore } from './DataStore'
import { IndexStore } from './IndexStore'


export function createStores(): IStores {
    configure({
        enforceActions: true,
    })

    const errorStore = new ErrorStore()
    const filesStore = new FilesStore(errorStore)

    return {
        auth: new AuthStore(errorStore),
        errors: errorStore,
        files: filesStore,
        ingest: new IngestStore(errorStore, filesStore),
        datastore: new DataStore(errorStore, filesStore),
        index: new IndexStore(errorStore,filesStore),
        system: new SystemStore(errorStore),
    }
}


export interface IStores {
    auth: AuthStore,
    errors: ErrorStore,
    ingest: IngestStore,
    datastore: DataStore,
    system: SystemStore,
    index: IndexStore,
    files: FilesStore
}
