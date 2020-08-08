import * as React from 'react'
import * as $ from 'classnames'

import styles from './Tabs.less'


export const Tabs = ({
    className,
    classes,
    children,
    value,
    onChange,
}: ITabsProps) => {
    let content = null

    const tabs = React.Children.toArray(inspect(children)).map((child: any) => {
        const isActive = child.props.value === value
        if (isActive) {
            content = child.props.children
        }

        return React.cloneElement(child, {
            ...child.props,
            children: undefined,
            className: $(child.props.className, isActive && styles.isActive),
            _onClick: onChange && (() => onChange(child.props.value)),
        })
    })

    return (
        <div className={$(styles.tabs, className)}>
            <div className={$(styles.header, classes && classes.header)}>
                {tabs}
            </div>

            <div className={$(styles.track, classes && classes.track)} />

            <div className={$(styles.content, classes && classes.content)}>
                {content}
            </div>
        </div>
    )
}


export const Tab = ({
    className,
    label,
    _onClick,
}: ITabProps) => (
    <div className={$(styles.tab, className)} onClick={_onClick}>
        {label}
    </div>
)


interface ITabsProps {
    className?: string
    children?: any

    classes?: ITabsClasses
    value?: string

    onChange?(value: string): void
}


interface ITabProps {
    className?: string

    value: string
    label: string

    _onClick?(): void
}


interface ITabsClasses {
    content?: string
    header?: string
    track?: string
}


//
// Helpers
//

function inspect(nodes: React.ReactNode[]) {
    if (process.env.NODE_ENV !== 'production') {
        const types = new Set()
        React.Children.toArray(nodes).forEach((node: any) => {
            if (isValidNode(node)) {
                return
            }

            types.add(node.type.name || node.type)
        })

        if (types.size) {
            const itemizedTypes = Array.from(types).map(s => `\`${s}\``).sort().join(', ')
            console.warn(
                `<Tabs /> received children of type(s) ${itemizedTypes}. Children should be \`Tab\`.`,
            )
        }
    }

    return nodes
}


function isValidNode(node: React.ReactElement<any>) {
    return node.type === Tab
}
