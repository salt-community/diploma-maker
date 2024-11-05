import { BootcampResponse } from "./bootcamps"

export type TracksResponse = {
    id: number,
    name: string,
    tag?: string,
    bootcamps: BootcampResponse[]
}