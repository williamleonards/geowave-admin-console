import * as React from 'react'
import * as $ from 'classnames'

import styles from './Label.less'


export const Label = ({
    children,
    classes,
    className,
    disabled,
    passive,
    reversed,
    size,
    text,
    tooltip = text,
}: IProps) => {
    return React.createElement(passive ? 'div' : 'label', {
        title: tooltip,

        className: $(
            styles.root,
            className,
            size === 'large' && styles.isLarge,
            size === 'large' && classes && classes.isLarge,
            size === 'small' && styles.isSmall,
            size === 'small' && classes && classes.isSmall,
            disabled && styles.isDisabled,
            disabled && classes && classes.isDisabled,
            passive && styles.isPassive,
            passive && classes && classes.isPassive,
            reversed && styles.isReversed,
            reversed && classes && classes.isReversed,
        ),

        children: (
            <React.Fragment>
                {reversed && children}
                <span className={$(styles.text, classes && classes.text)}>{text}</span>
                {!reversed && children}
            </React.Fragment>
        ),
    })
}


interface IProps {
    className?: string
    children?: any

    classes?: IClasses
    disabled?: boolean
    passive?: boolean
    reversed?: boolean
    size?: 'large' | 'small'
    text: string
    tooltip?: string
}


interface IClasses {
    text?: string
    isDisabled?: string
    isLarge?: string
    isPassive?: string
    isReversed?: string
    isSmall?: string
}
