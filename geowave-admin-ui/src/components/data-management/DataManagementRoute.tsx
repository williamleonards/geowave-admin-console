import * as React from 'react'
import { observer } from 'mobx-react'
import * as $ from 'classnames'

import { Navigation } from '../Navigation'

import styles from './css/GeoWaveRoute.less'

@observer
export class DataManagementRoute extends React.Component<IProps, never> {
    render() {
        return (
            <div className={$(styles.root, this.props.className)}>
                <Navigation className={styles.nav}/>

            </div>
        )
    }
}


//
// Types
//

interface IProps {
    className?: string
}
