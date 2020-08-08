import * as React from 'react'
import * as $ from 'classnames'

import styles from './Pager.less'


const DEFAULT_PADDING = 2


export class Pager extends React.Component<IProps, {}> {
    render() {
        const { pages } = this

        return (
            <div
                className={$(
                    styles.root,
                    this.props.className,
                    this.props.disabled && styles.isDisabled,
                    this.props.disabled && this.props.classes && this.props.classes.isDisabled,
                )}
            >
                <div
                    className={$(
                        styles.previous,
                        this.props.classes && this.props.classes.previous,
                        this.props.classes && this.props.classes.button,
                        this.props.value <= 1 && styles.isDisabled,
                        this.props.value <= 1 && this.props.classes && this.props.classes.previousDisabled,
                    )}
                    title="Go to previous page"
                    onClick={this.onPreviousButtonClick}
                >
                    <svg className={$(styles.chevron, this.props.classes && this.props.classes.chevron)} viewBox="0 0 10 10">
                        <polyline points="7 1 3 5 7 9" />
                    </svg>
                </div>

                {paddedRange(this.props.value, pages, this.props.padding).map(n => (
                    <div
                        key={n}
                        className={$(
                            styles.page,
                            this.props.classes && this.props.classes.page,
                            this.props.classes && this.props.classes.button,
                            this.props.value === n && styles.isActive,
                            this.props.value === n && this.props.classes && this.props.classes.activePage,
                        )}
                        title={`Go to page ${n}`}
                        onClick={() => this.emitChange(n)}
                    >
                        {n}
                    </div>
                ))}

                <div
                    className={$(
                        styles.next,
                        this.props.classes && this.props.classes.next,
                        this.props.classes && this.props.classes.button,
                        this.props.value >= pages && styles.isDisabled,
                        this.props.value >= pages && this.props.classes && this.props.classes.nextDisabled,
                    )}
                    title="Go to next page"
                    onClick={this.onNextButtonClick}
                >
                    <svg className={$(styles.chevron, this.props.classes && this.props.classes.chevron)} viewBox="0 0 10 10">
                        <polyline points="3 1 7 5 3 9" />
                    </svg>
                </div>
            </div>
        )
    }

    private get pages(): number {
        return Math.ceil(this.props.totalCount / this.props.size)
    }

    private onPreviousButtonClick = () => {
        this.emitChange(this.props.value - 1)
    }

    private onNextButtonClick = () => {
        this.emitChange(this.props.value + 1)
    }

    private emitChange(value: number) {
        if (this.props.disabled) {
            return
        }

        const normalizedValue = Math.max(1, Math.min(this.pages, value))

        if (normalizedValue === this.props.value) {
            return  // Nothing to do
        }

        if (this.props.onChange) {
            this.props.onChange(normalizedValue)
        }
    }
}


interface IProps {
    className?: string

    classes?: IClasses
    disabled?: boolean
    padding?: number
    size: number
    tabIndex?: number
    totalCount: number
    value: number

    onChange?(value: number)
}


interface IClasses {
    activePage?: string
    button?: string
    chevron?: string
    isDisabled?: string
    next?: string
    nextDisabled?: string
    page?: string
    previous?: string
    previousDisabled?: string
}


//
// Helpers
//

function paddedRange(center: number, max: number, padding: number = DEFAULT_PADDING) {
    const numbers = []

    const left = Math.max(1, (center - padding) + Math.min(0, max - (center + padding)))
    const right = Math.min(max, (center + padding) - Math.min(0, center - padding - 1))

    for (let i = left; i <= right; i++) {
        numbers.push(i)
    }

    return numbers
}
