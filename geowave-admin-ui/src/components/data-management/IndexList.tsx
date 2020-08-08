import * as React from 'react'
import * as $ from 'classnames'
import { observer, inject } from 'mobx-react'
import { observable, runInAction } from 'mobx'

import { Label } from '../ui/Label'
import { Button } from '../ui/Button'

import { IIndex, IDataStore } from '../../stores/SystemStore'
import { IndexStore } from '../../stores/IndexStore'

import styles from './css/GeoWaveList.less'

@inject('index')
@observer
export class IndexList extends React.Component<IProps, {}> {
    onRemoveIndex: (indexName: string) => void;

    @observable store: IDataStore;
    @observable indices: IIndex[];

    constructor(props: IProps) {
        super(props)
        this.onRemoveIndex = props.onRemoveIndex
        this.store = props.store
        this.indices = []
    }
    
    componentDidMount() {
        // HACK HACK HACK HACK HACK HACK HACK HACK HACK
        // Workaround for bug G3-383
        this.props.index.fetchStoreIndices(this.store.name).then( (idxlist) => {
            runInAction(() => this.indices = idxlist)
        })
        // HACK HACK HACK HACK HACK HACK HACK HACK HACK
    }

    componentWillReceiveProps(){
       // this.props.index.fetchStoreIndices(this.store.name)
    }

    render() {
        return (
            <div className={styles.rows}>
            {this.indices.map((idx: IIndex) => (
                <div className={styles.row}>
                    <Label
                        reversed
                        className={$(styles.column, styles.label)}
                        text={idx.name}
                    />
                    <div className={$(styles.column)}>
                        {idx.type}
                    </div>
                    <Button 
                        danger 
                        className={styles.button}
                        dataButton={idx.name}
                        onClick={(evt) => {
                            this.onRemoveIndex(idx.name)
                            evt.stopPropagation()
                        }}
                        aria-label="Remove Index">
                    </Button>
                </div>
            ))}
        </div>
        )
    }
}

//
// Types
//

interface IProps {
    className?: string,
    store: IDataStore,
    onRemoveIndex?: (indexName: string) => void,
    index?: IndexStore
}
