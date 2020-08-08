import * as React from 'react'
import * as $ from 'classnames'

import styles from './Checkbox.less'


const DEFAULT_TAB_INDEX = 0
const KEY_ENTER = 'Enter'
const KEY_SPACE = ' '


export const Checkbox = ({
    className,
    checked,
    classes,
    disabled,
    tabIndex,
    onChange,
}: IProps) => (
    <span
        tabIndex={tabIndex || DEFAULT_TAB_INDEX}
        className={$(
            styles.root,
            className,
            checked === true && styles.isChecked,
            checked === null && styles.isIndeterminate,
            disabled && styles.isDisabled,
        )}
        onClick={(event) => {
            // Stop label ancestor from replaying `click` event to the <input/>
            event.preventDefault()

            return !disabled && onChange && onChange(!checked)
        }}
        onKeyDown={(e) => !disabled && onChange && isToggleKey(e.key) && onChange(!checked)}
    >
        <input
            readOnly
            type="checkbox"
            checked={checked}
            disabled={disabled}
        />
        <svg viewBox="0 0 16 16">
            {checked === true && (
                <polyline
                    className={$(styles.check, classes && classes.check)}
                    points="13.3578157 5 6.48796896 12 2.5 8.07925674"
                />
            )}
            {checked === null && (
                <rect
                    className={$(styles.dash, classes && classes.dash)}
                    x="4"
                    y="7"
                    width="8"
                    height="2"
                />
            )}
        </svg>
    </span>
)


interface IProps {
    className?: string
    tabIndex?: number

    classes?: IClasses
    checked?: boolean
    disabled?: boolean

    onChange?(value: boolean): void
}


interface IClasses {
    check?: string
    dash?: string
}


function isToggleKey(key: string) {
    return key === KEY_SPACE || key === KEY_ENTER
}
