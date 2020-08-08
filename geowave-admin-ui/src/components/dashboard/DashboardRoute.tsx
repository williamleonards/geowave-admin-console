import { inject, observer } from 'mobx-react'
import * as React from 'react'
import * as $ from 'classnames'

import { LoadingMask } from '../LoadingMask'
import { Navigation } from '../Navigation'
import { Operation } from './Operation'
import { Panel } from '../ui/Panel'
import { SystemStore } from '../../stores/SystemStore'
import * as numbers from '../../utils/numbers'

import styles from './DashboardRoute.less'


const POLL_INTERVAL = 15000


@inject('system')
@observer
export class DashboardRoute extends React.Component<IProps, {}> {
    private pollingInterval: any

    componentWillMount() {
        this.props.system.fetchInfo()

        this.enableSystemInfoPolling()
    }

    componentWillUnmount() {
        this.disableSystemInfoPolling()
    }

    render() {
        const { componentVersions, isFetchingInfo, operations, recordCount } = this.props.system

        return (
            <div className={$(styles.root, this.props.className)}>
                <Navigation className={styles.nav}/>

                <div className={styles.content}>

                    <div className={styles.title}>
                        System Information
                    </div>

                    <div className={styles.panels}>
                        <Panel className={styles.panel} title="Operations" classes={{ body: styles.operationsBody }}>
                            {operations.map(o => (
                                <Operation
                                    key={o.identifier}
                                    operation={o}
                                />
                            ))}
                        </Panel>

                        <Panel className={styles.panel} title="Metrics">
                            <div className={styles.metric}>
                                <span className={styles.metricName}>Number of Records</span>
                                <span className={styles.metricValue}>{numbers.humanize(recordCount)}</span>
                            </div>
                        </Panel>

                        <Panel className={styles.panel} title="GeoWave Components">
                            {componentVersions.map(cv => (
                                <div key={cv.name} className={styles.metric}>
                                    <span className={styles.metricName}>{cv.name}</span>
                                    <span className={styles.metricValue}>{cv.version}</span>
                                </div>
                            ))}
                        </Panel>
                    </div>
                </div>

                <LoadingMask
                    active={isFetchingInfo}
                    caption="Looking up system info"
                />
            </div>
        )
    }

    private enableSystemInfoPolling() {
        this.pollingInterval = setInterval(this.props.system.fetchInfo, POLL_INTERVAL)
    }

    private disableSystemInfoPolling() {
        clearInterval(this.pollingInterval)
    }
}


//
// Types
//

interface IProps {
    className?: string

    system?: SystemStore
}
