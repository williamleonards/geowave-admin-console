import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { Redirect, Route, RouteProps } from 'react-router'

import { AuthStore } from '../../stores/AuthStore'
import * as url from '../../utils/url'


@inject('auth')
@observer
export class AuthenticatedRoute extends React.Component<IProps, {}> {
    render() {
        const { auth, component: Component, ...rest } = this.props
        const { isLoggedIn, isSessionExpired } = auth

        return (
            <Route
                {...rest}
                render={({ location }) => {
                    if (isLoggedIn) {
                        return <Component {...rest}/>
                    }

                    if (isSessionExpired) {
                        return <Redirect to={{ pathname: '/logout', search: url.next(location, 'expired') }}/>
                    }

                    return <Redirect to={{ pathname: '/login', search: url.next(location) }}/>
                }}
            />
        )
    }
}


//
// Types
//

interface IProps extends RouteProps {
    auth?: AuthStore
}
