import * as React from 'react'
import * as $ from 'classnames'
import { inject, observer } from 'mobx-react'

import { LoadingMask } from '../LoadingMask'
import { Checkbox } from '../ui/Checkbox'
import { Label } from '../ui/Label'
import { Panel } from '../ui/Panel'
import { IngestStore } from '../../stores/IngestStore'
import { SystemStore } from '../../stores/SystemStore'

import styles from './css/DestinationList.less'


@inject('ingest', 'system')
@observer
export class DestinationList extends React.Component<IProps, {}> {
    componentWillMount() {
        // HACK HACK HACK HACK HACK HACK HACK HACK HACK
        // Workaround for bug G3-383

        /*
                this.props.system.fetchIndices()
                this.props.system.fetchDataStores()
        */

        this.props.system.fetchDataStores()
            .then(() => this.props.system.fetchIndices())

        // HACK HACK HACK HACK HACK HACK HACK HACK HACK
    }

    render() {
        const { datastores, indices } = this.props.system
        const { datastore: selectedDataStore, indices: selectedIndices } = this.props.ingest
        const { isLoading } = this

        return (
            <Panel
                className={$(
                    styles.root,
                    this.props.className,
                    isLoading && styles.isLoading,
                )}
                title="Destination"
            >
                <div className={styles.rows}>
                    <Label className={styles.row} text="Data Store" tooltip="">
                        <select value={selectedDataStore} onChange={this.onDataStoreChange}>
                            <option value="">&ndash;</option>
                            {datastores.map(ds => (
                                <option key={ds.name} value={ds.name}>
                                    {ds.name} ({ds.type})
                                </option>
                            ))}
                        </select>
                    </Label>

                    <Label
                        passive
                        className={styles.row}
                        classes={{ text: styles.rowLabelText }}
                        text="Indices"
                    >
                        <div className={styles.checkboxes}>
                            {indices.map(index => (
                                <Label
                                    reversed
                                    key={index.name}
                                    text={index.name}
                                >
                                    <Checkbox
                                        checked={selectedIndices.includes(index.name)}
                                        key={index.name}
                                        onChange={() => this.onToggleIndex(index.name)}
                                    />
                                </Label>
                            ))}
                        </div>
                    </Label>
                </div>

                <LoadingMask
                    small
                    bright
                    active={isLoading}
                    className={styles.loadingMask}
                />
            </Panel>
        )
    }

    private get isLoading() {
        return this.props.system.isFetchingIndices || this.props.system.isFetchingDataStores
    }

    private onDataStoreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.props.ingest.changeDataStore(event.target.value)
    }

    private onToggleIndex = (name: string) => {
        this.props.ingest.toggleIndex(name)
    }
}


//
// Types
//

interface IProps {
    className?: string

    ingest?: IngestStore
    system?: SystemStore
}
