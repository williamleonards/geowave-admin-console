import * as React from 'react'
import * as $ from 'classnames'
import { inject, observer } from 'mobx-react'

import { Navigation } from '../Navigation'
import { LoadingMask } from '../LoadingMask'
import { DataStore } from '../../stores/DataStore'

import styles from './css/GeoWaveRoute.less'
import { SystemStore } from '../../stores/SystemStore'
import { DataStoreList } from './DataStoreList'
import { AddStoreList } from './AddStoreList'
import { action } from 'mobx'

@inject('datastore', 'system')
@observer
export class DataStoreRoute extends React.Component<IProps, never> {
    private datastore: DataStore;
    private system: SystemStore;

    constructor(props: IProps) {
        super(props);
        this.datastore = props.datastore;
        this.system = props.system;
    }
    
    componentWillUnmount() {
        this.datastore.reset()
    }

    render() {
        const { isSubmitting } = this.datastore

        return (
            <div className={$(styles.root, this.props.className)}>
                <Navigation className={styles.nav}/>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <div className={styles.title}>Data Store</div>
                    </div>
                    <div className={styles.messages}></div>
                    <div className={styles.panels}>
                        <AddStoreList
                            onAdd={this.onAdd}/>
                        <DataStoreList
                            className={styles.sources}
                            onRemove={this.onRemove}
                            onClear={this.onClear}/>
                    </div>
                </div>

                <LoadingMask
                    className={styles.loadingMask}
                    active={isSubmitting}
                    caption="Submitting Store..."
                />
            </div>
        )
    }

    @action
    private onAdd = () => {
        clearFocus()
        this.datastore.addStore()
        this.system.fetchDataStores()
    }

    @action
    private onRemove = (storeName: string) => {
        clearFocus()
        this.datastore.removeStore(storeName)
        this.system.fetchDataStores()
    }

    @action
    private onClear = (storeName: string) => {
        clearFocus()
        this.datastore.clearStore(storeName)
        this.system.fetchDataStores()
    }

}

//
// Types
//

interface IProps {
    className?: string,
    datastore?: DataStore,
    system?: SystemStore,
}

//
// Helpers
//

function clearFocus() {
    const focusedElement: HTMLElement = document.querySelector(':focus')

    if (focusedElement) {
        focusedElement.blur()
    }
}
