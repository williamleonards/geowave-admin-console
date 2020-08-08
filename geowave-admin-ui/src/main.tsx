// Styles
import './styles/globals.less'


// Polyfills
import 'core-js/es7'


// Bootstrapping
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'

import { Application } from './components/Application'

import { createStores } from './stores'


const stores = window['___stores___'] = createStores()  // tslint:disable-line


ReactDOM.render(
    <Provider {...stores}>
        <Application/>
    </Provider>,
    document.querySelector('#Application'),
)
