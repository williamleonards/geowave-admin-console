import * as React from 'react'
import { shallow } from 'enzyme'

import {
    Menu,
    MenuDivider,
    MenuHeader,
    MenuItem,
} from '../../../src/components/ui/Menu'


describe('<Menu/>', () => {
    it('can render', () => {
        const component = shallow(
            <Menu />,
        )

        expect(component.hasClass('menu')).toBeTruthy()
    })

    it('honors classname from props', () => {
        const component = shallow(
            <Menu className="test-classname" />,
        )

        expect(component.hasClass('test-classname')).toBeTruthy()
    })

    it('renders children', () => {
        const component = shallow(
            <Menu>
                <li>test-child-node-1</li>
                <li>test-child-node-2</li>
                <li>test-child-node-3</li>
            </Menu>,
        )

        expect(component.find('li').map(n => n.text())).toEqual([
            'test-child-node-1',
            'test-child-node-2',
            'test-child-node-3',
        ])
    })

    it('warns if children include dubious types', () => {
        const callArgs = []
        const spy = jest.spyOn(global.console, 'warn')
        spy.mockImplementation((...args) => callArgs.push(args))

        try {
            shallow(
                <Menu>
                    <MenuItem label="test-label" />
                    <li>test-li</li>
                    <strong>test-strong</strong>
                    <div>test-div1</div>
                    <div>test-div2</div>
                    <div>test-div3</div>
                    <h1>test-h1</h1>
                </Menu>,
            )

            expect(callArgs).toEqual([[
                '<Menu /> received children of type(s) `div`, `h1`, `strong`. Children should be `MenuItem`, `MenuHeader` or `MenuDivider`.',
            ]])
        }
        finally {
            spy.mockRestore()
        }
    })
})


describe('<MenuDivider/>', () => {
    it('can render', () => {
        const component = shallow(
            <MenuDivider />,
        )

        expect(component.hasClass('divider')).toBeTruthy()
    })

    it('honors classname from props', () => {
        const component = shallow(
            <MenuDivider className="test-classname" />,
        )

        expect(component.hasClass('test-classname')).toBeTruthy()
    })
})


describe('<MenuHeader/>', () => {
    it('can render', () => {
        const component = shallow(
            <MenuHeader label="test-label" />,
        )

        expect(component.hasClass('header')).toBeTruthy()
    })

    it('honors classname from props', () => {
        const component = shallow(
            <MenuHeader className="test-classname" label="test-label" />,
        )

        expect(component.hasClass('test-classname')).toBeTruthy()
    })

    it('renders label', () => {
        const component = shallow(
            <MenuHeader label="test-label" />,
        )

        expect(component.text()).toEqual('test-label')
    })
})


describe('<MenuItem/>', () => {
    it('can render', () => {
        const component = shallow(
            <MenuItem icon={<span>&times;</span>} label="test-label" />,
        )

        expect(component.hasClass('item')).toBeTruthy()
    })

    it('honors classname from props', () => {
        const component = shallow(
            <MenuItem className="test-classname" label="test-label" />,
        )

        expect(component.hasClass('test-classname')).toBeTruthy()
    })

    it('renders label', () => {
        const component = shallow(
            <MenuItem label="test-label" />,
        )

        expect(component.find('.label')).toHaveLength(1)
        expect(component.find('.label').text()).toEqual('test-label')
    })

    it('renders icon', () => {
        const component = shallow(
            <MenuItem icon={<span>&times;</span>} label="test-label" />,
        )

        expect(component.find('.icon')).toHaveLength(1)
        expect(component.find('.icon').contains(<span>&times;</span>)).toBeTruthy()
    })

    it('renders children as submenu', () => {
        const component = shallow(
            <MenuItem label="test-label">
                <MenuItem label="test-child-1" />
                <MenuItem label="test-child-2" />
            </MenuItem>,
        )

        component.setState({ isOpen: true })

        expect(component.find('.submenu')).toHaveLength(1)
        expect(component.find('.submenu').find('MenuItem')).toHaveLength(2)
        expect(component.find('.submenu').find('MenuItem').map(n => n.prop('label'))).toEqual([
            'test-child-1',
            'test-child-2',
        ])
    })

    it('renders caret if submenu exists', () => {
        const component = shallow(
            <MenuItem label="test-label">
                <MenuItem label="test-child-1" />
                <MenuItem label="test-child-2" />
            </MenuItem>,
        )

        expect(component.find('.caret')).toHaveLength(1)
    })

    it('does not render caret if submenu does not exist', () => {
        const component = shallow(
            <MenuItem label="test-label" />,
        )

        expect(component.find('.caret')).toHaveLength(0)
    })

    it('hides submenu by default', () => {
        const component = shallow(
            <MenuItem label="test-label">
                <MenuItem label="test-child-1" />
                <MenuItem label="test-child-2" />
            </MenuItem>,
        )

        expect(component.find('.submenu')).toHaveLength(0)
    })

    it('renders submenu when hovered', () => {
        const component = shallow(
            <MenuItem label="test-label">
                <MenuItem label="test-child-1" />
                <MenuItem label="test-child-2" />
            </MenuItem>,
        )

        component.simulate('mouseenter')

        expect(component.find('.submenu')).toHaveLength(1)
    })

    it('hides submenu when hovering out', () => {
        const component = shallow(
            <MenuItem label="test-label">
                <MenuItem label="test-child-1" />
                <MenuItem label="test-child-2" />
            </MenuItem>,
        )

        component.simulate('mouseenter')
        expect(component.find('.submenu')).toHaveLength(1)

        component.simulate('mouseleave')
        expect(component.find('.submenu')).toHaveLength(0)
    })
})
