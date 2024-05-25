'use client'

import { nanoid } from "nanoid"

export const get_uuid = () => {
    return `${nanoid(8)}-${nanoid(4)}-${nanoid(4)}-${nanoid(4)}-${nanoid(12)}`
}