import * as React from 'react'
import * as $ from 'classnames'
import { inject, observer } from 'mobx-react'

import { Label } from '../ui/Label'
import { Panel } from '../ui/Panel'
import { TextField } from '../ui/TextField'
import { SystemStore } from '../../stores/SystemStore'

import styles from './css/GeoWaveList.less'
import { IndexStore } from '../../stores/IndexStore'
import { action } from 'mobx'

@inject('index')
@observer
export class AddIndexList extends React.Component<IProps, {}> {
    private static readonly MATCH_NAME: RegExp = /^[a-zA-Z0-9]*$/;

    render() {
        return (
            <Panel
                className={$(styles.root, this.props.className)}
                classes={{
                    body: styles.panelBody,
                }}
                title="Index"
            >   
                <div className={$(styles.list, styles.isActive)}>
                    <div className={styles.row}>
                        <Label
                            reversed
                            className={$(styles.column, styles.label)}
                            text="Input Index Here"
                        >
                        </Label>
                        <div className={$(styles.column, styles.details)}>
                            <TextField
                                className={styles.uri}
                                value={this.props.index.storename}
                                onChange={this.textChangeStore}
                            />
                            <div className={styles.instructions}>
                                store name 
                            </div>
                            <TextField
                                className={styles.uri}
                                value={this.props.index.indexname}
                                onChange={this.textChangeIndex}
                            />
                            <div className={styles.instructions}>
                                index name
                            </div>
                            <TextField
                                className={styles.uri}
                                value={this.props.index.type}
                                onChange={this.textChangeType}
                            />
                            <div className={styles.instructions}>
                                type(only for add index)
                            </div>
                        </div>
                    </div>
                </div>
            </Panel>
            
        )
    }

    @action
    private textChangeStore = (value: string): void => {
        if (value.match(AddIndexList.MATCH_NAME)) {
            this.props.index.changeStoreName(value);
        }
    }

    @action
    private textChangeIndex = (value: string): void => {
        if (value.match(AddIndexList.MATCH_NAME)) {
            this.props.index.changeIndexName(value);
        }
    }

    @action
    private textChangeType = (value: string): void => {
        if (value.match(AddIndexList.MATCH_NAME)) {
            this.props.index.changeTypeName(value);
        }
    }
}

//
// Types
//

interface IProps {
    className?: string,
    index?: IndexStore,
    system?: SystemStore
}
