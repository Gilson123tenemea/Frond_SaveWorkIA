export interface Company {
  id: number
  name: string
  supervisorId: number | null
  workers: number
  cameras: number
  zones: number
  status: "active" | "inactive"
  plan: "Basic" | "Premium" | "Enterprise"
  createdAt: string
}

export interface User {
  id: number
  name: string
  email: string
  password: string
  role: "admin" | "supervisor" | "inspector"
  companyId: number | null
  company: string | null
  status: "active" | "inactive"
  createdAt: string
}

export interface Zone {
  id: number
  name: string
  companyId: number
  company: string
  latitude: number
  longitude: number
  cameras: number
  status: "active" | "inactive"
  createdAt: string
}

export interface Camera {
  id: number
  name: string
  zoneId: number
  zone: string
  companyId: number
  company: string
  location: string
  status: "online" | "offline" | "maintenance"
  resolution: "720p" | "1080p" | "4K"
  createdAt: string
}

export interface Inspector {
  id: number
  name: string
  email: string
  phone: string
  companyId: number
  company: string
  status: "active" | "inactive"
  createdAt: string
}

export interface Worker {
  id: number
  name: string
  dni: string
  position: string
  companyId: number
  company: string
  zoneId: number | null
  zone: string | null
  shift: "Mañana" | "Tarde" | "Noche"
  status: "active" | "inactive"
  createdAt: string
}

export interface ZoneInspectorAssignment {
  id: number
  zoneId: number
  inspectorId: number
  companyId: number
  createdAt: string
}

export interface ZoneWorkerStats {
  zoneId: number
  totalWorkers: number
  compliantWorkers: number
  nonCompliantWorkers: number
}

export interface SafetyAlert {
  id: number
  workerId: number
  workerName: string
  workerPhoto: string
  zoneId: number
  zoneName: string
  companyId: number
  violation: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  timestamp: string
  observations: string | null
  status: "pending" | "reviewed" | "resolved"
  createdAt: string
}

export interface WorkerAlert {
  id: number
  workerId: number
  workerName: string
  workerDni: string
  zoneId: number
  zoneName: string
  companyId: number
  violation: string
  timestamp: string
  photoUrl: string
  observations: string[]
  status: "pending" | "reviewed" | "resolved"
  severity: "low" | "medium" | "high"
}

export interface Report {
  id: number
  title: string
  type: "daily" | "weekly" | "monthly"
  date: string
  zoneId: number
  zoneName: string
  inspectorId: number
  inspectorName: string
  status: "draft" | "published"
  content: string
}

// Initialize with mock data
const INITIAL_COMPANIES: Company[] = [
  {
    id: 1,
    name: "Constructora ABC",
    supervisorId: 2,
    workers: 45,
    cameras: 12,
    zones: 3,
    status: "active",
    plan: "Premium",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Minera XYZ",
    supervisorId: 3,
    workers: 120,
    cameras: 25,
    zones: 5,
    status: "active",
    plan: "Enterprise",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Manufactura DEF",
    supervisorId: 4,
    workers: 85,
    cameras: 18,
    zones: 4,
    status: "active",
    plan: "Premium",
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Logística GHI",
    supervisorId: null,
    workers: 32,
    cameras: 8,
    zones: 2,
    status: "inactive",
    plan: "Basic",
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Industria JKL",
    supervisorId: 5,
    workers: 67,
    cameras: 15,
    zones: 3,
    status: "active",
    plan: "Premium",
    createdAt: new Date().toISOString(),
  },
]

