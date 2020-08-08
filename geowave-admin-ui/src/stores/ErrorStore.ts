import { action, observable } from 'mobx'


export class ErrorStore {
    @observable items: IError[] = []

    @action
    append(heading: string, description: string, err: Error = null) {
        this.items.push({
            heading,
            description,
            err,
            id: Math.random().toString(16).substr(2),
        })
    }

    @action
    dismiss(id: string) {
        this.items = this.items.filter(e => e.id !== id)
    }
}


export interface IError {
    id: string
    heading: string
    description: string
    err: Error
}
