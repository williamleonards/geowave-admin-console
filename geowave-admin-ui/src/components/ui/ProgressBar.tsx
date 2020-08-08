import * as React from 'react'
import * as $ from 'classnames'

import styles from './ProgressBar.less'


export const ProgressBar = ({
    className,
    classes,
    children,
    value = null,
}: IProps) => (
    <div className={$(
        styles.root,
        className,
        value === null && styles.isIndeterminate,
    )}>
        <span
            className={$(styles.puck, classes && classes.puck)}
            style={{
                width: `${Math.min(inspect(value), 100)}%`,
            }}
        />

        {children && (
            <span className={$(styles.content, classes && classes.content)}>
                {children}
            </span>
        )}
    </div>
)


interface IProps {
    className?: string
    children?: any

    classes?: IClasses
    value?: number
}


interface IClasses {
    puck?: string
    content?: string
}


//
// Helpers
//

function inspect(value: number): number {
    if (process.env.NODE_ENV !== 'production') {
        if ((!Number.isInteger(value) && value !== null) || value < 0 || value > 100) {
            console.warn(`[ProgressBar] \`value\` should be an number between 0 and 100, not '${value}'.`)
        }
    }

    return value
}
