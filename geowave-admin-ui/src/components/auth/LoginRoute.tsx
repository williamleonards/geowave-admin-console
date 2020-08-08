import * as React from 'react'
import { inject, observer } from 'mobx-react'
import * as $ from 'classnames'
import { History, Location } from 'history'

import { LoadingMask } from '../LoadingMask'
import { Button } from '../ui/Button'
import { Label } from '../ui/Label'
import { TextField } from '../ui/TextField'
import { AuthStore } from '../../stores/AuthStore'
import * as url from '../../utils/url'

import styles from './LoginRoute.less'


@inject('auth')
@observer
export class LoginRoute extends React.Component<IProps, IState> {
    state = {
        username: '',
        password: '',
    }

    componentWillMount() {
        this.redirectIfLoggedIn()

        this.props.auth.checkCsrf()
    }

    componentDidUpdate() {
        this.redirectIfLoggedIn()
    }

    render() {
        const { isBadCredentials, isLoggingIn } = this.props.auth

        return (
            <div className={$(styles.root, this.props.className)}>
                <form className={styles.card} onSubmit={this.onFormSubmit} action="#" method="POST">

                    <section className={styles.cardHeader}>
                        Welcome to GeoWave Admin
                    </section>

                    <section className={styles.cardBody}>
                        {isBadCredentials && (
                            <div className={styles.error}>
                                <strong>Cannot log in:</strong> Invalid username and/or password
                            </div>
                        )}

                        <Label text="Username">
                            <TextField
                                autocomplete="username"
                                disabled={isLoggingIn}
                                onChange={this.onUsernameChange}
                                value={this.state.username}
                            />
                        </Label>
                        <Label text="Password">
                            <TextField
                                type="password"
                                autocomplete="current-password"
                                disabled={isLoggingIn}
                                onChange={this.onPasswordChange}
                                value={this.state.password}
                            />
                        </Label>
                    </section>

                    <section className={styles.cardFooter}>
                        <Button
                            primary
                            label="Log In"
                            className={styles.loginButton}
                            disabled={!this.canSubmit}
                            onClick={this.emitLogin}
                        />
                    </section>

                </form>

                <LoadingMask
                    className={styles.loadingMask}
                    active={isLoggingIn}
                    caption="Logging in... Please wait."
                />

            </div>
        )
    }

    private get canSubmit(): boolean {
        return !!this.state.username.trim()
            && !!this.state.password.trim()
            && !this.props.auth.isLoggingIn
    }

    private onFormSubmit = (event: React.SyntheticEvent<HTMLElement>) => {
        event.preventDefault()

        this.emitLogin()
    }

    private emitLogin = () => {
        if (!this.canSubmit) {
            return
        }

        this.props.auth.login(this.state.username, this.state.password)
    }

    private onUsernameChange = (value: string) => {
        this.setState({
            username: value,
        })
    }

    private onPasswordChange = (value: string) => {
        this.setState({
            password: value,
        })
    }

    private redirectIfLoggedIn() {
        if (!this.props.auth.isLoggedIn) {
            return
        }

        const { next } = url.deserializeSearch(this.props.location.search)
        this.props.history.push(next || '/')
    }
}


//
// Types
//

interface IProps {
    className?: string

    // From React Router
    history?: History
    location?: Location

    // From MobX
    auth?: AuthStore
}


interface IState {
    username?: string
    password?: string
}
