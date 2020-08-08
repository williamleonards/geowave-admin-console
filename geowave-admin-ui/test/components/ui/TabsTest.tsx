import * as React from 'react'
import { mount, shallow } from 'enzyme'

import {
    Tabs,
    Tab,
} from '../../../src/components/ui/Tabs'


describe('<Tabs/>', () => {
    it('can render', () => {
        const component = shallow(
            <Tabs />,
        )

        expect(component.hasClass('tabs')).toBeTruthy()
    })

    it('honors classname from props', () => {
        const component = shallow(
            <Tabs className="test-classname" />,
        )

        expect(component.hasClass('test-classname')).toBeTruthy()
    })

    it('renders correct active tab', () => {
        const component = shallow(
            <Tabs value="test-value-2">
                <Tab value="test-value-1" label="test-label-1">
                    <span>test-tab-content-1</span>
                </Tab>
                <Tab value="test-value-2" label="test-label-2">
                    <span>test-tab-content-2</span>
                </Tab>
            </Tabs>,
        )

        expect(component.find('.isActive')).toHaveLength(1)
        expect(component.find('.isActive').prop('value')).toEqual('test-value-2')
    })

    it('renders active tab content', () => {
        const component = shallow(
            <Tabs value="test-value-2">
                <Tab value="test-value-1" label="test-label-1">
                    <span>test-tab-content-1</span>
                </Tab>
                <Tab value="test-value-2" label="test-label-2">
                    <span>test-tab-content-2</span>
                </Tab>
            </Tabs>,
        )

        expect(component.find('.content').children()).toHaveLength(1)
        expect(component.find('.content').contains(<span>test-tab-content-2</span>)).toBeTruthy()
    })

    it('renders tab headers', () => {
        const component = shallow(
            <Tabs>
                <Tab value="test-value-1" label="test-label-1" />
                <Tab value="test-value-2" label="test-label-2" />
            </Tabs>,
        )

        expect(component.find(Tab)).toHaveLength(2)
        expect(component.find(Tab).map(n => n.prop('label'))).toEqual([
            'test-label-1',
            'test-label-2',
        ])
        expect(component.find(Tab).map(n => n.prop('value'))).toEqual([
            'test-value-1',
            'test-value-2',
        ])
    })

    it('does not render tab content if value does not match anything', () => {
        const component = shallow(
            <Tabs value="lolwut">
                <Tab value="test-value-1" label="test-label-1">
                    <span>test-tab-content-1</span>
                </Tab>
                <Tab value="test-value-2" label="test-label-2">
                    <span>test-tab-content-2</span>
                </Tab>
            </Tabs>,
        )

        expect(component.find('.content').children()).toHaveLength(0)
    })

    it('does not render tab content if value is missing', () => {
        const component = shallow(
            <Tabs>
                <Tab value="test-value-1" label="test-label-1">
                    <span>test-tab-content-1</span>
                </Tab>
                <Tab value="test-value-2" label="test-label-2">
                    <span>test-tab-content-2</span>
                </Tab>
            </Tabs>,
        )

        expect(component.find('.content').children()).toHaveLength(0)
    })

    it('does not indicate active tab if value missing', () => {
        const component = shallow(
            <Tabs>
                <Tab value="test-value-1" label="test-label-1">
                    <span>test-tab-content-1</span>
                </Tab>
                <Tab value="test-value-2" label="test-label-2">
                    <span>test-tab-content-2</span>
                </Tab>
            </Tabs>,
        )

        expect(component.find('.isActive')).toHaveLength(0)
    })

    it('does not indicate active tab if value does not match anything', () => {
        const component = shallow(
            <Tabs value="lolwut">
                <Tab value="test-value-1" label="test-label-1">
                    <span>test-tab-content-1</span>
                </Tab>
                <Tab value="test-value-2" label="test-label-2">
                    <span>test-tab-content-2</span>
                </Tab>
            </Tabs>,
        )

        expect(component.find('.isActive')).toHaveLength(0)
    })

    it('passes click handler to children', () => {
        const component = shallow(
            <Tabs onChange={jest.fn()}>
                <Tab value="test-value-1" label="test-label-1" />
                <Tab value="test-value-2" label="test-label-2" />
            </Tabs>,
        )

        expect(component.find(Tab)).toHaveLength(2)
        expect(component.find(Tab).get(0).props._onClick).toBeInstanceOf(Function)
        expect(component.find(Tab).get(1).props._onClick).toBeInstanceOf(Function)
    })

    it('warns if children include dubious types', () => {
        const callArgs = []
        const spy = jest.spyOn(global.console, 'warn')
        spy.mockImplementation((...args) => callArgs.push(args))

        try {
            shallow(
                <Tabs>
                    <Tab value="x" label="test-label" />
                    <li>test-li</li>
                    <strong>test-strong</strong>
                    <div>test-div1</div>
                    <div>test-div2</div>
                    <div>test-div3</div>
                    <h1>test-h1</h1>
                </Tabs>,
            )

            expect(callArgs).toEqual([[
                '<Tabs /> received children of type(s) `div`, `h1`, `li`, `strong`. Children should be `Tab`.',
            ]])
        }
        finally {
            spy.mockRestore()
        }
    })

    it('emits `onChange` when tab clicked', () => {
        const callArgs = []
        const stub = jest.fn((...args) => callArgs.push(args))

        const component = mount(
            <Tabs onChange={stub}>
                <Tab value="test-value-1" label="test-label-1" />
                <Tab value="test-value-2" label="test-label-2" />
            </Tabs>,
        )

        component.find(Tab).forEach(n => n.simulate('click'))

        expect(stub).toHaveBeenCalledTimes(2)
        expect(callArgs).toEqual([['test-value-1'], ['test-value-2']])
    })
})


describe('<Tab/>', () => {
    it('can render', () => {
        const component = shallow(
            <Tab value="test-value" label="test-label" />,
        )

        expect(component.hasClass('tab')).toBeTruthy()
    })

    it('honors classname from props', () => {
        const component = shallow(
            <Tab className="test-classname" value="test-value" label="test-label" />,
        )

        expect(component.hasClass('test-classname')).toBeTruthy()
    })

    it('does not render children directly', () => {
        const component = shallow(
            <Tab className="test-classname" value="test-value" label="test-label">
                <span>test-child</span>
            </Tab>,
        )

        expect(component.contains(<span>test-child</span>)).toBeFalsy()
    })
})