const INITIAL_USERS: User[] = [
  {
    id: 1,
    name: "Admin Principal",
    email: "admin@savework.com",
    password: "admin123",
    role: "admin",
    companyId: null,
    company: null,
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "María González",
    email: "supervisor@test.com",
    password: "supervisor123",
    role: "supervisor",
    companyId: 1,
    company: "Constructora ABC",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Carlos Supervisor",
    email: "carlos@minera.com",
    password: "pass123",
    role: "supervisor",
    companyId: 2,
    company: "Minera XYZ",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Ana Supervisora",
    email: "ana@manufactura.com",
    password: "pass123",
    role: "supervisor",
    companyId: 3,
    company: "Manufactura DEF",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Pedro Inspector",
    email: "inspector@test.com",
    password: "inspector123",
    role: "inspector",
    companyId: 5,
    company: "Industria JKL",
    status: "active",
    createdAt: new Date().toISOString(),
  },
]

const INITIAL_ZONES: Zone[] = [
  {
    id: 1,
    name: "Zona A - Almacén Principal",
    companyId: 1,
    company: "Constructora ABC",
    latitude: -12.0464,
    longitude: -77.0428,
    cameras: 4,
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Zona B - Área de Carga",
    companyId: 1,
    company: "Constructora ABC",
    latitude: -12.0474,
    longitude: -77.0438,
    cameras: 3,
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Zona C - Producción",
    companyId: 2,
    company: "Minera XYZ",
    latitude: -12.0484,
    longitude: -77.0448,
    cameras: 8,
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Zona D - Estacionamiento",
    companyId: 2,
    company: "Minera XYZ",
    latitude: -12.0494,
    longitude: -77.0458,
    cameras: 5,
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Zona E - Ensamblaje",
    companyId: 3,
    company: "Manufactura DEF",
    latitude: -12.0504,
    longitude: -77.0468,
    cameras: 6,
    status: "active",
    createdAt: new Date().toISOString(),
  },
]

const INITIAL_CAMERAS: Camera[] = [
  {
    id: 1,
    name: "CAM-A01",
    zoneId: 1,
    zone: "Zona A - Almacén Principal",
    companyId: 1,
    company: "Constructora ABC",
    location: "Entrada Principal",
    status: "online",
    resolution: "1080p",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "CAM-A02",
    zoneId: 1,
    zone: "Zona A - Almacén Principal",
    companyId: 1,
    company: "Constructora ABC",
    location: "Área de Almacenaje",
    status: "online",
    resolution: "4K",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "CAM-B01",
    zoneId: 2,
    zone: "Zona B - Área de Carga",
    companyId: 1,
    company: "Constructora ABC",
    location: "Muelle de Carga",
    status: "online",
    resolution: "1080p",
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: "CAM-C01",
    zoneId: 3,
    zone: "Zona C - Producción",
    companyId: 2,
    company: "Minera XYZ",
    location: "Línea 1",
    status: "online",
    resolution: "1080p",
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    name: "CAM-C02",
    zoneId: 3,
    zone: "Zona C - Producción",
    companyId: 2,
    company: "Minera XYZ",
    location: "Línea 2",
    status: "maintenance",
    resolution: "1080p",
    createdAt: new Date().toISOString(),
  },
]

const STORAGE_KEYS = {
  COMPANIES: "savework_companies",
  USERS: "savework_users",
  ZONES: "savework_zones",
  CAMERAS: "savework_cameras",
  INSPECTORS: "savework_inspectors",
  WORKERS: "savework_workers",
  ZONE_INSPECTOR_ASSIGNMENTS: "savework_zone_inspector_assignments",
  ZONE_WORKER_STATS: "savework_zone_worker_stats",
  WORKER_ALERTS: "savework_worker_alerts",
  REPORTS: "savework_reports",
}

