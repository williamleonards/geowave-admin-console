import * as React from 'react'
import * as $ from 'classnames'
import { inject, observer } from 'mobx-react'

import { FileUpload } from '../FileUpload'
import { Label } from '../ui/Label'
import { Panel } from '../ui/Panel'
import { Radio } from '../ui/Radio'
import { TextField } from '../ui/TextField'
import { SystemStore } from '../../stores/SystemStore'

import styles from './css/GeoWaveList.less'
import { IngestStore } from '../../stores/IngestStore'

@inject('ingest', 'system')
@observer
export class SourceList extends React.Component<IProps, {}> {

    constructor(props: IProps) {
        super(props);
    }
    render() {
        const { datastores } = this.props.system

        return (
            <Panel
                className={$(styles.root, this.props.className)}
                classes={{
                    body: styles.panelBody,
                }}
                title="Source"
            >
                <div className={$(styles.list, this.isRemote && styles.isActive)}>
                    <div className={styles.row}>
                        <Label
                            reversed
                            className={$(styles.column, styles.label)}
                            text="URI to file or directory"
                        >
                            <Radio
                                checked={this.isRemote}
                                onChange={this.onSelectRemote}
                            />
                        </Label>
                        <div className={$(styles.column, styles.details)}>
                            <TextField
                                className={styles.uri}
                                value="s3://mybucket/path/to/object/or/prefix"
                                autocomplete="url"
                            />
                            <div className={styles.instructions}>
                                Supported schemes are <code>s3://</code>, <code>hdfs://</code>, <code>https://</code>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={$(styles.list, this.isUpload && styles.isActive)}>
                    <div className={styles.row}>
                        <Label
                            reversed
                            className={$(styles.column, styles.label)}
                            text="Upload from my computer"
                        >
                            <Radio
                                checked={this.isUpload}
                                onChange={this.onSelectUpload}
                            />
                        </Label>
                        <div className={$(styles.column, styles.details)}>
                            <FileUpload
                                className={styles.fileUpload}
                            />
                        </div>
                    </div>
                </div>

                <div className={$(styles.list, this.isCopy && styles.isActive)}>
                    <div className={styles.row}>
                        <Label
                            reversed
                            className={$(styles.column, styles.label)}
                            text="Copy from a Data Store"
                        >
                            <Radio
                                checked={this.isCopy}
                                onChange={this.onSelectCopy}
                            />
                        </Label>
                        <div className={$(styles.column, styles.details)}>
                            <select>
                                {datastores.map(ds => (
                                    <option key={ds.name} value={ds.name}>{ds.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </Panel>
        )
    }

    private get isCopy(): boolean {
        return this.props.ingest.sourceType === SOURCE_TYPE.COPY
    }

    private get isRemote(): boolean {
        return this.props.ingest.sourceType === SOURCE_TYPE.REMOTE
    }

    private get isUpload(): boolean {
        return this.props.ingest.sourceType === SOURCE_TYPE.UPLOAD
    }

    private onSelectCopy = () => {
        this.props.ingest.changeSourceType(SOURCE_TYPE.COPY)
    }

    private onSelectRemote = () => {
        this.props.ingest.changeSourceType(SOURCE_TYPE.REMOTE)
    }

    private onSelectUpload = () => {
        this.props.ingest.changeSourceType(SOURCE_TYPE.UPLOAD)
    }
}

//
// Types
//

interface IProps {
    className?: string,
    ingest?: IngestStore,
    system?: SystemStore,
}

//the type of the source file for file uploads
export enum SOURCE_TYPE { COPY, REMOTE, UPLOAD }