import * as React from 'react'
import { inject, observer } from 'mobx-react'
import * as $ from 'classnames'
import { Link } from 'react-router-dom'

import { GeoWaveIcon } from './GeoWaveIcon'
import { AuthStore } from '../stores/AuthStore'

import styles from './Titlebar.less'


@inject('auth')
@observer
export class Titlebar extends React.Component<IProps, {}> {
    render() {
        const { className } = this.props
        const { username } = this.props.auth

        return (
            <div className={$(styles.root, className)}>
                <div className={styles.column}>
                    <div className={styles.brand}>
                        <GeoWaveIcon className={styles.brandIcon}/>
                        <span className={styles.brandLabel}>GeoWave Admin</span>
                    </div>
                </div>

                <div className={styles.column}>
                    {username && (
                        <span className={styles.username}>{username}</span>
                    )}

                    {username
                        ? <Link className={styles.logout} to="/logout">Logout</Link>
                        : <Link className={styles.login} to="/login">Log In</Link>
                    }
                </div>
            </div>
        )
    }
}


//
// Types
//

interface IProps {
    className?: string

    auth?: AuthStore
}