// Initialize storage if empty
export function initializeStorage() {
  if (typeof window === "undefined") return

  if (!localStorage.getItem(STORAGE_KEYS.COMPANIES)) {
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(INITIAL_COMPANIES))
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS))
  }
  if (!localStorage.getItem(STORAGE_KEYS.ZONES)) {
    localStorage.setItem(STORAGE_KEYS.ZONES, JSON.stringify(INITIAL_ZONES))
  }
  if (!localStorage.getItem(STORAGE_KEYS.CAMERAS)) {
    localStorage.setItem(STORAGE_KEYS.CAMERAS, JSON.stringify(INITIAL_CAMERAS))
  }
  if (!localStorage.getItem(STORAGE_KEYS.INSPECTORS)) {
    localStorage.setItem(STORAGE_KEYS.INSPECTORS, JSON.stringify([]))
  }
  if (!localStorage.getItem(STORAGE_KEYS.WORKERS)) {
    localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify([]))
  }
  if (!localStorage.getItem(STORAGE_KEYS.ZONE_INSPECTOR_ASSIGNMENTS)) {
    localStorage.setItem(STORAGE_KEYS.ZONE_INSPECTOR_ASSIGNMENTS, JSON.stringify([]))
  }
  if (!localStorage.getItem(STORAGE_KEYS.ZONE_WORKER_STATS)) {
    localStorage.setItem(STORAGE_KEYS.ZONE_WORKER_STATS, JSON.stringify([]))
  }
  // Initialize SafetyAlerts and Reports if empty
  if (!localStorage.getItem(STORAGE_KEYS.SAFETY_ALERTS)) {
    localStorage.setItem(STORAGE_KEYS.SAFETY_ALERTS, JSON.stringify([]))
  }
  if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify([]))
  }
  if (!localStorage.getItem(STORAGE_KEYS.WORKER_ALERTS)) {
    localStorage.setItem(STORAGE_KEYS.WORKER_ALERTS, JSON.stringify([]))
  }
}

// Companies CRUD
export function getCompanies(): Company[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.COMPANIES)
  return data ? JSON.parse(data) : []
}

export function saveCompany(company: Omit<Company, "id" | "createdAt">): Company {
  const companies = getCompanies()
  const newCompany: Company = {
    ...company,
    id: companies.length > 0 ? Math.max(...companies.map((c) => c.id)) + 1 : 1,
    createdAt: new Date().toISOString(),
  }
  companies.push(newCompany)
  localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies))
  return newCompany
}

export function updateCompany(id: number, data: Partial<Company>): void {
  const companies = getCompanies()
  const index = companies.findIndex((c) => c.id === id)
  if (index !== -1) {
    companies[index] = { ...companies[index], ...data }
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies))
  }
}

export function deleteCompany(id: number): void {
  const companies = getCompanies().filter((c) => c.id !== id)
  localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies))

  // Also delete related zones and cameras
  const zones = getZones().filter((z) => z.companyId !== id)
  localStorage.setItem(STORAGE_KEYS.ZONES, JSON.stringify(zones))

  const cameras = getCameras().filter((c) => c.companyId !== id)
  localStorage.setItem(STORAGE_KEYS.CAMERAS, JSON.stringify(cameras))

  // Also delete related workers and assignments
  const workers = getWorkers().filter((w) => w.companyId !== id)
  localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(workers))

  const assignments = getZoneInspectorAssignments().filter((a) => a.companyId !== id)
  localStorage.setItem(STORAGE_KEYS.ZONE_INSPECTOR_ASSIGNMENTS, JSON.stringify(assignments))

  const stats = getZoneWorkerStats().filter((s) => {
    const zone = zones.find((z) => z.id === s.zoneId)
    return zone ? true : false
  })
  localStorage.setItem(STORAGE_KEYS.ZONE_WORKER_STATS, JSON.stringify(stats))

  // Also delete related safety alerts and reports
  const alerts = getSafetyAlerts().filter((a) => a.companyId !== id)
  localStorage.setItem(STORAGE_KEYS.SAFETY_ALERTS, JSON.stringify(alerts))

  const reports = getReports().filter((r) => r.companyId !== id)
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports))

  const workerAlerts = getWorkerAlerts().filter((a) => a.companyId !== id)
  localStorage.setItem(STORAGE_KEYS.WORKER_ALERTS, JSON.stringify(workerAlerts))
}

// Users CRUD
export function getUsers(): User[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.USERS)
  return data ? JSON.parse(data) : []
}

