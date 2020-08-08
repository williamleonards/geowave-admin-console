import * as React from 'react'
import { mount, shallow } from 'enzyme'

import {
    Slider,
} from '../../../src/components/ui/Slider'


describe('<Slider/>', () => {
    it('can render', () => {
        const component = shallow(
            <Slider
                min={0}
                max={10}
                value={0}
            />,
        )

        expect(component.hasClass('root')).toBeTruthy()
    })

    it('honors classname from props', () => {
        const component = shallow(
            <Slider
                className="test-classname"
                min={0}
                max={10}
                value={0}
            />,
        )

        expect(component.hasClass('test-classname')).toBeTruthy()
    })

    it('renders puck', () => {
        const component = shallow(
            <Slider
                min={0}
                max={10}
                value={0}
            />,
        )

        expect(component.find('.puck')).toHaveLength(1)
    })

    it('renders puck in correct location', () => {
        const component = shallow(
            <Slider
                min={0}
                max={10}
                value={3}
            />,
        )

        expect(component.find('.puck').prop('style')).toEqual({left: '30%'})
    })

    it('renders puck with custom class', () => {
        const component = shallow(
            <Slider
                min={0}
                max={10}
                value={0}
                classes={{
                    puck: 'test-puck-classname',
                }}
            />,
        )

        expect(component.find('.puck').hasClass('test-puck-classname')).toBeTruthy()
    })

    it('renders track', () => {
        const component = shallow(
            <Slider
                min={0}
                max={10}
                value={0}
            />,
        )

        expect(component.find('.track')).toHaveLength(1)
    })

    it('renders track with custom class', () => {
        const component = shallow(
            <Slider
                min={0}
                max={10}
                value={0}
                classes={{
                    track: 'test-track-classname',
                }}
            />,
        )

        expect(component.find('.track').hasClass('test-track-classname')).toBeTruthy()
    })

    it('honors `disabled` prop', () => {
        const component = shallow(
            <Slider
                disabled
                min={0}
                max={10}
                value={0}
            />,
        )

        expect(component.hasClass('isDisabled')).toBeTruthy()
    })

    it('renders with custom `isDisabled` class', () => {
        const component = shallow(
            <Slider
                disabled
                min={0}
                max={10}
                value={0}
                classes={{
                    isDisabled: 'test-is-disabled',
                }}
            />,
        )

        expect(component.hasClass('test-is-disabled')).toBeTruthy()
    })

    describe('keyboard input', () => {
        it('increments on key `right`', () => {
            const spy = jest.fn()

            const component = mount(
                <Slider
                    min={0}
                    max={10}
                    value={5}
                    onChange={spy}
                />,
            )

            component.simulate('keydown', { key: 'ArrowRight' })

            expect(spy.mock.calls).toEqual([[6]])
        })

        it('decrements on key `left`', () => {
            const spy = jest.fn()

            const component = mount(
                <Slider
                    min={0}
                    max={10}
                    value={5}
                    onChange={spy}
                />,
            )

            component.simulate('keydown', { key: 'ArrowLeft' })

            expect(spy.mock.calls).toEqual([[4]])
        })

        it('increments by a lot on key `shift+right`', () => {
            const spy = jest.fn()

            const component = mount(
                <Slider
                    min={0}
                    max={100}
                    value={33}
                    onChange={spy}
                />,
            )

            component.simulate('keydown', { key: 'ArrowRight', shiftKey: true })

            expect(spy.mock.calls).toEqual([[43]])
        })

        it('decrements by a lot on key `shift+left`', () => {
            const spy = jest.fn()

            const component = mount(
                <Slider
                    min={0}
                    max={100}
                    value={33}
                    onChange={spy}
                />,
            )

            component.simulate('keydown', { key: 'ArrowLeft', shiftKey: true })

            expect(spy.mock.calls).toEqual([[23]])
        })

        it('honors `step` property on increment', () => {
            const spy = jest.fn()

            const component = mount(
                <Slider
                    min={0}
                    max={10}
                    value={5}
                    step={0.5}
                    onChange={spy}
                />,
            )

            component.simulate('keydown', { key: 'ArrowRight' })

            expect(spy.mock.calls).toEqual([[5.5]])
        })

        it('honors `step` property on decrement', () => {
            const spy = jest.fn()

            const component = mount(
                <Slider
                    min={0}
                    max={10}
                    value={5}
                    step={0.5}
                    onChange={spy}
                />,
            )

            component.simulate('keydown', { key: 'ArrowLeft' })

            expect(spy.mock.calls).toEqual([[4.5]])
        })

        it('does not emit values lesser than `min`', () => {
            const spy = jest.fn()

            const component = mount(
                <Slider
                    min={0}
                    max={10}
                    value={0}
                    onChange={spy}
                />,
            )

            component.simulate('keydown', { key: 'ArrowLeft' })

            expect(spy.mock.calls).toEqual([])
        })

        it('does not emit values greater than `max`', () => {
            const spy = jest.fn()

            const component = mount(
                <Slider
                    min={0}
                    max={10}
                    value={10}
                    onChange={spy}
                />,
            )

            component.simulate('keydown', { key: 'ArrowRight' })

            expect(spy.mock.calls).toEqual([])
        })
    })

    describe('mouse input', () => {
        // TODO -- figure out how to mock DOM sizing math under jest/enzyme (_should_ it even be done??)
        it('changes value on puck drag')
        it('changes value on track click')
        it('removes global event handlers when puck drag ends')
        it('does not emit values lesser than `min`')
        it('does not emit values greater than `max`')
        it('does not emit `onChange` when value unchanged')
        it('honors `step` property')
    })
})
