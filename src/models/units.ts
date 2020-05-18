
export interface PollingDistrict{
    name: string;
    polling_division: number;
    id: number;
}  
export interface PollingDivision {
    name: string;
    administrative_district: number;
    is: number;
}
export interface AdministrativeDistrict {
    name: string;
    electoral_district: number;
    id: number;
}
export interface ElectoralDistrict {
    name: string;
    id: number;
}
export interface Election {
    name: string;
    date: string;
    active: boolean;
    id: number;
}
export interface PollingStation {
    election: number;
    number: number;
    spo: number;
    name: string;
    polling_district: number;
    id: number;
}
export interface CountingCentre {
    name: string;
    number: number;
    cco: number;
    aro: number;
    election: number;
    polling_division: number;
    id: number;
}
