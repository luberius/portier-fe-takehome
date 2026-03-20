export type EntityType = "user" | "door" | "key"

export type UserRecord = {
  id: string
  name: string
  email: string
  phone: string
  role: string
  status: "active" | "suspended"
  created_at: string
  updated_at: string
}

export type DoorRecord = {
  id: string
  name: string
  location: string
  device_id: string
  status: "online" | "offline"
  battery_level: number
  last_seen: string
  created_at: string
}

export type KeyRecord = {
  id: string
  user_id: string
  door_id: string
  key_type: string
  access_start: string
  access_end: string
  status: "active" | "revoked"
  created_at: string
}

export type LocalState = {
  users: UserRecord[]
  doors: DoorRecord[]
  keys: KeyRecord[]
}
