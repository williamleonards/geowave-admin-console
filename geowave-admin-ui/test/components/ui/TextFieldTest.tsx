import * as React from 'react'
import { shallow } from 'enzyme'

import { TextField } from '../../../src/components/ui/TextField'


describe('<TextField/>', () => {
    describe('as single-line textbox', () => {
        it('can render', () => {
            const component = shallow(
                <TextField
                    value="test-value"
                />,
            )

            expect(component.hasClass('root')).toBeTruthy()
            expect(component.find('input')).toHaveLength(1)
        })

        it('is enabled by default', () => {
            const component = shallow(
                <TextField
                    value="test-value"
                />,
            )

            expect(component.find('input').prop('disabled')).toBeFalsy()
        })

        it('can render in disabled state', () => {
            const component = shallow(
                <TextField
                    disabled
                    value="test-value"
                />,
            )

            expect(component.find('input').prop('disabled')).toBeTruthy()
        })

        it('renders correct value', () => {
            const component = shallow(
                <TextField
                    value="test-value"
                />,
            )

            expect(component.find('input').prop('value')).toEqual('test-value')
        })

        it('renders correct value when disabled', () => {
            const component = shallow(
                <TextField
                    disabled
                    value="test-value"
                />,
            )

            expect(component.find('input').prop('value')).toEqual('test-value')
        })

        it('renders correct placeholder', () => {
            const component = shallow(
                <TextField
                    placeholder="test-placeholder"
                    value="test-value"
                />,
            )

            expect(component.find('input').prop('placeholder')).toEqual('test-placeholder')
        })

        it('can render with blank value', () => {
            const component = shallow(
                <TextField
                    value=""
                />,
            )

            expect(component.find('input').prop('value')).toEqual('')
        })

        it('renders correct placeholder when disabled', () => {
            const component = shallow(
                <TextField
                    disabled
                    placeholder="test-placeholder"
                    value="test-value"
                />,
            )

            expect(component.find('input').prop('placeholder')).toEqual('test-placeholder')
        })

        it('honors `className` prop', () => {
            const component = shallow(
                <TextField
                    className="test-classname"
                    value="test-value"
                />,
            )

            expect(component.find('input').hasClass('test-classname')).toBeTruthy()
        })

        it('honors `maxLength` prop', () => {
            const component = shallow(
                <TextField
                    maxLength={33}
                    value="test-value"
                />,
            )

            expect(component.find('input').prop('maxLength')).toEqual(33)
        })

        it('honors `type` prop', () => {
            const component = shallow(
                <TextField
                    type="email"
                    value="test-value"
                />,
            )

            expect(component.find('input').prop('type')).toEqual('email')
        })

        it('emits `onChange` event', () => {
            const stub = jest.fn()

            const component = shallow(
                <TextField
                    value="test-value"
                    onChange={stub}
                />,
            )

            component.simulate('change', { target: { value: 'test-value-1' } })
            component.simulate('change', { target: { value: 'test-value-2' } })
            component.simulate('change', { target: { value: 'test-value-3' } })

            expect(stub.mock.calls).toEqual([['test-value-1'], ['test-value-2'], ['test-value-3']])
        })

        it('does not emit `onChange` event when disabled', () => {
            const stub = jest.fn()

            const component = shallow(
                <TextField
                    disabled
                    value="test-value"
                    onChange={stub}
                />,
            )

            component.simulate('change', { target: { value: 'test-value-1' } })
            component.simulate('change', { target: { value: 'test-value-2' } })
            component.simulate('change', { target: { value: 'test-value-3' } })

            expect(stub).toHaveBeenCalledTimes(0)
        })
    })

    describe('as multi-line textbox', () => {
        it('can render', () => {
            const component = shallow(
                <TextField
                    multiline
                    value="test-value"
                />,
            )

            expect(component.hasClass('root')).toBeTruthy()
            expect(component.find('textarea')).toHaveLength(1)
        })

        it('is enabled by default', () => {
            const component = shallow(
                <TextField
                    multiline
                    value="test-value"
                />,
            )

            expect(component.find('textarea').prop('disabled')).toBeFalsy()
        })

        it('can render in disabled state', () => {
            const component = shallow(
                <TextField
                    multiline
                    disabled
                    value="test-value"
                />,
            )

            expect(component.find('textarea').prop('disabled')).toBeTruthy()
        })

        it('renders correct value', () => {
            const component = shallow(
                <TextField
                    multiline
                    value="test-value"
                />,
            )

            expect(component.find('textarea').prop('value')).toEqual('test-value')
        })

        it('renders correct value when disabled', () => {
            const component = shallow(
                <TextField
                    multiline
                    disabled
                    value="test-value"
                />,
            )

            expect(component.find('textarea').prop('value')).toEqual('test-value')
        })

        it('renders correct placeholder', () => {
            const component = shallow(
                <TextField
                    multiline
                    placeholder="test-placeholder"
                    value="test-value"
                />,
            )

            expect(component.find('textarea').prop('placeholder')).toEqual('test-placeholder')
        })

        it('can render with blank value', () => {
            const component = shallow(
                <TextField
                    multiline
                    value=""
                />,
            )

            expect(component.find('textarea').prop('value')).toEqual('')
        })

        it('renders correct placeholder when disabled', () => {
            const component = shallow(
                <TextField
                    multiline
                    disabled
                    placeholder="test-placeholder"
                    value="test-value"
                />,
            )

            expect(component.find('textarea').prop('placeholder')).toEqual('test-placeholder')
        })

        it('honors `className` prop', () => {
            const component = shallow(
                <TextField
                    multiline
                    className="test-classname"
                    value="test-value"
                />,
            )

            expect(component.find('textarea').hasClass('test-classname')).toBeTruthy()
        })

        it('honors `lines` prop', () => {
            const component = shallow(
                <TextField
                    multiline
                    lines={99}
                    value="test-value"
                />,
            )

            expect(component.find('textarea').prop('rows')).toEqual(99)
        })

        it('has default `lines` if blank', () => {
            const component = shallow(
                <TextField
                    multiline
                    lines={undefined}
                    value="test-value"
                />,
            )

            expect(component.find('textarea').prop('rows')).toBeGreaterThanOrEqual(1)
        })

        it('honors `maxLength` prop', () => {
            const component = shallow(
                <TextField
                    multiline
                    maxLength={33}
                    value="test-value"
                />,
            )

            expect(component.find('textarea').prop('maxLength')).toEqual(33)
        })

        it('emits `onChange` event', () => {
            const stub = jest.fn()

            const component = shallow(
                <TextField
                    multiline
                    value="test-value"
                    onChange={stub}
                />,
            )

            component.simulate('change', { target: { value: 'test-value-1' } })
            component.simulate('change', { target: { value: 'test-value-2' } })
            component.simulate('change', { target: { value: 'test-value-3' } })

            expect(stub.mock.calls).toEqual([['test-value-1'], ['test-value-2'], ['test-value-3']])
        })

        it('does not emit `onChange` event when disabled', () => {
            const stub = jest.fn()

            const component = shallow(
                <TextField
                    multiline
                    disabled
                    value="test-value"
                    onChange={stub}
                />,
            )

            component.simulate('change', { target: { value: 'test-value-1' } })
            component.simulate('change', { target: { value: 'test-value-2' } })
            component.simulate('change', { target: { value: 'test-value-3' } })

            expect(stub).toHaveBeenCalledTimes(0)
        })
    })
})
