import * as React from 'react'
import { shallow } from 'enzyme'

import { Checkbox } from '../../../src/components/ui/Checkbox'


describe('<Checkbox/>', () => {
    it('can render', () => {
        const component = shallow(
            <Checkbox/>,
        )

        expect(component.hasClass('root')).toBeTruthy()
    })

    it('can render in indeterminate state', () => {
        const component = shallow(
            <Checkbox
                checked={null}
            />,
        )

        expect(component.hasClass('isChecked')).toBeFalsy()
        expect(component.hasClass('isIndeterminate')).toBeTruthy()
    })

    it('can render in checked state', () => {
        const component = shallow(
            <Checkbox
                checked={true}
            />,
        )

        expect(component.hasClass('isChecked')).toBeTruthy()
        expect(component.hasClass('isIndeterminate')).toBeFalsy()
    })

    it('can render in unchecked state', () => {
        const component = shallow(
            <Checkbox
                checked={false}
            />,
        )

        expect(component.hasClass('isChecked')).toBeFalsy()
        expect(component.hasClass('isIndeterminate')).toBeFalsy()
    })

    it('can render in disabled, indeterminate state', () => {
        const component = shallow(
            <Checkbox
                disabled
                checked={null}
            />,
        )

        expect(component.hasClass('isChecked')).toBeFalsy()
        expect(component.hasClass('isIndeterminate')).toBeTruthy()
        expect(component.hasClass('isDisabled')).toBeTruthy()
    })

    it('can render in disabled, checked state', () => {
        const component = shallow(
            <Checkbox
                disabled
                checked={true}
            />,
        )

        expect(component.hasClass('isChecked')).toBeTruthy()
        expect(component.hasClass('isIndeterminate')).toBeFalsy()
        expect(component.hasClass('isDisabled')).toBeTruthy()
    })

    it('can render in disabled, unchecked state', () => {
        const component = shallow(
            <Checkbox
                disabled
                checked={false}
            />,
        )

        expect(component.hasClass('isChecked')).toBeFalsy()
        expect(component.hasClass('isIndeterminate')).toBeFalsy()
        expect(component.hasClass('isDisabled')).toBeTruthy()
    })

    it('honors classname from props', () => {
        const component = shallow(
            <Checkbox
                className="test-classname"
            />,
        )

        expect(component.hasClass('test-classname')).toBeTruthy()
    })

    it('renders check with custom class', () => {
        const component = shallow(
            <Checkbox
                checked={true}
                classes={{
                    check: 'test-check-classname',
                }}
            />,
        )

        expect(component.find('.check').hasClass('test-check-classname')).toBeTruthy()
    })

    it('renders dash with custom class', () => {
        const component = shallow(
            <Checkbox
                checked={null}
                classes={{
                    dash: 'test-dash-classname',
                }}
            />,
        )

        expect(component.find('.dash').hasClass('test-dash-classname')).toBeTruthy()
    })

    it('emits `onChange` when clicked', () => {
        const stub = jest.fn()
        const component = shallow(
            <Checkbox
                onChange={stub}
            />,
        )

        component.simulate('click', { preventDefault: jest.fn() })

        expect(stub).toHaveBeenCalledTimes(1)
        expect(stub).toHaveBeenCalledWith(true)
    })

    it('does not emit `onChange` when clicked if disabled', () => {
        const stub = jest.fn()
        const component = shallow(
            <Checkbox
                disabled
                onChange={stub}
            />,
        )

        component.simulate('click', { preventDefault: jest.fn() })

        expect(stub).toHaveBeenCalledTimes(0)
    })

    it('emits `onChange` on key `space`', () => {
        const stub = jest.fn()
        const component = shallow(
            <Checkbox
                onChange={stub}
            />,
        )

        component.simulate('keydown', { key: ' ' })

        expect(stub).toHaveBeenCalledTimes(1)
        expect(stub).toHaveBeenCalledWith(true)
    })

    it('emits `onChange` on key `enter`', () => {
        const stub = jest.fn()
        const component = shallow(
            <Checkbox
                onChange={stub}
            />,
        )

        component.simulate('keydown', { key: 'Enter' })

        expect(stub).toHaveBeenCalledTimes(1)
        expect(stub).toHaveBeenCalledWith(true)
    })

    it('does not emit `onChange` on bogus keys', () => {
        const stub = jest.fn()
        const component = shallow(
            <Checkbox
                onChange={stub}
            />,
        )

        component.simulate('keydown', { key: 'ArrowUp' })
        component.simulate('keydown', { key: 'ArrowUp' })
        component.simulate('keydown', { key: 'ArrowDown' })
        component.simulate('keydown', { key: 'ArrowDown' })
        component.simulate('keydown', { key: 'ArrowLeft' })
        component.simulate('keydown', { key: 'ArrowRight' })
        component.simulate('keydown', { key: 'ArrowLeft' })
        component.simulate('keydown', { key: 'ArrowRight' })
        component.simulate('keydown', { key: 'B' })
        component.simulate('keydown', { key: 'A' })

        expect(stub).toHaveBeenCalledTimes(0)
    })
})
