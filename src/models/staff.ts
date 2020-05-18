import {
    PollingDistrict,
    ElectoralDistrict,
    Election,
    CountingCentre,
    PollingStation,
    AdministrativeDistrict,
    PollingDivision
} from "./units";
export interface Staff{
    name: string;
    nic: string;
    id?: number;
    address: string;
}

export interface StaffDetails {
    profile: Staff;
    polling_districts: PollingDistrict[];
    polling_division: PollingDivision;
    administrative_district: AdministrativeDistrict;
    electoral_district: ElectoralDistrict;
    election: Election;
    polling_stations: PollingStation[];
    counting_centre: CountingCentre[];
}