export function saveUser(user: Omit<User, "id" | "createdAt">): User {
  const users = getUsers()
  const newUser: User = {
    ...user,
    id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
    createdAt: new Date().toISOString(),
  }
  users.push(newUser)
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
  return newUser
}

export function updateUser(id: number, data: Partial<User>): void {
  const users = getUsers()
  const index = users.findIndex((u) => u.id === id)
  if (index !== -1) {
    users[index] = { ...users[index], ...data }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
  }
}

export function deleteUser(id: number): void {
  const users = getUsers().filter((u) => u.id !== id)
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
}

// Zones CRUD
export function getZones(): Zone[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.ZONES)
  return data ? JSON.parse(data) : []
}

export function saveZone(zone: Omit<Zone, "id" | "createdAt">): Zone {
  const zones = getZones()
  const newZone: Zone = {
    ...zone,
    id: zones.length > 0 ? Math.max(...zones.map((z) => z.id)) + 1 : 1,
    createdAt: new Date().toISOString(),
  }
  zones.push(newZone)
  localStorage.setItem(STORAGE_KEYS.ZONES, JSON.stringify(zones))

  // Update company zones count
  const companies = getCompanies()
  const companyIndex = companies.findIndex((c) => c.id === zone.companyId)
  if (companyIndex !== -1) {
    companies[companyIndex].zones += 1
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies))
  }

  return newZone
}

export function updateZone(id: number, data: Partial<Zone>): void {
  const zones = getZones()
  const index = zones.findIndex((z) => z.id === id)
  if (index !== -1) {
    zones[index] = { ...zones[index], ...data }
    localStorage.setItem(STORAGE_KEYS.ZONES, JSON.stringify(zones))
  }
}

export function deleteZone(id: number): void {
  const zone = getZones().find((z) => z.id === id)
  const zones = getZones().filter((z) => z.id !== id)
  localStorage.setItem(STORAGE_KEYS.ZONES, JSON.stringify(zones))

  // Update company zones count
  if (zone) {
    const companies = getCompanies()
    const companyIndex = companies.findIndex((c) => c.id === zone.companyId)
    if (companyIndex !== -1) {
      companies[companyIndex].zones = Math.max(0, companies[companyIndex].zones - 1)
      localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies))
    }
  }

  // Also delete related cameras
  const cameras = getCameras().filter((c) => c.zoneId !== id)
  localStorage.setItem(STORAGE_KEYS.CAMERAS, JSON.stringify(cameras))

  // Also delete related workers
  const workers = getWorkers().filter((w) => w.zoneId !== id)
  localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(workers))

  // Also delete related assignments
  const assignments = getZoneInspectorAssignments().filter((a) => a.zoneId !== id)
  localStorage.setItem(STORAGE_KEYS.ZONE_INSPECTOR_ASSIGNMENTS, JSON.stringify(assignments))

  // Also delete related stats
  const stats = getZoneWorkerStats().filter((s) => s.zoneId !== id)
  localStorage.setItem(STORAGE_KEYS.ZONE_WORKER_STATS, JSON.stringify(stats))

  // Also delete related safety alerts
  const alerts = getSafetyAlerts().filter((a) => a.zoneId !== id)
  localStorage.setItem(STORAGE_KEYS.SAFETY_ALERTS, JSON.stringify(alerts))

  // Also delete related reports
  const reports = getReports().filter((r) => r.zoneId !== id)
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports))

  // Also delete related worker alerts
  const workerAlerts = getWorkerAlerts().filter((a) => a.zoneId !== id)
  localStorage.setItem(STORAGE_KEYS.WORKER_ALERTS, JSON.stringify(workerAlerts))
}

// Cameras CRUD
export function getCameras(): Camera[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.CAMERAS)
  return data ? JSON.parse(data) : []
}

