import * as React from 'react'
import { mount, shallow } from 'enzyme'

import {
    SegmentedControl,
} from '../../../src/components/ui/SegmentedControl'


describe('<SegmentedControl/>', () => {
    it('can render', () => {
        const component = shallow(
            <SegmentedControl
                items={[
                    { value: 'test-item-value-1', label: 'test-item-label-1'},
                    { value: 'test-item-value-2', label: 'test-item-label-2'},
                    { value: 'test-item-value-3', label: 'test-item-label-3'},
                ]}
                value={null}
            />,
        )

        expect(component.hasClass('root')).toBeTruthy()
    })

    it('renders with custom `isDisabled` class', () => {
        const component = shallow(
            <SegmentedControl
                disabled
                value={null}
                items={[
                    { value: 'test-item-value-1', label: 'test-item-label-1'},
                    { value: 'test-item-value-2', label: 'test-item-label-2'},
                    { value: 'test-item-value-3', label: 'test-item-label-3'},
                ]}
                classes={{
                    isDisabled: 'test-custom-isdisabled-classname',
                }}
            />,
        )

        expect(component.hasClass('test-custom-isdisabled-classname')).toBeTruthy()
    })

    it('renders items', () => {
        const component = shallow(
            <SegmentedControl
                value={null}
                items={[
                    { value: 'test-item-value-1', label: 'test-item-label-1'},
                    { value: 'test-item-value-2', label: 'test-item-label-2'},
                    { value: 'test-item-value-3', label: 'test-item-label-3'},
                ]}
            />,
        )

        expect(component.find('.item')).toHaveLength(3)
    })

    it('renders items with custom class', () => {
        const component = shallow(
            <SegmentedControl
                value={null}
                items={[
                    { value: 'test-item-value-1', label: 'test-item-label-1'},
                    { value: 'test-item-value-2', label: 'test-item-label-2'},
                    { value: 'test-item-value-3', label: 'test-item-label-3'},
                ]}
                classes={{
                    item: 'test-item-classname',
                }}
            />,
        )

        expect(component.find('.item.test-item-classname')).toHaveLength(3)
    })

    it('renders selected item', () => {
        const component = shallow(
            <SegmentedControl
                value="test-item-value-2"
                items={[
                    { value: 'test-item-value-1', label: 'test-item-label-1'},
                    { value: 'test-item-value-2', label: 'test-item-label-2'},
                    { value: 'test-item-value-3', label: 'test-item-label-3'},
                ]}
            />,
        )

        expect(component.find('.isSelected')).toHaveLength(1)
        expect(component.find('.isSelected').text()).toEqual('test-item-label-2')
    })

    it('renders selected item with custom class', () => {
        const component = shallow(
            <SegmentedControl
                value="test-item-value-2"
                items={[
                    { value: 'test-item-value-1', label: 'test-item-label-1'},
                    { value: 'test-item-value-2', label: 'test-item-label-2'},
                    { value: 'test-item-value-3', label: 'test-item-label-3'},
                ]}
                classes={{
                    isSelectedItem: 'test-custom-isselecteditem-icon',
                }}
            />,
        )

        expect(component.find('.isSelected').hasClass('test-custom-isselecteditem-icon')).toBeTruthy()
    })

    it('can render without a selected item', () => {
        const component = shallow(
            <SegmentedControl
                value={null}
                items={[
                    { value: 'test-item-value-1', label: 'test-item-label-1'},
                    { value: 'test-item-value-2', label: 'test-item-label-2'},
                    { value: 'test-item-value-3', label: 'test-item-label-3'},
                ]}
            />,
        )

        expect(component.find('.isSelected')).toHaveLength(0)
    })

    describe('keyboard input', () => {
        it('selects next item on key `right`', () => {
            const spy = jest.fn()

            const component = mount(
                <SegmentedControl
                    value="test-item-value-2"
                    items={[
                        { value: 'test-item-value-1', label: 'test-item-label-1'},
                        { value: 'test-item-value-2', label: 'test-item-label-2'},
                        { value: 'test-item-value-3', label: 'test-item-label-3'},
                    ]}
                    onChange={spy}
                />,
            )

            component.simulate('keydown', { key: 'ArrowRight' })

            expect(spy.mock.calls).toEqual([['test-item-value-3']])
        })

        it('selects previous item on key `left`', () => {
            const spy = jest.fn()

            const component = mount(
                <SegmentedControl
                    value="test-item-value-2"
                    items={[
                        { value: 'test-item-value-1', label: 'test-item-label-1'},
                        { value: 'test-item-value-2', label: 'test-item-label-2'},
                        { value: 'test-item-value-3', label: 'test-item-label-3'},
                    ]}
                    onChange={spy}
                />,
            )

            component.simulate('keydown', { key: 'ArrowLeft' })

            expect(spy.mock.calls).toEqual([['test-item-value-1']])
        })

        it('can handle key `left` with first item selected', () => {
            const spy = jest.fn()

            const component = mount(
                <SegmentedControl
                    value="test-item-value-1"
                    items={[
                        { value: 'test-item-value-1', label: 'test-item-label-1'},
                        { value: 'test-item-value-2', label: 'test-item-label-2'},
                        { value: 'test-item-value-3', label: 'test-item-label-3'},
                    ]}
                    onChange={spy}
                />,
            )

            component.simulate('keydown', { key: 'ArrowLeft' })

            expect(spy.mock.calls).toEqual([])
        })

        it('can handle key `right` with last item selected', () => {
            const spy = jest.fn()

            const component = mount(
                <SegmentedControl
                    value="test-item-value-3"
                    items={[
                        { value: 'test-item-value-1', label: 'test-item-label-1'},
                        { value: 'test-item-value-2', label: 'test-item-label-2'},
                        { value: 'test-item-value-3', label: 'test-item-label-3'},
                    ]}
                    onChange={spy}
                />,
            )

            component.simulate('keydown', { key: 'ArrowRight' })

            expect(spy.mock.calls).toEqual([])
        })

        it('selects first item on key `right` if nothing selected', () => {
            const spy = jest.fn()

            const component = mount(
                <SegmentedControl
                    value={null}
                    items={[
                        { value: 'test-item-value-1', label: 'test-item-label-1'},
                        { value: 'test-item-value-2', label: 'test-item-label-2'},
                        { value: 'test-item-value-3', label: 'test-item-label-3'},
                    ]}
                    onChange={spy}
                />,
            )

            component.simulate('keydown', { key: 'ArrowRight' })

            expect(spy.mock.calls).toEqual([['test-item-value-1']])
        })
    })

    describe('mouse input', () => {
        it('selects item on click (existing selection)', () => {
            const spy = jest.fn()

            const component = mount(
                <SegmentedControl
                    value="test-item-value-1"
                    items={[
                        { value: 'test-item-value-1', label: 'test-item-label-1'},
                        { value: 'test-item-value-2', label: 'test-item-label-2'},
                        { value: 'test-item-value-3', label: 'test-item-label-3'},
                    ]}
                    onChange={spy}
                />,
            )

            component.find('.item').at(1).simulate('click')

            expect(spy.mock.calls).toEqual([['test-item-value-2']])
        })

        it('selects item on click (nothing selected)', () => {
            const spy = jest.fn()

            const component = mount(
                <SegmentedControl
                    value={null}
                    items={[
                        { value: 'test-item-value-1', label: 'test-item-label-1'},
                        { value: 'test-item-value-2', label: 'test-item-label-2'},
                        { value: 'test-item-value-3', label: 'test-item-label-3'},
                    ]}
                    onChange={spy}
                />,
            )

            component.find('.item').at(1).simulate('click')

            expect(spy.mock.calls).toEqual([['test-item-value-2']])
        })

        it('does not emit `onChange` if item clicked is already selected', () => {
            const spy = jest.fn()

            const component = mount(
                <SegmentedControl
                    value="test-item-value-1"
                    items={[
                        { value: 'test-item-value-1', label: 'test-item-label-1'},
                        { value: 'test-item-value-2', label: 'test-item-label-2'},
                        { value: 'test-item-value-3', label: 'test-item-label-3'},
                    ]}
                    onChange={spy}
                />,
            )

            component.find('.item').at(0).simulate('click')

            expect(spy.mock.calls).toEqual([])
        })
    })
})
