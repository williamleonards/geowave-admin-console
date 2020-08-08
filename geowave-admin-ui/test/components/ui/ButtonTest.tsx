import * as React from 'react'
import { shallow } from 'enzyme'

import { Button } from '../../../src/components/ui/Button'


describe('<Button/>', () => {
    it('can render', () => {
        const component = shallow(
            <Button/>,
        )

        expect(component.hasClass('root')).toBeTruthy()
    })

    it('honors classname from props', () => {
        const component = shallow(
            <Button
                className="test-classname"
            />,
        )

        expect(component.hasClass('test-classname')).toBeTruthy()
    })

    it('renders icon', () => {
        const component = shallow(
            <Button
                icon={<span>test-icon</span>}
            />,
        )

        expect(component.find('.icon')).toHaveLength(1)
        expect(component.find('.icon').contains(<span>test-icon</span>)).toBeTruthy()
    })

    it('renders icon with custom class', () => {
        const component = shallow(
            <Button
                icon={<span>&times;</span>}
                classes={{
                    icon: 'test-icon-classname',
                }}
            />,
        )

        expect(component.find('.icon').hasClass('test-icon-classname')).toBeTruthy()
    })

    it('renders label', () => {
        const component = shallow(
            <Button
                label="test-label"
            />,
        )

        expect(component.find('.label')).toHaveLength(1)
        expect(component.find('.label').text()).toEqual('test-label')
    })

    it('renders label with custom class', () => {
        const component = shallow(
            <Button
                label="test-label"
                classes={{
                    label: 'test-label-classname',
                }}
            />,
        )

        expect(component.find('.label').hasClass('test-label-classname')).toBeTruthy()
    })

    it('emits `onClick` when clicked', () => {
        const stub = jest.fn()
        const component = shallow(
            <Button
                onClick={stub}
            />,
        )

        component.simulate('click')

        expect(stub).toHaveBeenCalledTimes(1)
    })

    it('renders children', () => {
        const component = shallow(
            <Button>
                <span>test-children</span>
            </Button>,
        )

        expect(component.contains(<span>test-children</span>)).toBeTruthy()
    })
})
