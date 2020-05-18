import { Staff } from ".";

export interface ReportToWork<T> {
    id?: number;
    time: string;
    staff: T extends true ? Staff : number;
    i_r_aro: number;
    election?: number;
    type: string;
    date?: string;
    timestamp?: number;
}