export function saveCamera(camera: Omit<Camera, "id" | "createdAt">): Camera {
  const cameras = getCameras()
  const newCamera: Camera = {
    ...camera,
    id: cameras.length > 0 ? Math.max(...cameras.map((c) => c.id)) + 1 : 1,
    createdAt: new Date().toISOString(),
  }
  cameras.push(newCamera)
  localStorage.setItem(STORAGE_KEYS.CAMERAS, JSON.stringify(cameras))

  // Update zone and company cameras count
  const zones = getZones()
  const zoneIndex = zones.findIndex((z) => z.id === camera.zoneId)
  if (zoneIndex !== -1) {
    zones[zoneIndex].cameras += 1
    localStorage.setItem(STORAGE_KEYS.ZONES, JSON.stringify(zones))
  }

  const companies = getCompanies()
  const companyIndex = companies.findIndex((c) => c.id === camera.companyId)
  if (companyIndex !== -1) {
    companies[companyIndex].cameras += 1
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies))
  }

  return newCamera
}

export function updateCamera(id: number, data: Partial<Camera>): void {
  const cameras = getCameras()
  const index = cameras.findIndex((c) => c.id === id)
  if (index !== -1) {
    cameras[index] = { ...cameras[index], ...data }
    localStorage.setItem(STORAGE_KEYS.CAMERAS, JSON.stringify(cameras))
  }
}

export function deleteCamera(id: number): void {
  const camera = getCameras().find((c) => c.id === id)
  const cameras = getCameras().filter((c) => c.id !== id)
  localStorage.setItem(STORAGE_KEYS.CAMERAS, JSON.stringify(cameras))

  // Update zone and company cameras count
  if (camera) {
    const zones = getZones()
    const zoneIndex = zones.findIndex((z) => z.id === camera.zoneId)
    if (zoneIndex !== -1) {
      zones[zoneIndex].cameras = Math.max(0, zones[zoneIndex].cameras - 1)
      localStorage.setItem(STORAGE_KEYS.ZONES, JSON.stringify(zones))
    }

    const companies = getCompanies()
    const companyIndex = companies.findIndex((c) => c.id === camera.companyId)
    if (companyIndex !== -1) {
      companies[companyIndex].cameras = Math.max(0, companies[companyIndex].cameras - 1)
      localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies))
    }
  }
}

export function getInspectors(): Inspector[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.INSPECTORS)
  return data ? JSON.parse(data) : []
}

export function saveInspector(inspector: Omit<Inspector, "id" | "createdAt">): Inspector {
  const inspectors = getInspectors()
  const newInspector: Inspector = {
    ...inspector,
    id: inspectors.length > 0 ? Math.max(...inspectors.map((i) => i.id)) + 1 : 1,
    createdAt: new Date().toISOString(),
  }
  inspectors.push(newInspector)
  localStorage.setItem(STORAGE_KEYS.INSPECTORS, JSON.stringify(inspectors))
  return newInspector
}

export function updateInspector(id: number, data: Partial<Inspector>): void {
  const inspectors = getInspectors()
  const index = inspectors.findIndex((i) => i.id === id)
  if (index !== -1) {
    inspectors[index] = { ...inspectors[index], ...data }
    localStorage.setItem(STORAGE_KEYS.INSPECTORS, JSON.stringify(inspectors))
  }
}

export function deleteInspector(id: number): void {
  const inspectors = getInspectors().filter((i) => i.id !== id)
  localStorage.setItem(STORAGE_KEYS.INSPECTORS, JSON.stringify(inspectors))

  // Remove assignments
  const assignments = getZoneInspectorAssignments().filter((a) => a.inspectorId !== id)
  localStorage.setItem(STORAGE_KEYS.ZONE_INSPECTOR_ASSIGNMENTS, JSON.stringify(assignments))

  // Remove related reports
  const reports = getReports().filter((r) => r.inspectorId !== id)
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports))

  // Remove related worker alerts
  const workerAlerts = getWorkerAlerts().filter((a) => a.inspectorId !== id)
  localStorage.setItem(STORAGE_KEYS.WORKER_ALERTS, JSON.stringify(workerAlerts))
}

