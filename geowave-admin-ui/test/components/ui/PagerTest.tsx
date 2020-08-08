import * as React from 'react'
import { shallow } from 'enzyme'

import { Pager } from '../../../src/components/ui/Pager'


describe('<Pager/>', () => {
    it('can render', () => {
        const component = shallow(
            <Pager
                value={1}
                size={1}
                totalCount={10}
            />,
        )

        expect(component.hasClass('root')).toBeTruthy()
    })

    it('honors classname from props', () => {
        const component = shallow(
            <Pager
                className="test-classname"
                value={1}
                size={1}
                totalCount={10}
            />,
        )

        expect(component.hasClass('root')).toBeTruthy()
        expect(component.hasClass('test-classname')).toBeTruthy()
    })

    it('renders disabled', () => {
        const component = shallow(
            <Pager
                disabled
                value={1}
                size={1}
                totalCount={10}
            />,
        )

        expect(component.hasClass('root')).toBeTruthy()
        expect(component.hasClass('isDisabled')).toBeTruthy()
    })

    it('renders with custom `disabled` class', () => {
        const component = shallow(
            <Pager
                disabled
                value={1}
                size={1}
                totalCount={10}
                classes={{
                    isDisabled: 'test-isdisabled',
                }}
            />,
        )

        expect(component.hasClass('root')).toBeTruthy()
        expect(component.hasClass('isDisabled')).toBeTruthy()
        expect(component.hasClass('test-isdisabled')).toBeTruthy()
    })

    it('renders page buttons', () => {
        const component = shallow(
            <Pager
                value={3}
                size={1}
                totalCount={10}
            />,
        )

        expect(component.find('.page')).toHaveLength(5)
        expect(component.find('.page').map(e => e.text())).toEqual(['1', '2', '3', '4', '5'])
    })

    it('renders page buttons with custom class', () => {
        const component = shallow(
            <Pager
                value={1}
                size={1}
                totalCount={10}
                classes={{
                    page: 'test-page',
                }}
            />,
        )

        expect(component.find('.page')).toHaveLength(5)
        expect(component.find('.page').every('.test-page')).toBeTruthy()
    })

    it('renders `previous` button', () => {
        const component = shallow(
            <Pager
                value={3}
                size={1}
                totalCount={10}
            />,
        )

        expect(component.find('.previous')).toHaveLength(1)
        expect(component.find('.previous').hasClass('isDisabled')).toBeFalsy()
    })

    it('renders `previous` button (disabled)', () => {
        const component = shallow(
            <Pager
                value={1}
                size={1}
                totalCount={10}
            />,
        )

        expect(component.find('.previous').hasClass('isDisabled')).toBeTruthy()
    })

    it('renders `previous` button with custom class', () => {
        const component = shallow(
            <Pager
                value={3}
                size={1}
                totalCount={10}
                classes={{
                    previous: 'test-previous',
                }}
            />,
        )

        expect(component.find('.previous').hasClass('test-previous')).toBeTruthy()
    })

    it('renders `previous` button with custom class (disabled)', () => {
        const component = shallow(
            <Pager
                value={1}
                size={1}
                totalCount={10}
                classes={{
                    previousDisabled: 'test-previousdisabled',
                }}
            />,
        )

        expect(component.find('.previous').hasClass('isDisabled')).toBeTruthy()
        expect(component.find('.previous').hasClass('test-previousdisabled')).toBeTruthy()
    })

    it('renders `next` button', () => {
        const component = shallow(
            <Pager
                value={1}
                size={1}
                totalCount={10}
            />,
        )

        expect(component.find('.next')).toHaveLength(1)
        expect(component.find('.next').hasClass('isDisabled')).toBeFalsy()
    })

    it('renders `next` button (disabled)', () => {
        const component = shallow(
            <Pager
                value={10}
                size={1}
                totalCount={10}
            />,
        )

        expect(component.find('.next').hasClass('isDisabled')).toBeTruthy()
    })

    it('renders `next` button with custom class', () => {
        const component = shallow(
            <Pager
                value={1}
                size={1}
                totalCount={10}
                classes={{
                    next: 'test-next',
                }}
            />,
        )

        expect(component.find('.next').hasClass('test-next')).toBeTruthy()
    })

    it('renders `next` button with custom class (disabled)', () => {
        const component = shallow(
            <Pager
                value={10}
                size={1}
                totalCount={10}
                classes={{
                    nextDisabled: 'test-nextdisabled',
                }}
            />,
        )

        expect(component.find('.next').hasClass('isDisabled')).toBeTruthy()
        expect(component.find('.next').hasClass('test-nextdisabled')).toBeTruthy()
    })

    it('renders active page button', () => {
        const component = shallow(
            <Pager
                value={7}
                size={1}
                totalCount={10}
            />,
        )

        expect(component.find('.page.isActive')).toHaveLength(1)
        expect(component.find('.page.isActive').text()).toEqual('7')
    })

    it('renders active page button with custom class', () => {
        const component = shallow(
            <Pager
                value={7}
                size={1}
                totalCount={10}
                classes={{
                    activePage: 'test-activepage',
                }}
            />,
        )

        expect(component.find('.page.isActive').hasClass('test-activepage')).toBeTruthy()
    })

    it('honors padding', () => {
        const component = shallow(
            <Pager
                value={5}
                size={1}
                totalCount={10}
                padding={3}
            />,
        )

        expect(component.find('.page').map(e => e.text())).toEqual(['2', '3', '4', '5', '6', '7', '8'])
    })

    it('increases right padding when close to lower bound', () => {
        const component = shallow(
            <Pager
                value={2}
                size={1}
                totalCount={10}
                padding={2}
            />,
        )

        expect(component.find('.page')).toHaveLength(5)
        expect(component.find('.page').map(e => e.text())).toEqual(['1', '2', '3', '4', '5'])
    })

    it('increases right padding when at lower bound', () => {
        const component = shallow(
            <Pager
                value={1}
                size={1}
                totalCount={10}
                padding={2}
            />,
        )

        expect(component.find('.page')).toHaveLength(5)
        expect(component.find('.page').map(e => e.text())).toEqual(['1', '2', '3', '4', '5'])
    })

    it('increases left padding when close to upper bound', () => {
        const component = shallow(
            <Pager
                value={9}
                size={1}
                totalCount={10}
                padding={2}
            />,
        )

        expect(component.find('.page')).toHaveLength(5)
        expect(component.find('.page').map(e => e.text())).toEqual(['6', '7', '8', '9', '10'])
    })

    it('increases left padding when at upper bound', () => {
        const component = shallow(
            <Pager
                value={10}
                size={1}
                totalCount={10}
                padding={2}
            />,
        )

        expect(component.find('.page')).toHaveLength(5)
        expect(component.find('.page').map(e => e.text())).toEqual(['6', '7', '8', '9', '10'])
    })

    it('emits `onChange` when previous button clicked', () => {
        const stub = jest.fn()

        const component = shallow(
            <Pager
                value={5}
                size={1}
                totalCount={10}
                onChange={stub}
            />,
        )

        component.find('.previous').simulate('click')

        expect(stub).toHaveBeenCalledTimes(1)
        expect(stub).toHaveBeenCalledWith(4)
    })

    it('emits `onChange` when next button clicked', () => {
        const stub = jest.fn()

        const component = shallow(
            <Pager
                value={5}
                size={1}
                totalCount={10}
                onChange={stub}
            />,
        )

        component.find('.next').simulate('click')

        expect(stub).toHaveBeenCalledTimes(1)
        expect(stub).toHaveBeenCalledWith(6)
    })

    it('emits `onChange` when page button clicked', () => {
        const stub = jest.fn()

        const component = shallow(
            <Pager
                value={2}
                size={1}
                totalCount={10}
                onChange={stub}
            />,
        )

        component.find('.page').at(3).simulate('click')

        expect(stub).toHaveBeenCalledTimes(1)
        expect(stub).toHaveBeenCalledWith(4)
    })

    it('does not emit `onChange` if disabled', () => {
        const stub = jest.fn()

        const component = shallow(
            <Pager
                disabled
                value={2}
                size={1}
                totalCount={10}
                onChange={stub}
            />,
        )

        component.find('.page').at(3).simulate('click')

        expect(stub).toHaveBeenCalledTimes(0)
    })

    it('does not page-backwards when on page 1', () => {
        const stub = jest.fn()

        const component = shallow(
            <Pager
                disabled
                value={1}
                size={1}
                totalCount={10}
                onChange={stub}
            />,
        )

        component.find('.previous').simulate('click')

        expect(stub).toHaveBeenCalledTimes(0)
    })

    it('does not page-forwards when on last page', () => {
        const stub = jest.fn()

        const component = shallow(
            <Pager
                disabled
                value={10}
                size={1}
                totalCount={10}
                onChange={stub}
            />,
        )

        component.find('.next').simulate('click')

        expect(stub).toHaveBeenCalledTimes(0)
    })
})
