import * as React from 'react'
import * as $ from 'classnames'
import { IError } from '../stores/ErrorStore'

import { Button } from './ui/Button'
import styles from './ErrorModal.less'


export class ErrorModal extends React.Component<IProps, {}> {
    componentDidMount() {
        clearFocus()
    }

    render() {
        const { className, error, onDismiss } = this.props

        return (
            <div className={$(styles.root, className)}>
                <div className={styles.heading}>{error.heading}</div>
                <div className={styles.description}>{error.description}</div>

                {process.env.NODE_ENV !== 'production' && error.err && (
                    <pre className={styles.stacktrace}>{error.err.stack}</pre>
                )}

                <div className={styles.controls}>
                    <Button
                        className={styles.dismissButton}
                        label="Dismiss"
                        onClick={() => onDismiss(error.id)}
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

    error: IError

    onDismiss(id: string): void
}


//
// Helpers
//

function clearFocus() {
    const focusedElement: HTMLElement = document.querySelector(':focus')

    if (focusedElement) {
        focusedElement.blur()
    }
}
