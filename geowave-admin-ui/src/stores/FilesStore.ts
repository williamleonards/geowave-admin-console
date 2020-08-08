import axios from 'axios'
import { action, computed, observable, runInAction } from 'mobx'

import { ErrorStore } from './ErrorStore'
import * as bytes from '../utils/bytes'
import * as http from '../utils/http'


const MAX_CONCURRENCY = 2
const MAX_FILESIZE = 2 * bytes.GB


export class FilesStore {
    @observable items: IFile[] = []
    @observable isLoading = false

    constructor(private errorStore: ErrorStore) {}

    @computed
    get isEmpty(): boolean {
        return !this.items.length
    }

    @computed
    get isUploading(): boolean {
        return !this.items.every(f => f.status === UPLOAD_STATUS.DONE)
    }

    @computed
    get uris(): string[] {
        return this.items.map(f => `myfiles://${f.name}`)
    }

    @action
    addFiles(rawFiles: File[]) {
        this.items = this.items.concat(rawFiles.map(data => {
            const error = validateFilesize(data)
            return {
                data,
                error,
                bytesTotal:    data.size,
                bytesUploaded: 0,
                id:            Math.random().toString(16).substr(2),
                status:        error ? UPLOAD_STATUS.DONE : UPLOAD_STATUS.QUEUED,
                name:          data.name,
            }
        }))

        this.processQueue()
    }

    @action
    clearFiles() {
        this.items = []
    }

    @action
    async load() {
        this.isLoading = true

        try {
            const response = await http.get<IListFilesResponse>('/api/myfiles')

            const files: IFile[] = response.data.files.map(raw => ({
                bytesUploaded: raw.size,
                bytesTotal:    raw.size,
                data:          null,
                error:         null,
                id:            Math.random().toString(16).substr(2),
                name:          raw.name,
                status:        UPLOAD_STATUS.DONE,
            }))

            runInAction(() => this.items = files)
        }
        catch (err) {
            if (http.isSessionExpired(err)) {
                return
            }

            this.errorStore.append('Could not load files', 'An error while trying to list your uploaded files.', err)
        }
        finally {
            runInAction(() => this.isLoading = false)
        }
    }

    @action
    async remove(file: IFile) {
        try {
            this.items = this.items.filter(f => f !== file)

            if (file.cancel) {
                file.cancel()
                file.cancel = null
            }
            else {
                await http.del(`/api/myfiles/${file.name}`)
            }

            this.processQueue()
        }
        catch (err) {
            if (http.isSessionExpired(err)) {
                return
            }

            if (err.response && err.response.status === 404) {
                return  // Well, the file _is_ gone... ¯\_(ツ)_/¯
            }

            console.error('[stores.files] File delete failed:', err)

            const description = err.response
                ? `A server error prevents deletion of this file (HTTP ${err.response.status} ${err.response.statusText}).`
                : 'An application prevents deleting this file.'

            this.errorStore.append(`Could not delete file '${file.name}'`, description, err)

            runInAction(() => this.items.push(file))
        }
    }

    @action
    private onUploadProgress(file: IFile, event: IProgressEvent) {
        file.bytesUploaded = event.loaded
        file.bytesTotal = event.total
    }

    private processQueue() {
        console.debug('[stores.files] Processing queue')

        const queuedFiles = this.items.filter(f => f.status === UPLOAD_STATUS.QUEUED)
        if (!queuedFiles.length) {
            return  // Nothing to do
        }

        const activeUploads = this.items.filter(f => f.status === UPLOAD_STATUS.UPLOADING).length
        const files = queuedFiles.slice(0, MAX_CONCURRENCY - activeUploads)
        files.forEach(f => this.upload(f))
    }

    @action
    private async upload(file: IFile) {
        console.debug(`[stores.uploader] Uploading '%s' (%s bytes)`, file.name, file.bytesTotal)

        file.status = UPLOAD_STATUS.UPLOADING

        const payload = new FormData()
        payload.append('file', file.data)

        const cancelToken = new axios.CancelToken(cancel => file.cancel = cancel)
        const onUploadProgress = event => this.onUploadProgress(file, event)

        try {
            await http.post('/api/myfiles', payload, { cancelToken, onUploadProgress })
            runInAction('uploadcomplete', () => file.status = UPLOAD_STATUS.DONE)
        }
        catch (err) {
            if (http.isSessionExpired(err)) {
                return
            }

            if (axios.isCancel(err)) {
                return
            }

            if (!err.response) {
                this.errorStore.append(`Could not upload '${file.name}'`, 'An application error prevents the successful upload of this file.', err)
                return
            }

            runInAction(() => {
                file.status = UPLOAD_STATUS.DONE
                file.error = `Could not upload '${file.name}' (status=${err.response.status})`
            })
        }
        finally {
            this.processQueue()
        }
    }
}


//
// Types
//


export enum UPLOAD_STATUS { QUEUED, UPLOADING, DONE }


export interface IFile {
    bytesUploaded: number
    bytesTotal: number
    data: File
    error: string
    id: string
    name: string
    status: UPLOAD_STATUS

    cancel?(): void
}


interface IListFilesResponse {
    files: {
        name: string,
        size: number,
    }[]
}

interface IProgressEvent {
    loaded: number
    total: number
}

//
// Helpers
//


function validateFilesize(fd: File): string {
    if (fd.size === 0) {
        return `'${fd.name}' is an empty file`
    }

    if (fd.size > MAX_FILESIZE) {
        return `'${fd.name}' is too big to upload (max is ${bytes.humanize(MAX_FILESIZE)})`
    }

    return null
}
