import * as React from 'react'
import * as $ from 'classnames'

import styles from './TextField.less'


const DEFAULT_TYPE = 'text'
const DEFAULT_LINES = 3


export const TextField = ({
    className,
    autocomplete,
    disabled,
    lines = DEFAULT_LINES,
    multiline,
    maxLength,
    placeholder,
    type = DEFAULT_TYPE,
    value,
    onChange,
    onKeyDown,
}: IProps) => (
    multiline ? (
        <textarea
            disabled={disabled}
            className={$(
                styles.root,
                className,
            )}
            maxLength={maxLength}
            placeholder={placeholder}
            value={value}
            rows={lines}
            onChange={disabled ? undefined : e => onChange && onChange(e.target.value)}
            onKeyDown={disabled? undefined : e => onKeyDown && onKeyDown(e)}
        />
    ) : (
        <input
            disabled={disabled}
            autoComplete={autocomplete}
            className={$(
                styles.root,
                className,
            )}
            maxLength={maxLength}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={disabled ? undefined : e => onChange && onChange(e.target.value)}
            onKeyDown={disabled? undefined : e => onKeyDown && onKeyDown(e)}
        />
    )
)


interface IProps {
    className?: string
    tabIndex?: number

    autocomplete?: string
    disabled?: boolean
    lines?: number
    maxLength?: number
    multiline?: boolean
    placeholder?: string
    type?: 'email' | 'tel' | 'text' | 'password'
    value: string

    onChange?(value: string): void
    //TODO: better type check
    onKeyDown?(event: any): void
}
