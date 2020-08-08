import * as React from 'react'
import * as $ from 'classnames'
import { NavLink, Route } from 'react-router-dom'

import styles from './Navigation.less'


export const Navigation = ({ className }: IProps) => (
    <div className={$(styles.root, className)}>
        <NavLink
            exact
            to="/"
            children="Status"
            activeClassName={styles.isActive}
            className={styles.section}
        />
        <NavLink
            to="/data-management"
            children="Data Management"
            activeClassName={styles.isActive}
            className={styles.section}
        />
        <Route path="/data-management" render={() => (
            <div className={styles.subsections}>
                <NavLink
                    to="/data-management/store"
                    children="Store"
                    activeClassName={styles.isActive}
                    className={styles.subsection}
                />
                <NavLink
                    to="/data-management/index"
                    children="Index"
                    activeClassName={styles.isActive}
                    className={styles.subsection}
                />
                <NavLink
                    to="/data-management/ingest"
                    children="Ingest"
                    activeClassName={styles.isActive}
                    className={styles.subsection}
                />
                <NavLink
                    to="/data-management/view"
                    children="View"
                    activeClassName={styles.isActive}
                    className={styles.subsection}
                />
                <NavLink
                    to="/data-management/copy"
                    children="Copy"
                    activeClassName={styles.isActive}
                    className={styles.subsection}
                />
                <NavLink
                    to="/data-management/export"
                    children="Export"
                    activeClassName={styles.isActive}
                    className={styles.subsection}
                />
                <NavLink
                    to="/data-management/statistics"
                    children="Statistics"
                    activeClassName={styles.isActive}
                    className={styles.subsection}
                />
            </div>
        )}/>
        <NavLink
            to="/analytics"
            children="Analytics"
            activeClassName={styles.isActive}
            className={styles.section}
        />
        <NavLink
            to="/system-config"
            children="System Configuration"
            activeClassName={styles.isActive}
            className={styles.section}
        />
        <NavLink
            to="/advanced"
            children="Advanced"
            activeClassName={styles.isActive}
            className={styles.section}
        />
    </div>
)


//
// Types
//

interface IProps {
    className?: string
}
