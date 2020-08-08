import * as React from 'react'
import * as $ from 'classnames'
import { inject, observer } from 'mobx-react'

import { Navigation } from '../Navigation'
import { LoadingMask } from '../LoadingMask'
import { IconExclamationTriangle, IconInfoCircle } from '../icons/font-awesome'
import { Button } from '../ui/Button'
import { IndexStore } from '../../stores/IndexStore'

import styles from './css/GeoWaveRoute.less'
import { AddIndexList } from './AddIndexList'

@inject('index')
@observer
export class IndexRoute extends React.Component<IProps, never> {
    componentWillUnmount() {
        this.props.index.reset()
    }

    render() {
        const { canStart, canRemove, isSubmitting } = this.props.index

        return (
            <div className={$(styles.root, this.props.className)}>
                <Navigation className={styles.nav}/>

                <div className={styles.content}>

                    <div className={styles.header}>
                        <div className={styles.title}>Index Data</div>
                    </div>

                    <div className={styles.messages}>
                        {this.props.index.messages.map(message => (
                            <div key={message.storeId} className={$(styles.message, message.status === 'error' && styles.isError)}>
                                {message.status === 'error'
                                    ? <IconExclamationTriangle className={styles.messageIcon}/>
                                    : <IconInfoCircle className={styles.messageIcon}/>}
                                <span className={styles.messageText}>
                                    Index <code>{message.storeId}</code> submitted, current status is <code>{message.status}</code>
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className={styles.panels}>
                        <AddIndexList/>
                    </div>

                    <div className={styles.footer}>
                        <Button
                            primary
                            className={styles.indexButton}
                            disabled={!canStart}
                            label="add Index"
                            onClick={this.onSubmitAdd}
                        />
                    </div>
                    <div className={styles.footer}>
                        <Button
                            primary
                            className={styles.indexButton}
                            disabled={!canRemove}
                            label="remove Index"
                            onClick={this.onSubmitRemove}
                        />
                    </div>
                </div>

                <LoadingMask
                    className={styles.loadingMask}
                    active={isSubmitting}
                    caption="Submitting Index Changing..."
                />
            </div>
        )
    }

    private onSubmitAdd = () => {
        clearFocus()
        this.props.index.startAdd()
    }

    private onSubmitRemove = () => {
        clearFocus()
        this.props.index.startRemove()
    }
}


//
// two button submit need to call two different start function
//

interface IProps {
    className?: string,
    index?: IndexStore
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
