import * as React from 'react'
import * as $ from 'classnames'
import { inject, observer } from 'mobx-react'
import { action } from 'mobx'

import { Label } from '../ui/Label'
import { Panel } from '../ui/Panel'
import { TextField } from '../ui/TextField'
import { Button } from '../ui/Button'
import { SystemStore } from '../../stores/SystemStore'
import { DataStore } from '../../stores/DataStore'

import styles from './css/GeoWaveList.less'

@inject('datastore', 'system')
@observer
export class AddStoreList extends React.Component<IProps, {}> {
    private static readonly MATCH_STORE_NAME: RegExp = /^[a-zA-Z0-9]*$/
    private datastore: DataStore
    private onAdd: () => void

    constructor(props: IProps) {
        super(props)
        this.onAdd = props.onAdd
        this.datastore = props.datastore
    }

    render() {
        const { canAdd } = this.datastore
        return (
            <Panel
                className={$(styles.root, this.props.className)}
                classes={{
                    body: styles.panelBody,
                }}
                title="New Data Store"
            >
                <div className={$(styles.list, styles.isActive)}>
                    <div className={styles.row}>
                        <Label
                            reversed
                            className={$(styles.column, styles.label)}
                            text="Data Store Name"
                        >
                        </Label>
                        <div className={$(styles.column, styles.details)}>
                            <TextField
                                className={styles.uri}
                                value={this.props.datastore.addStoreName}
                                onChange={this.textChange}
                                onKeyDown={this.submitStore}
                                placeholder={'gStore'}
                            />
                            <div className={styles.instructions}>
                                Data store names must be unique and alphanumeric
                            </div>
                        </div>
                        <Button 
                            primary 
                            disabled={!canAdd}
                            className={$(styles.button, styles.text)}
                            label={'Add'}
                            onClick={this.onAdd}
                            aria-label="Add Data Store"/>
                    </div>
                </div>
            </Panel>
        )
    }

    @action
    private textChange = (value: string): void => {
        if (value.match(AddStoreList.MATCH_STORE_NAME)) {
            this.props.datastore.changeAddStoreName(value);
        }
    }

    @action
    private submitStore = (event: KeyboardEvent): void => {
        if (event.keyCode == 13) {
            this.onAdd()
        }
    }
}

//
// Types
//

interface IProps {
    className?: string,
    datastore?: DataStore,
    system?: SystemStore,
    onAdd?: () => void;
}
