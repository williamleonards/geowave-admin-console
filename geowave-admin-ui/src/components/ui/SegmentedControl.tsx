import * as React from 'react'
import * as $ from 'classnames'

import styles from './SegmentedControl.less'


const DEFAULT_TABINDEX = 0
const KEY_ARROW_LEFT = 'ArrowLeft'
const KEY_ARROW_RIGHT = 'ArrowRight'


export class SegmentedControl extends React.Component<IProps, {}> {
    render() {
        return (
            <div
                tabIndex={this.props.tabIndex || DEFAULT_TABINDEX}
                className={$(
                    styles.root,
                    this.props.className,
                    this.props.disabled && styles.isDisabled,
                    this.props.disabled && this.props.classes && this.props.classes.isDisabled,
                )}
                onKeyDown={!this.props.disabled ? this.onKeyDown : undefined}
            >
                {this.props.items.map(item => (
                    <div
                        key={item.value}
                        className={$(
                            styles.item,
                            this.props.classes && this.props.classes.item,
                            this.props.value === item.value && styles.isSelected,
                            this.props.value === item.value && this.props.classes && this.props.classes.isSelectedItem,
                        )}
                        title={item.label}
                        onClick={!this.props.disabled ? () => this.emitOnChange(item.value) : undefined}
                    >
                        {item.label}
                    </div>
                ))}
            </div>
        )
    }

    private onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key !== KEY_ARROW_LEFT && event.key !== KEY_ARROW_RIGHT) {
            return  // Nothing to do
        }

        event.preventDefault()

        const index = this.props.items.findIndex(i => i.value === this.props.value)
        const nextItem = this.props.items[event.key === KEY_ARROW_LEFT ? index - 1 : index + 1]

        if (!nextItem) {
            return
        }

        this.emitOnChange(nextItem.value)
    }

    private emitOnChange(value: any) {
        if (value === this.props.value) {
            return  // Nothing to do
        }

        if (this.props.onChange) {
            this.props.onChange(value)
        }
    }
}


export interface IItem {
    value: any
    label: string
}


interface IClasses {
    item?: string
    isDisabled?: string
    isSelectedItem?: string
}


interface IProps {
    className?: string
    tabIndex?: number

    classes?: IClasses
    disabled?: boolean
    items?: IItem[]
    value: any

    onChange?(value: any): void
}
