import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { AuthenticatedRoute } from './auth/AuthorizedRoute'
import { DashboardRoute } from './dashboard/DashboardRoute'
import { DataManagementRoute } from './data-management/DataManagementRoute'
import { IngestRoute } from './data-management/IngestRoute'
import { DataStoreRoute } from './data-management/DataStoreRoute'

import { ErrorModal } from './ErrorModal'
import { LoginRoute } from './auth/LoginRoute'
import { LogoutRoute } from './auth/LogoutRoute'
import { Titlebar } from './Titlebar'
import { UnknownRoute } from './UnknownRoute'
import { AuthStore } from '../stores/AuthStore'
import { ErrorStore } from '../stores/ErrorStore'

import styles from './Application.less'
import { IndexRoute } from './data-management/IndexRoute'


@inject('auth', 'errors')
@observer
export class Application extends React.Component<IProps, {}> {
    componentDidMount() {
        this.props.auth.checkSession()
    }

    render() {
        const { errors } = this.props

        return (
            <BrowserRouter>
                <main className={styles.root}>
                    <Titlebar className={styles.titlebar}/>

                    <div className={styles.content}>
                        <Switch>
                            <Route exact path="/login" component={LoginRoute}/>
                            <Route exact path="/logout" component={LogoutRoute}/>
                            <AuthenticatedRoute exact path="/" component={DashboardRoute}/>
                            <AuthenticatedRoute exact path="/data-management" component={DataManagementRoute}/>
                            <AuthenticatedRoute exact path="/data-management/ingest" component={IngestRoute}/>
                            <AuthenticatedRoute exact path="/data-management/store" component={DataStoreRoute}/>
                            <AuthenticatedRoute exact path="/data-management/index" component={IndexRoute}/>
                            <AuthenticatedRoute component={UnknownRoute}/>
                        </Switch>
                    </div>

                    {errors.items.map(error => (
                        <ErrorModal
                            key={error.id}
                            error={error}
                            onDismiss={this.onDismissError}
                        />
                    ))}
                </main>
            </BrowserRouter>
        )
    }

    private onDismissError = (id: string) => {
        this.props.errors.dismiss(id)
    }
}


interface IProps {
    auth?: AuthStore
    errors?: ErrorStore
}
