import * as React from 'react'
import * as $ from 'classnames'

import styles from './Menu.less'


export const Menu = ({
    className,
    children,
}: IMenuProps) => (
    <ul className={$(styles.menu, className)}>
        {inspect(children)}
    </ul>
)


export const MenuDivider = (props: IDividerProps) => (
    <li className={$(styles.divider, props.className)}/>
)


export const MenuHeader = (props: IHeaderProps) => (
    <li className={$(styles.header, props.className)}>{props.label}</li>
)


export class MenuItem extends React.Component<IItemProps, IItemState> {
    state = {
        isOpen: false,
    }

    render() {
        return (
            <li
                className={$(
                    styles.item,
                    this.props.className,
                    this.props.disabled && styles.isDisabled,
                    this.props.selected && styles.isSelected,
                    this.state.isOpen && styles.isOpen,
                )}
                title={this.props.label}
                onClick={!this.props.disabled ? this.props.onClick : undefined}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                <span className={styles.icon}>{this.props.icon}</span>
                <span className={styles.label}>{this.props.label}</span>

                {this.props.children && (
                    <svg className={styles.caret} viewBox="0 0 10 10">
                        <polygon points="1 1 5 5 1 9"/>
                    </svg>
                )}

                {this.props.children && this.state.isOpen && (
                    <Menu className={styles.submenu}>{this.props.children}</Menu>
                )}
            </li>
        )
    }

    private onMouseEnter = () => {
        if (!this.props.children || this.state.isOpen) {
            return
        }

        this.setState({ isOpen: true })
    }

    private onMouseLeave = () => {
        if (!this.props.children || !this.state.isOpen) {
            return
        }

        this.setState({ isOpen: false })
    }
}


interface IDividerProps {
    className?: string
}


interface IHeaderProps {
    className?: string

    label: string

    onClick?(e: React.MouseEvent<HTMLElement>): void
}


interface IItemProps {
    className?: string
    children?: any

    icon?: any
    disabled?: boolean
    label: string
    selected?: boolean

    onClick?(e: React.MouseEvent<HTMLElement>): void
}


interface IItemState {
    isOpen?: boolean
}


interface IMenuProps {
    className?: string
    children?: any
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
                `<Menu /> received children of type(s) ${itemizedTypes}. Children ` +
                'should be `MenuItem`, `MenuHeader` or `MenuDivider`.',
            )
        }
    }

    return nodes
}


function isValidNode(node: React.ReactElement<any>) {
    return node.type === MenuItem
        || node.type === MenuHeader
        || node.type === MenuDivider
        || node.type === 'li'
}
