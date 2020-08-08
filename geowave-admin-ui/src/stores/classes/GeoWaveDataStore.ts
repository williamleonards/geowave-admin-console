import { IIndex } from "../SystemStore";
import * as http from '../../utils/http'
import { IStoreStatus } from "../GeoWaveStore";
import { computed } from "mobx";


export class GeoWaveDataStore {
    public indices: IIndex[];

    constructor(public storeName: string, 
                public type: DATABASE_TYPE, 
                public options: { [key: string]: string }) {

    }

    @computed
    canClear(): boolean {
        return Boolean(this.indices.length)
    }

    //returns true/false depending on if the call was successful
    async remove(): Promise<boolean> {
        try {
            const name = {"name": this.storeName}
            await http.post<IStoreStatus>('/api/sys/removeStore', name)
            return true
        }
        finally {
            return false
        }

    }

    async clear(): Promise<boolean> {
        if (!this.canClear) return false
        
        try {
            const name = {"name": this.storeName}
            await http.post<IStoreStatus>('/api/sys/clearStore', name)
            return true
        }
        finally {
            return false
        }
    }

    async addIndex(): Promise<boolean> {
        return false
    }
}

// add more enums as they are supported
// currently only support Redis
export enum DATABASE_TYPE { REDIS }