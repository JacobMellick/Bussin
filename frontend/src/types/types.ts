export interface CrowdStatus {
    status: 'Overcrowded' | 'Moderately Crowded' | 'Low Crowd';
}

export interface ArrivalInfo {
    vehicleId: string;  // Bus number or train name
    minutes: number;
}

export interface ArrivalTimeResponse {
    arrivals: ArrivalInfo[];
}
