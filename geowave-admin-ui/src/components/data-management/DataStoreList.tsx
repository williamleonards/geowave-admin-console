import * as React from 'react'
import * as $ from 'classnames'
import { observer, inject } from 'mobx-react'
import { observable, action } from 'mobx'

import { Label } from '../ui/Label'
import { Panel } from '../ui/Panel'
import { Button } from '../ui/Button'

import { SystemStore } from '../../stores/SystemStore'

import styles from './css/GeoWaveList.less'
import { IndexList } from './IndexList'
import { IndexStore } from '../../stores/IndexStore'

@inject('system','index')
@observer
export class DataStoreList extends React.Component<IProps, {}> {
    private system: SystemStore;
    private index: IndexStore;

    onRemove: (storeName: string) => void;
    onClear: (storeName: string) => void;
    onRemoveIndex: (indexName: string) => void;

    @observable private selectedStore: string = '';

    constructor(props: IProps) {
        super(props)
        this.system = observable(this.props.system)
        this.index = observable(this.props.index)
        this.onRemove = this.props.onRemove
        this.onClear = this.props.onClear
        this.onRemoveIndex = this.props.onRemoveIndex
    }
    
    componentDidMount() {
        // HACK HACK HACK HACK HACK HACK HACK HACK HACK
        // Workaround for bug G3-383
        this.props.system.fetchDataStores()
        // HACK HACK HACK HACK HACK HACK HACK HACK HACK
    }

    componentWillReceiveProps(){
        this.props.system.fetchDataStores()
        this.system = observable(this.props.system)
    }

    render() {
        const { className } = this.props
        return (
            <Panel
                className={$(styles.root, className)}
                classes={{
                    body: styles.panelBody,
                }}
                title="Current Data Stores"
            >
                <div className={styles.rows}>
                    {this.system.datastores.map(ds => ( 
                        <div 
                            key={ds.name} 
                            className={$(this.isSelected(ds.name) && styles.isActive, styles.list, styles.dataStoreItem)}
                            onClick={() => this.changeSelected(ds.name)}>
                            <div className={styles.row}>
                                <Label
                                    reversed
                                    className={$(styles.column, styles.label)}
                                    text={ds.name}
                                />
                                <div className={$(styles.column)}>
                                    {ds.type}
                                </div>
                                <Button
                                    className={$(styles.button, styles.text)}
                                    label={'Clear Data'}
                                    onClick={(evt) => {
                                        this.onClear(ds.name)
                                        evt.stopPropagation()
                                    }}
                                    aria-label="Clear Data Store"/>
                                <Button 
                                    danger 
                                    className={styles.button}
                                    dataButton={ds.name}
                                    onClick={(evt) => {
                                        this.onRemove(ds.name)
                                        evt.stopPropagation()
                                    }}
                                    aria-label="Remove Data Store">

                                    <span aria-hidden="true">&times;</span>
                                </Button>

                            </div>
                            <div className={styles.details}>
                                    <IndexList
                                        store = {ds}
                                        onRemoveIndex = {this.index.startRemove}
                                    />
                            </div>
                        </div>
                    ))}
                </div>
            </Panel>
        )
    }

    private isSelected = (name: string): boolean => {
        return name == this.selectedStore
    }
    
    @action
    private changeSelected = (name: string) => {
        this.selectedStore = (this.selectedStore == name) ? '' : name
    }
}


//
// Types
//

interface IProps {
    className?: string,
    system?: SystemStore,
    onRemove?: (storeName: string) => void,
    onClear?: (storeName: string) => void,
    onRemoveIndex?: (indexName: string) => void
    index?: IndexStore
}
