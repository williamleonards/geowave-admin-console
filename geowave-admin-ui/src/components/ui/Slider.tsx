import * as React from 'react'
import * as $ from 'classnames'

import styles from './Slider.less'


const DEFAULT_STEP = 1
const DEFAULT_SHIFT_MULTIPLIER = 10
const DEFAULT_TAB_INDEX = 0
const KEY_ARROW_LEFT = 'ArrowLeft'
const KEY_ARROW_RIGHT = 'ArrowRight'


export class Slider extends React.Component<IProps, IState> {
    state: IState = {
        isDraggingPuck: false,
        startingMouseX: null,
    }

    private trackElement: HTMLDivElement

    componentWillUnmount() {
        this.destroyGlobalEventHandlers()
    }

    render() {
        return (
            <div
                tabIndex={this.props.tabIndex || DEFAULT_TAB_INDEX}
                onKeyDown={!this.props.disabled ? this.onKeyDown : undefined}
                onMouseDown={!this.props.disabled ? this.onContainerMouseDown : undefined}
                className={$(
                    styles.root,
                    this.props.className,
                    this.props.disabled && styles.isDisabled,
                    this.props.disabled && this.props.classes && this.props.classes.isDisabled,
                    this.state.isDraggingPuck && styles.isDraggingPuck,
                    this.state.isDraggingPuck && this.props.classes && this.props.classes.isDragging,
                )}
            >
                <div
                    className={$(styles.track, this.props.classes && this.props.classes.track)}
                    ref={e => this.trackElement = e}
                >
                    <div
                        className={$(styles.puck, this.props.classes && this.props.classes.puck)}
                        style={{
                            left: this.puckLeft,
                        }}
                        onMouseDown={!this.props.disabled ? this.onPuckMouseDown : undefined}
                    />
                </div>
            </div>
        )
    }

    private get puckLeft(): string {
        return `${bounded(this.props.value, this.props.min, this.props.max) / this.props.max * 100}%`
    }

    private calculateMousePositionToValue(event: MouseEvent | React.MouseEvent<HTMLDivElement>) {
        const trackX = calculateX(this.trackElement)
        const percentage = bounded((event.clientX - trackX) / this.trackElement.offsetWidth, 0, 1)

        const { min, max, step } = this.props
        const rawValue = min + ((max - min) * percentage)

        return bounded(stepped(rawValue, step), min, max)
    }

    private destroyGlobalEventHandlers() {
        document.removeEventListener('mousemove', this.onGlobalMouseMove)
        document.removeEventListener('mouseup', this.onGlobalMouseUp)
    }

    private emitOnChange(value: number) {
        if (value === this.props.value) {
            return  // Nothing to do
        }

        if (this.props.onChange) {
            this.props.onChange(value)
        }
    }

    private onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key !== KEY_ARROW_LEFT && event.key !== KEY_ARROW_RIGHT) {
            return  // Nothing to do
        }

        event.preventDefault()  // Prevent selection of downstream text

        const { min, max } = this.props
        const step = this.props.step || DEFAULT_STEP
        const multiplier = event.shiftKey ? DEFAULT_SHIFT_MULTIPLIER : 1
        const direction = event.key === KEY_ARROW_LEFT ? -1 : 1
        const rawValue = this.props.value + (step * multiplier * direction)

        const value = bounded(stepped(rawValue, step), min, max)
        this.emitOnChange(value)
    }

    private onPuckMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation()

        this.setState({
            isDraggingPuck: true,
            startingMouseX: event.clientX,
        })

        document.addEventListener('mousemove', this.onGlobalMouseMove)
        document.addEventListener('mouseup', this.onGlobalMouseUp)
    }

    private onContainerMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        this.emitOnChange(this.calculateMousePositionToValue(event))
    }

    private onGlobalMouseMove = (event: MouseEvent) => {
        this.emitOnChange(this.calculateMousePositionToValue(event))
    }

    private onGlobalMouseUp = () => {
        this.setState({ isDraggingPuck: false })
        this.destroyGlobalEventHandlers()
    }
}


interface IProps {
    className?: string
    tabIndex?: number

    classes?: IClasses
    disabled?: boolean
    min?: number
    max: number
    value: number
    step?: number

    onChange?(value: number): void
}


interface IState {
    isDraggingPuck?: boolean
    startingMouseX?: number
}


interface IClasses {
    isDisabled?: string
    isDragging?: string
    puck?: string
    track?: string
}


function bounded(n: number, min: number, max: number) {
    return Math.max(Math.min(n, max), min)
}


function calculateX(e: HTMLElement) {
    return e ? e.offsetLeft + calculateX(e.offsetParent as HTMLElement) : 0
}


function stepped(n: number, step: number = DEFAULT_STEP) {
    const remainder = Math.round((n % step) * 100000) / 100000  // Naively deal with JS floating point wackiness
    return remainder > 0 ? n - remainder + step : n
}