export function getWorkers(): Worker[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.WORKERS)
  return data ? JSON.parse(data) : []
}

export function saveWorker(worker: Omit<Worker, "id" | "createdAt">): Worker {
  const workers = getWorkers()
  const newWorker: Worker = {
    ...worker,
    id: workers.length > 0 ? Math.max(...workers.map((w) => w.id)) + 1 : 1,
    createdAt: new Date().toISOString(),
  }
  workers.push(newWorker)
  localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(workers))
  return newWorker
}

export function updateWorker(id: number, data: Partial<Worker>): void {
  const workers = getWorkers()
  const index = workers.findIndex((w) => w.id === id)
  if (index !== -1) {
    workers[index] = { ...workers[index], ...data }
    localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(workers))
  }
}

export function deleteWorker(id: number): void {
  const workers = getWorkers().filter((w) => w.id !== id)
  localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(workers))
}

export function getZoneInspectorAssignments(): ZoneInspectorAssignment[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.ZONE_INSPECTOR_ASSIGNMENTS)
  return data ? JSON.parse(data) : []
}

export function saveZoneInspectorAssignment(
  assignment: Omit<ZoneInspectorAssignment, "id" | "createdAt">,
): ZoneInspectorAssignment {
  const assignments = getZoneInspectorAssignments()
  const newAssignment: ZoneInspectorAssignment = {
    ...assignment,
    id: assignments.length > 0 ? Math.max(...assignments.map((a) => a.id)) + 1 : 1,
    createdAt: new Date().toISOString(),
  }
  assignments.push(newAssignment)
  localStorage.setItem(STORAGE_KEYS.ZONE_INSPECTOR_ASSIGNMENTS, JSON.stringify(assignments))
  return newAssignment
}

export function deleteZoneInspectorAssignment(zoneId: number, inspectorId: number): void {
  const assignments = getZoneInspectorAssignments().filter(
    (a) => !(a.zoneId === zoneId && a.inspectorId === inspectorId),
  )
  localStorage.setItem(STORAGE_KEYS.ZONE_INSPECTOR_ASSIGNMENTS, JSON.stringify(assignments))
}

export function getInspectorsByZone(zoneId: number): Inspector[] {
  const assignments = getZoneInspectorAssignments().filter((a) => a.zoneId === zoneId)
  const inspectors = getInspectors()
  return assignments.map((a) => inspectors.find((i) => i.id === a.inspectorId)).filter(Boolean) as Inspector[]
}

export function getZonesByInspector(inspectorId: number): Zone[] {
  const assignments = getZoneInspectorAssignments().filter((a) => a.inspectorId === inspectorId)
  const zones = getZones()
  return assignments.map((a) => zones.find((z) => z.id === a.zoneId)).filter(Boolean) as Zone[]
}

export function getZoneWorkerStats(): ZoneWorkerStats[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.ZONE_WORKER_STATS)
  if (data) return JSON.parse(data)

  // Initialize with mock data
  const zones = getZones()
  const stats: ZoneWorkerStats[] = zones.map((zone) => {
    const totalWorkers = Math.floor(Math.random() * 15) + 5
    const nonCompliantWorkers = Math.floor(Math.random() * 5)
    return {
      zoneId: zone.id,
      totalWorkers,
      compliantWorkers: totalWorkers - nonCompliantWorkers,
      nonCompliantWorkers,
    }
  })
  localStorage.setItem(STORAGE_KEYS.ZONE_WORKER_STATS, JSON.stringify(stats))
  return stats
}

export function updateZoneWorkerStats(zoneId: number, stats: Partial<ZoneWorkerStats>): void {
  const allStats = getZoneWorkerStats()
  const index = allStats.findIndex((s) => s.zoneId === zoneId)
  if (index !== -1) {
    allStats[index] = { ...allStats[index], ...stats }
  } else {
    allStats.push({ zoneId, totalWorkers: 0, compliantWorkers: 0, nonCompliantWorkers: 0, ...stats })
  }
  localStorage.setItem(STORAGE_KEYS.ZONE_WORKER_STATS, JSON.stringify(allStats))
}

