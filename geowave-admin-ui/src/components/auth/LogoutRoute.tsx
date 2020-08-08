import * as React from 'react'
import { inject, observer } from 'mobx-react'
import * as $ from 'classnames'
import { Link } from 'react-router-dom'

import { AuthStore } from '../../stores/AuthStore'
import * as url from '../../utils/url'

import styles from './LogoutRoute.less'


@inject('auth')
@observer
export class LogoutRoute extends React.Component<IProps, {}> {
    componentWillMount() {
        this.props.auth.logout()
    }

    render() {
        const { next = '/' } = url.deserializeSearch()

        return (
            <div className={$(styles.root, this.props.className)}>
                <div className={styles.card}>
                    <div className={styles.heading}>
                        {location.search.match(/expired/i)
                            ? `You were automatically logged out because of inactivity`
                            : `You've logged out`}
                    </div>

                    <Link
                        className={styles.loginLink}
                        children="Click here to log back in"
                        to={{
                            pathname: '/login',
                            search: url.serializeSearch(null, `next=${next}`),
                        }}
                    />
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
