import * as React from 'react'
import { shallow } from 'enzyme'

import { Label } from '../../../src/components/ui/Label'


describe('<Label/>', () => {
    it('can render', () => {
        const component = shallow(
            <Label
                text="test-text"
            />,
        )

        expect(component.hasClass('root')).toBeTruthy()
    })

    it('renders with custom `isLarge` class', () => {
        const component = shallow(
            <Label
                text="test-text"
                size="large"
                classes={{
                    isLarge: 'test-custom-islarge',
                }}
            />,
        )

        expect(component.hasClass('test-custom-islarge')).toBeTruthy()
    })

    it('renders with custom `isSmall` class', () => {
        const component = shallow(
            <Label
                text="test-text"
                size="small"
                classes={{
                    isSmall: 'test-custom-issmall',
                }}
            />,
        )

        expect(component.hasClass('test-custom-issmall')).toBeTruthy()
    })

    it('renders text', () => {
        const component = shallow(
            <Label
                text="test-text"
            />,
        )

        expect(component.find('.text').text()).toEqual('test-text')
    })

    it('renders text with custom class', () => {
        const component = shallow(
            <Label
                text="test-text"
            />,
        )

        expect(component.find('.text').text()).toEqual('test-text')
    })

    it('can render with small size', () => {
        const component = shallow(
            <Label
                text="test-text"
                size="small"
            />,
        )

        expect(component.hasClass('isSmall')).toBeTruthy()
    })

    it('can render with large size', () => {
        const component = shallow(
            <Label
                text="test-text"
                size="large"
            />,
        )

        expect(component.hasClass('isLarge')).toBeTruthy()
    })

    it('honors `tooltip` prop', () => {
        const component = shallow(
            <Label
                text="test-text"
                tooltip="test-tooltip"
            />,
        )

        expect(component.prop('title')).toEqual('test-tooltip')
    })

    it('renders children', () => {
        const component = shallow(
            <Label text="test-text">
                <span className="test-child">hi there</span>
            </Label>,
        )

        expect(component.find('.test-child')).toHaveLength(1)
        expect(component.find('.test-child').text()).toEqual('hi there')
    })
})
