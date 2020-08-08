import * as React from 'react'
import * as $ from 'classnames'

import * as timestamps from '../../utils/timestamps'
import { IOperation } from '../../stores/SystemStore'

import styles from './Operation.less'


export const Operation = ({ className, operation }: IProps) => (
    <div
        className={$(
            styles.root,
            className,
            styles[operation.status],
        )}
    >
        <div className={styles.identifier}>{operation.identifier}</div>

        <div className={styles.status} title={createTooltip(operation)}>
            <span className={styles.statusOrb}/>
            <span className={styles.statusText}>{operation.status}</span>
            <span className={styles.statusElapsed}>{timestamps.elapsed(operation.timeStarted)}</span>
        </div>
    </div>
)


//
// Types
//

interface IProps {
    className?: string

    operation: IOperation
}


//
// Helpers
//

function createTooltip(op: IOperation) {
    let value = `Started: ${timestamps.format(op.timeStarted)}`
    if (op.timeStopped) {
        value += ` \nStopped: ${timestamps.format(op.timeStopped)}`
    }

    return value
}
