import * as React from 'react'
import * as $ from 'classnames'
import { Location } from 'history'
import { IconExclamationTriangle } from './icons/font-awesome'

import { Navigation } from './Navigation'

import styles from './UnknownRoute.less'


export const UnknownRoute = ({ className, location }: IProps) => (
    <div className={$(styles.root, className)}>
        <Navigation/>

        <div className={styles.content}>
            <div className={styles.heading}>
                <IconExclamationTriangle className={styles.icon} />
                Not Found <code>{location.pathname}</code>
            </div>

            <p>
                The URL you're trying to visit doesn't match any known application
                URLs. You can use the navigation menu to find the operation you're
                looking for.
            </p>
        </div>
    </div>
)


//
// Types
//

interface IProps {
    className?: string

    location: Location
}
