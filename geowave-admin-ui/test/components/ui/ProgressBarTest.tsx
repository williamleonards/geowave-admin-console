import * as React from 'react'
import { shallow } from 'enzyme'

import { ProgressBar } from '../../../src/components/ui/ProgressBar'


describe('<ProgressBar/>', () => {
    it('can render', () => {
        const component = shallow(
            <ProgressBar/>,
        )

        expect(component.hasClass('root')).toBeTruthy()
    })

    it('honors classname from props', () => {
        const component = shallow(
            <ProgressBar
                className="test-classname"
            />,
        )

        expect(component.hasClass('test-classname')).toBeTruthy()
    })

    it('renders in indeterminate mode if value omitted', () => {
        const component = shallow(
            <ProgressBar
                value={null}
            />,
        )

        expect(component.hasClass('isIndeterminate')).toBeTruthy()
    })

    it('renders puck', () => {
        const component = shallow(
            <ProgressBar/>,
        )

        expect(component.find('.puck')).toHaveLength(1)
    })

    it('renders puck with width based on `value` prop', () => {
        const component = shallow(
            <ProgressBar
                value={33}
            />,
        )

        expect(component.find('.puck').prop('style')).toEqual({ width: '33%' })
    })

    it('renders puck with custom class', () => {
        const component = shallow(
            <ProgressBar
                classes={{
                    puck: 'test-puck-classname',
                }}
            />,
        )

        expect(component.find('.puck').hasClass('test-puck-classname')).toBeTruthy()
    })

    it('renders content', () => {
        const component = shallow(
            <ProgressBar>
                <span>test-content</span>
            </ProgressBar>,
        )

        expect(component.find('.content')).toHaveLength(1)
        expect(component.find('.content').contains(<span>test-content</span>)).toBeTruthy()
    })

    it('renders content with custom class', () => {
        const component = shallow(
            <ProgressBar
                classes={{
                    content: 'test-content-classname',
                }}
            >
                <span>test-content</span>
            </ProgressBar>,
        )

        expect(component.find('.content').hasClass('test-content-classname')).toBeTruthy()
    })

    it('does not render content if omitted', () => {
        const component = shallow(
            <ProgressBar />,
        )

        expect(component.find('.content')).toHaveLength(0)
    })

    it('warns if passed invalid value', () => {
        const values = [
            'lolwut',
            -1,
            0,
            50,
            100,
            101,
            10101000101,
        ]

        const component = shallow(
            <ProgressBar />,
        )

        const warnings = []
        const spy = jest.spyOn(global.console, 'warn')
        spy.mockImplementation(msg => warnings.push(msg))

        try {
            values.forEach(value => component.setProps({ value }))

            expect(warnings).toEqual([
                "[ProgressBar] `value` should be an number between 0 and 100, not 'lolwut'.",
                "[ProgressBar] `value` should be an number between 0 and 100, not '-1'.",
                "[ProgressBar] `value` should be an number between 0 and 100, not '101'.",
                "[ProgressBar] `value` should be an number between 0 and 100, not '10101000101'.",
            ])
        }
        finally {
            spy.mockRestore()
        }
    })
})
