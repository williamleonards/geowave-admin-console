import * as React from 'react'
import * as $ from 'classnames'
import { inject, observer } from 'mobx-react'

import { DestinationList } from './DestinationList'
import { Navigation } from '../Navigation'
import { SourceList } from './SourceList'
import { LoadingMask } from '../LoadingMask'
import { IconExclamationTriangle, IconInfoCircle } from '../icons/font-awesome'
import { Button } from '../ui/Button'
import { IngestStore } from '../../stores/IngestStore'

import styles from './css/GeoWaveRoute.less'


@inject('ingest')
@observer
export class IngestRoute extends React.Component<IProps, never> {
    componentWillUnmount() {
        this.props.ingest.reset()
    }

    render() {
        const { canStart, isSubmitting } = this.props.ingest

        return (
            <div className={$(styles.root, this.props.className)}>
                <Navigation className={styles.nav}/>

                <div className={styles.content}>

                    <div className={styles.header}>
                        <div className={styles.title}>Ingest Data</div>
                        <Button
                            primary
                            className={styles.storeButton}
                            disabled={!canStart}
                            label="Ingest"
                            onClick={this.onSubmit}
                        />
                    </div>

                    <div className={styles.messages}>
                        {this.props.ingest.messages.map(message => (
                            <div key={message.storeId} className={$(styles.message, message.status === 'error' && styles.isError)}>
                                {message.status === 'error'
                                    ? <IconExclamationTriangle className={styles.messageIcon}/>
                                    : <IconInfoCircle className={styles.messageIcon}/>}
                                <span className={styles.messageText}>
                                    Ingest <code>{message.storeId}</code> submitted, current status is <code>{message.status}</code>
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className={styles.panels}>
                        <SourceList 
                            className={styles.sources}/>
                        <DestinationList className={styles.destination}/>
                    </div>

                    <div className={styles.footer}>
                        <Button
                            primary
                            className={styles.storeButton}
                            disabled={!canStart}
                            label="Ingest"
                            onClick={this.onSubmit}
                        />
                    </div>
                </div>

                <LoadingMask
                    className={styles.loadingMask}
                    active={isSubmitting}
                    caption="Submitting Ingest..."
                />
            </div>
        )
    }

    private onSubmit = () => {
        clearFocus()
        this.props.ingest.start()
    }
}


//
// Types
//

interface IProps {
    className?: string

    ingest?: IngestStore
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
