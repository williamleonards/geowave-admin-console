import * as React from 'react'
import { inject, observer } from 'mobx-react'
import * as $ from 'classnames'

import { IconExclamationTriangle, IconFile } from './icons/font-awesome'
import { Button } from './ui/Button'
import { ProgressBar } from './ui/ProgressBar'
import { LoadingMask } from './LoadingMask'
import { IFile, UPLOAD_STATUS, FilesStore } from '../stores/FilesStore'
import * as bytes from '../utils/bytes'

import styles from './FileUpload.less'


@inject('files')
@observer
export class FileUpload extends React.Component<IProps, {}> {
    private fileChooser: HTMLInputElement

    componentWillMount() {
        //TODO why does it load when 
        this.props.files.load()
    }

    componentWillUnmount() {
        this.props.files.clearFiles()
    }

    render() {
        const { className } = this.props
        const { isLoading, items } = this.props.files

        return (
            <ul className={$(styles.root, className, isLoading && styles.isLoading)}>
                {items.map(file => (
                    <li
                        key={file.id}
                        className={$(
                            styles.file,
                            file.error && styles.hasError,
                            file.status === UPLOAD_STATUS.UPLOADING && styles.isUploading,
                            file.status === UPLOAD_STATUS.QUEUED && styles.isQueued,
                        )}
                    >
                        {file.status === UPLOAD_STATUS.DONE ? (
                            <div className={styles.label}>
                                {file.error ? (
                                    <React.Fragment>
                                        <IconExclamationTriangle className={styles.fileicon}/>
                                        <span className={styles.errorMessage}>{file.error}</span>
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        <IconFile className={styles.fileicon}/>
                                        <span className={styles.filename}>{file.name}</span>
                                    </React.Fragment>
                                )}
                                <span className={styles.filesize}>{bytes.humanize(file.bytesTotal)}</span>
                            </div>
                        ) : (
                            <ProgressBar value={computeProgress(file)} classes={{ content: styles.label }}>
                                <IconFile className={styles.fileicon}/>
                                <span className={styles.filename}>{file.name} ({file.status === UPLOAD_STATUS.QUEUED ? 'queued' : 'uploading'})</span>
                                <span className={styles.filesize}>{bytes.humanize(file.bytesUploaded)} / {bytes.humanize(file.bytesTotal)}</span>
                            </ProgressBar>
                        )}

                        <Button
                            danger
                            className={styles.button}
                            label={file.status === UPLOAD_STATUS.DONE ? 'Remove' : 'Cancel'}
                            onClick={() => this.onRemoveFile(file)}
                        />
                    </li>
                ))}

                <li className={styles.chooser} onClick={this.chooseFiles}>
                    <div className={styles.label}>Choose a file</div>
                    <Button
                        className={styles.button}
                        label="Browse"
                    />

                    <input
                        multiple
                        type="file"
                        className={styles.chooserHiddenField}
                        ref={e => this.fileChooser = e}
                        onChange={this.onFilesAdded}
                    />
                </li>

                <li className={styles.loadingMask}>
                    <LoadingMask
                        small
                        bright
                        active={isLoading}
                        className={styles.loadingMask}
                    />
                </li>
            </ul>
        )
    }

    private chooseFiles = () => {
        if (this.props.files.isLoading) {
            return
        }

        this.fileChooser.click()
    }

    private onFilesAdded = (event: { target: HTMLInputElement }) => {
        this.props.files.addFiles(Array.from(event.target.files))
    }

    private onRemoveFile = (file: IFile) => {
        this.props.files.remove(file)
    }
}


//
// Types
//

interface IProps {
    className?: string

    files?: FilesStore
}


//
// Helpers
//


function computeProgress(file: IFile): number {
    return Math.ceil(file.bytesUploaded / file.bytesTotal * 100)
}
