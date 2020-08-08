import * as React from 'react'
import * as $ from 'classnames'

import styles from './Button.less'


export const Button = ({
    className,
    classes,
    disabled,
    primary,
    danger,
    icon,
    children,
    label,
    onClick,
    dataButton,
}: IProps) => (
    <button
        disabled={disabled}
        className={$(
            styles.root,
            className,
            disabled && styles.disabled,
            primary && styles.primary,
            danger && styles.danger,
            classes && classes.disabled,
        )}
        onClick={disabled ? undefined : onClick}
        data-button={dataButton}
    >
        {icon && (
            <span className={$(styles.icon, classes && classes.icon)}>{icon}</span>
        )}
        {label && (
            <span className={$(styles.label, classes && classes.label)}>{label}</span>
        )}
        {children}
    </button>
)


interface IProps {
    className?: string
    children?: any

    classes?: IClasses
    danger?: boolean
    disabled?: boolean
    icon?: any
    label?: string
    primary?: boolean
    // TODO typecheck better
    onClick?(event?: any): void
    dataButton?: any
}


interface IClasses {
    disabled?: string
    icon?: string
    label?: string
}
