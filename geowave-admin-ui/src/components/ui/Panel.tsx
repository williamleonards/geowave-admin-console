import * as React from 'react'
import * as $ from 'classnames'

import styles from './Panel.less'


export const Panel = ({
    className,
    classes,
    children,
    footer,
    header,
    title,
    subtitle,
}: IProps) => (
    <div className={$(styles.root, className)}>
        {(header || subtitle || title) && (
            <PanelHeader
                className={$(classes && classes.header)}
                classes={classes}
                subtitle={subtitle}
                title={title}
                children={header}
            />
        )}

        {children && (
            <div
                className={$(styles.body, classes && classes.body)}
                children={children}
            />
        )}

        {footer && (
            <PanelFooter
                className={$(classes && classes.footer)}
                children={footer}
            />
        )}
    </div>
)


export const PanelHeader = ({
    className,
    children,
    classes,
    title,
    subtitle,
}: IPropsHeader) => (
    <div className={$(styles.header, className)}>
        {title && (
            <div className={$(styles.title, classes && classes.title)}>{title}</div>
        )}
        {subtitle && (
            <div className={$(styles.subtitle, classes && classes.subtitle)}>{subtitle}</div>
        )}
        {children}
    </div>
)


export const PanelFooter = ({
    className,
    children,
}: IPropsFooter) => (
    <div className={$(styles.footer, className)}>
        {children}
    </div>
)


//
// Types
//

interface IProps {
    children?: any
    className?: string

    classes?: IClasses
    header?: any
    footer?: any
    subtitle?: string
    title?: string
}


interface IClasses extends IClassesHeader {
    body?: string
    header?: string
    footer?: string
}


interface IPropsHeader {
    className?: string
    children?: any

    classes?: IClassesHeader
    subtitle?: string
    title?: string
}


interface IPropsFooter {
    className?: string
    children?: any
}


interface IClassesHeader {
    subtitle?: string
    title?: string
}
