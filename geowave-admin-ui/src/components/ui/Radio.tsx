import * as React from 'react'
import * as $ from 'classnames'

import styles from './Radio.less'


const DEFAULT_TAB_INDEX = 0
const KEY_ENTER = 'Enter'
const KEY_SPACE = ' '


export const Radio = ({
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

            return !disabled && !checked && onChange && onChange(true)
        }}
        onKeyDown={(e) => !disabled && !checked && isToggleKey(e.key) && onChange && onChange(true)}
    >
        <input
            readOnly
            type="radio"
            checked={checked}
            disabled={disabled}
        />
        <svg viewBox="0 0 10 10">
            <circle
                className={$(styles.ring, classes && classes.ring)}
                cx="5"
                cy="5"
                r="4"
            />
            {(checked === true || checked === null) && (
                <circle
                    className={$(styles.dot, classes && classes.dot)}
                    cx="5"
                    cy="5"
                    r="2"
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
    ring?: string
    dot?: string
}


function isToggleKey(key: string) {
    return key === KEY_SPACE || key === KEY_ENTER
}
