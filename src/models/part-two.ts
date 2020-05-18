export interface IssueStationeries{
    id?: number;
    issued_time: string;
    no_of_stamps: number;
    no_of_pens: number;
    spo: number;
    i_r_aro?: number;
    election?: number;
    entered_time: string;
}

export interface ReceiveStationeries {
    id?: number;
    received_time: string;
    no_of_stamps: number;
    no_of_pens: number;
    spo: number;
    i_r_aro?: number;
    election?: number;
    entered_time: string;
}

export interface IssueBallotBoxes {
    id?: Number;
    serial_number: string;
    spo: number;
    i_r_aro?: number;
    election?: number;
    entered?: string;
    issued_time?: string;
}

export interface ReceiveBallotBoxes {
    id?: Number;
    serial_number: string;
    spo: number;
    i_r_aro?: number;
    election?: number;
    entered?: string;
    received_time?: string;
}