// SafetyAlerts CRUD
export function getSafetyAlerts(): SafetyAlert[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.SAFETY_ALERTS)
  if (data) return JSON.parse(data)

  // Initialize with mock data
  const mockAlerts: SafetyAlert[] = [
    {
      id: 1,
      workerId: 1,
      workerName: "Juan Pérez",
      workerPhoto: "/worker-hardhat.jpg",
      zoneId: 1,
      zoneName: "Zona A - Almacén Principal",
      companyId: 1,
      violation: "Sin casco de seguridad",
      description: "Trabajador detectado sin casco en área de alto riesgo",
      severity: "high",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      observations: null,
      status: "pending",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      workerId: 2,
      workerName: "María González",
      workerPhoto: "/female-worker-safety.jpg",
      zoneId: 1,
      zoneName: "Zona A - Almacén Principal",
      companyId: 1,
      violation: "Sin chaleco reflectante",
      description: "Falta de chaleco en zona de circulación de montacargas",
      severity: "medium",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      observations: "Trabajador notificado, se le proporcionó chaleco nuevo",
      status: "reviewed",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      workerId: 3,
      workerName: "Carlos Ruiz",
      workerPhoto: "/construction-worker-safety.png",
      zoneId: 1,
      zoneName: "Zona A - Almacén Principal",
      companyId: 1,
      violation: "Sin guantes de protección",
      description: "Manipulación de materiales sin guantes apropiados",
      severity: "medium",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      observations: null,
      status: "pending",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 4,
      workerId: 4,
      workerName: "Ana Torres",
      workerPhoto: "/female-engineer-helmet.jpg",
      zoneId: 1,
      zoneName: "Zona A - Almacén Principal",
      companyId: 1,
      violation: "Sin gafas de seguridad",
      description: "Trabajo en área con riesgo de proyección de partículas",
      severity: "high",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      observations: null,
      status: "pending",
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
  ]
  localStorage.setItem(STORAGE_KEYS.SAFETY_ALERTS, JSON.stringify(mockAlerts))
  return mockAlerts
}

export function saveSafetyAlert(alert: Omit<SafetyAlert, "id" | "createdAt">): SafetyAlert {
  const alerts = getSafetyAlerts()
  const newAlert: SafetyAlert = {
    ...alert,
    id: alerts.length > 0 ? Math.max(...alerts.map((a) => a.id)) + 1 : 1,
    createdAt: new Date().toISOString(),
  }
  alerts.push(newAlert)
  localStorage.setItem(STORAGE_KEYS.SAFETY_ALERTS, JSON.stringify(alerts))
  return newAlert
}

export function updateSafetyAlert(id: number, data: Partial<SafetyAlert>): void {
  const alerts = getSafetyAlerts()
  const index = alerts.findIndex((a) => a.id === id)
  if (index !== -1) {
    alerts[index] = { ...alerts[index], ...data }
    localStorage.setItem(STORAGE_KEYS.SAFETY_ALERTS, JSON.stringify(alerts))
  }
}

export function deleteSafetyAlert(id: number): void {
  const alerts = getSafetyAlerts().filter((a) => a.id !== id)
  localStorage.setItem(STORAGE_KEYS.SAFETY_ALERTS, JSON.stringify(alerts))
}

// Reports CRUD
export function getReports(): Report[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.REPORTS)
  if (data) return JSON.parse(data)

  // Initialize with mock data
  const mockReports: Report[] = [
    {
      id: 1,
      title: "Reporte Diario - 09 Nov 2025",
      type: "daily",
      date: "2025-11-09",
      zoneId: 1,
      zoneName: "Zona A - Almacén Principal",
      inspectorId: 5,
      inspectorName: "Pedro Inspector",
      status: "published",
      content: "Inspección rutinaria completada. 4 alertas registradas durante el turno.",
    },
    {
      id: 2,
      title: "Reporte Diario - 08 Nov 2025",
      type: "daily",
      date: "2025-11-08",
      zoneId: 1,
      zoneName: "Zona A - Almacén Principal",
      inspectorId: 5,
      inspectorName: "Pedro Inspector",
      status: "published",
      content: "Jornada normal. 2 incumplimientos menores detectados.",
    },
    {
      id: 3,
      title: "Reporte Semanal - Semana 45",
      type: "weekly",
      date: "2025-11-04",
      zoneId: 1,
      zoneName: "Zona A - Almacén Principal",
      inspectorId: 5,
      inspectorName: "Pedro Inspector",
      status: "published",
      content: "Resumen de la semana: 12 alertas totales, 3 incidentes menores.",
    },
  ]
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(mockReports))
  return mockReports
}

export function saveReport(report: Omit<Report, "id">): Report {
  const reports = getReports()
  const newReport: Report = {
    ...report,
    id: reports.length > 0 ? Math.max(...reports.map((r) => r.id)) + 1 : 1,
  }
  reports.push(newReport)
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports))
  return newReport
}

export function updateReport(id: number, data: Partial<Report>): void {
  const reports = getReports()
  const index = reports.findIndex((r) => r.id === id)
  if (index !== -1) {
    reports[index] = { ...reports[index], ...data }
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports))
  }
}

export function deleteReport(id: number): void {
  const reports = getReports().filter((r) => r.id !== id)
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports))
}

// Worker Alerts CRUD
export function getWorkerAlerts(): WorkerAlert[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.WORKER_ALERTS)
  if (data) return JSON.parse(data)

  // Initialize with mock data
  const mockAlerts: WorkerAlert[] = [
    {
      id: 1,
      workerId: 1,
      workerName: "Juan Pérez",
      workerDni: "12345678",
      zoneId: 1,
      zoneName: "Zona A - Almacén Principal",
      companyId: 1,
      violation: "Sin casco de seguridad",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      photoUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/-spYGcJTKH2dEX3ctIJrEBPMy5e0bnW.jpg",
      observations: [],
      status: "pending",
      severity: "high",
    },
    {
      id: 2,
      workerId: 2,
      workerName: "María López",
      workerDni: "87654321",
      zoneId: 1,
      zoneName: "Zona A - Almacén Principal",
      companyId: 1,
      violation: "Sin chaleco reflectivo",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      photoUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/-spYGcJTKH2dEX3ctIJrEBPMy5e0bnW.jpg",
      observations: ["Trabajador notificado", "Primera vez que ocurre"],
      status: "reviewed",
      severity: "medium",
    },
    {
      id: 3,
      workerId: 3,
      workerName: "Carlos Rodríguez",
      workerDni: "45678912",
      zoneId: 2,
      zoneName: "Zona B - Área de Carga",
      companyId: 1,
      violation: "Sin guantes de protección",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      photoUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/-spYGcJTKH2dEX3ctIJrEBPMy5e0bnW.jpg",
      observations: [],
      status: "pending",
      severity: "medium",
    },
  ]
  localStorage.setItem(STORAGE_KEYS.WORKER_ALERTS, JSON.stringify(mockAlerts))
  return mockAlerts
}

export function addObservationToAlert(alertId: number, observation: string): void {
  const alerts = getWorkerAlerts()
  const index = alerts.findIndex((a) => a.id === alertId)
  if (index !== -1) {
    alerts[index].observations.push(observation)
    alerts[index].status = "reviewed"
    localStorage.setItem(STORAGE_KEYS.WORKER_ALERTS, JSON.stringify(alerts))
  }
}

export function updateAlertStatus(alertId: number, status: WorkerAlert["status"]): void {
  const alerts = getWorkerAlerts()
  const index = alerts.findIndex((a) => a.id === alertId)
  if (index !== -1) {
    alerts[index].status = status
    localStorage.setItem(STORAGE_KEYS.WORKER_ALERTS, JSON.stringify(alerts))
  }
}
