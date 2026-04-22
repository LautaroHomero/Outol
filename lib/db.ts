import fs from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'

const DB_DIR = path.join(process.cwd(), 'data')
const DB_PATH = path.join(DB_DIR, 'golfield.db')

const globalForDb = globalThis as typeof globalThis & {
  golfieldDb?: DatabaseSync
}

const schemaSql = `
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    auth0_id TEXT UNIQUE,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    role TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS venues (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    neighborhood TEXT NOT NULL,
    address TEXT
  );

  CREATE TABLE IF NOT EXISTS courts (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    venue_id TEXT NOT NULL,
    name TEXT NOT NULL,
    court_type TEXT NOT NULL,
    surface TEXT NOT NULL,
    is_covered INTEGER NOT NULL DEFAULT 0,
    has_lighting INTEGER NOT NULL DEFAULT 0,
    has_parking INTEGER NOT NULL DEFAULT 0,
    has_locker_room INTEGER NOT NULL DEFAULT 0,
    hourly_price INTEGER NOT NULL,
    old_hourly_price INTEGER,
    
    rating_average REAL NOT NULL DEFAULT 0,
    reviews_count INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL,
    featured INTEGER NOT NULL DEFAULT 0,
    no_slots_today INTEGER NOT NULL DEFAULT 0,
    badge_label TEXT,
    badge_tone TEXT,
    palette_wrap_class TEXT NOT NULL,
    palette_field_class TEXT NOT NULL,
    palette_line_border_class TEXT NOT NULL,
    palette_line_bg_class TEXT NOT NULL,
    FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS amenities (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    tone TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS court_amenities (
    court_id TEXT NOT NULL,
    amenity_id TEXT NOT NULL,
    PRIMARY KEY (court_id, amenity_id),
    FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS court_slots (
    id TEXT PRIMARY KEY,
    court_id TEXT NOT NULL,
    label TEXT NOT NULL,
    position INTEGER NOT NULL,
    FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS favorites (
    user_id TEXT NOT NULL,
    court_id TEXT NOT NULL,
    PRIMARY KEY (user_id, court_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS reservations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    court_id TEXT NOT NULL,
    starts_at TEXT NOT NULL,
    ends_at TEXT NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS promotions (
    id TEXT PRIMARY KEY,
    venue_id TEXT,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    cta_label TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE SET NULL
  );
`

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

function dateAt(daysFromToday: number, hours: number, minutes = 0) {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + daysFromToday)
  date.setHours(hours, minutes, 0, 0)
  return date.toISOString()
}

function seedDatabase(db: DatabaseSync) {
  const insert = (sql: string, values: Array<string | number | null>) =>
    db.prepare(sql).run(...values)

  const santiagoId = createId('user')
  const matiasId = createId('user')

  insert(
    'INSERT INTO users (id, auth0_id, name, email, role) VALUES (?, ?, ?, ?, ?)',
    [santiagoId, null, 'Santiago López', 'santiago@golfield.local', 'CUSTOMER']
  )
  insert(
    'INSERT INTO users (id, auth0_id, name, email, role) VALUES (?, ?, ?, ?, ?)',
    [matiasId, null, 'Matías García', 'matias@golfield.local', 'ADMIN']
  )

  const venues = {
    losPinos: createId('venue'),
    estadio: createId('venue'),
    nuevoSur: createId('venue'),
    municipal: createId('venue'),
  }

  insert(
    'INSERT INTO venues (id, slug, name, city, neighborhood, address) VALUES (?, ?, ?, ?, ?, ?)',
    [
      venues.losPinos,
      'complejo-los-pinos',
      'Complejo Los Pinos',
      'Lomas de Zamora',
      'Lomas de Zamora',
      'Av. Frías 1542',
    ]
  )
  insert(
    'INSERT INTO venues (id, slug, name, city, neighborhood, address) VALUES (?, ?, ?, ?, ?, ?)',
    [
      venues.estadio,
      'cancha-el-estadio',
      'Cancha El Estadio',
      'Lomas de Zamora',
      'Banfield',
      'French 823',
    ]
  )
  insert(
    'INSERT INTO venues (id, slug, name, city, neighborhood, address) VALUES (?, ?, ?, ?, ?, ?)',
    [
      venues.nuevoSur,
      'complejo-nuevo-sur',
      'Complejo Nuevo Sur',
      'Lomas de Zamora',
      'Temperley',
      'Garibaldi 220',
    ]
  )
  insert(
    'INSERT INTO venues (id, slug, name, city, neighborhood, address) VALUES (?, ?, ?, ?, ?, ?)',
    [
      venues.municipal,
      'polideportivo-municipal',
      'Polideportivo Municipal',
      'Lomas de Zamora',
      'Centro',
      'Alsina 1450',
    ]
  )

  const courts = {
    losPinos: createId('court'),
    estadio: createId('court'),
    nuevoSur: createId('court'),
    municipal: createId('court'),
  }

  insert(
    `
      INSERT INTO courts VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      courts.losPinos,
      'los-pinos-futbol-5',
      venues.losPinos,
      'Complejo Los Pinos',
      'FIVE',
      'SYNTHETIC',
      1,
      1,
      1,
      1,
      6500,
      null,
      0.8,
      4.7,
      132,
      'AVAILABLE',
      0,
      0,
      null,
      null,
      'bg-emerald-50',
      'bg-emerald-200',
      'border-emerald-300',
      'bg-emerald-300',
    ]
  )
  insert(
    `
      INSERT INTO courts VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      courts.estadio,
      'el-estadio-futbol-7',
      venues.estadio,
      'Cancha El Estadio',
      'SEVEN',
      'SYNTHETIC',
      0,
      1,
      1,
      1,
      7200,
      null,
      1.2,
      4.9,
      208,
      'OCCUPIED',
      1,
      0,
      'Más reservado',
      'BLUE',
      'bg-sky-50',
      'bg-sky-200',
      'border-sky-300',
      'bg-sky-300',
    ]
  )
  insert(
    `
      INSERT INTO courts VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      courts.nuevoSur,
      'nuevo-sur-futbol-5',
      venues.nuevoSur,
      'Complejo Nuevo Sur',
      'FIVE',
      'SYNTHETIC',
      1,
      0,
      0,
      1,
      4000,
      8000,
      2.1,
      4.2,
      18,
      'AVAILABLE',
      0,
      0,
      '50% OFF',
      'RED',
      'bg-amber-50',
      'bg-amber-200',
      'border-amber-400',
      'bg-amber-400',
    ]
  )
  insert(
    `
      INSERT INTO courts VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      courts.municipal,
      'municipal-futbol-7',
      venues.municipal,
      'Polideportivo Municipal',
      'SEVEN',
      'CEMENT',
      0,
      1,
      0,
      0,
      5500,
      null,
      3,
      3.8,
      55,
      'MAINTENANCE',
      0,
      1,
      'Sin turnos hoy',
      'GRAY',
      'bg-stone-100',
      'bg-stone-200',
      'border-stone-400',
      'bg-stone-400',
    ]
  )

  const amenities = {
    led: createId('amenity'),
    vestuarios: createId('amenity'),
    estacionamiento: createId('amenity'),
    bar: createId('amenity'),
    wifi: createId('amenity'),
    nuevo: createId('amenity'),
    inauguracion: createId('amenity'),
    tribuna: createId('amenity'),
    iluminacion: createId('amenity'),
  }

  ;[
    [amenities.led, 'led', 'Iluminación LED', 'GREEN'],
    [amenities.vestuarios, 'vestuarios', 'Vestuarios', 'GREEN'],
    [amenities.estacionamiento, 'estacionamiento', 'Estacionamiento', 'BLUE'],
    [amenities.bar, 'bar', 'Bar', 'NEUTRAL'],
    [amenities.wifi, 'wifi', 'Wifi', 'NEUTRAL'],
    [amenities.nuevo, 'nuevo', 'Nuevo', 'GREEN'],
    [amenities.inauguracion, 'inauguracion', 'Inauguración', 'RED'],
    [amenities.tribuna, 'tribuna', 'Tribuna', 'NEUTRAL'],
    [amenities.iluminacion, 'iluminacion', 'Iluminación', 'NEUTRAL'],
  ].forEach((row) =>
    insert('INSERT INTO amenities (id, slug, label, tone) VALUES (?, ?, ?, ?)', row)
  )

  ;[
    [courts.losPinos, amenities.led],
    [courts.losPinos, amenities.vestuarios],
    [courts.losPinos, amenities.estacionamiento],
    [courts.losPinos, amenities.bar],
    [courts.estadio, amenities.led],
    [courts.estadio, amenities.estacionamiento],
    [courts.estadio, amenities.vestuarios],
    [courts.estadio, amenities.wifi],
    [courts.nuevoSur, amenities.inauguracion],
    [courts.nuevoSur, amenities.nuevo],
    [courts.nuevoSur, amenities.vestuarios],
    [courts.municipal, amenities.iluminacion],
    [courts.municipal, amenities.tribuna],
  ].forEach((row) =>
    insert('INSERT INTO court_amenities (court_id, amenity_id) VALUES (?, ?)', row)
  )

  ;[
    [courts.losPinos, '18:00', 1],
    [courts.losPinos, '19:00', 2],
    [courts.losPinos, '21:00', 3],
    [courts.losPinos, '22:00', 4],
    [courts.losPinos, '23:00', 5],
    [courts.losPinos, '00:00', 6],
    [courts.estadio, '20:00', 1],
    [courts.estadio, '22:00', 2],
    [courts.estadio, '23:00', 3],
    [courts.nuevoSur, '09:00', 1],
    [courts.nuevoSur, '11:00', 2],
    [courts.nuevoSur, '14:00', 3],
    [courts.nuevoSur, '16:00', 4],
    [courts.nuevoSur, '18:00', 5],
    [courts.nuevoSur, '20:00', 6],
    [courts.nuevoSur, '22:00', 7],
    [courts.nuevoSur, '23:00', 8],
  ].forEach(([courtId, label, position]) =>
    insert('INSERT INTO court_slots (id, court_id, label, position) VALUES (?, ?, ?, ?)', [
      createId('slot'),
      courtId as string,
      label as string,
      position as number,
    ])
  )

  insert('INSERT INTO favorites (user_id, court_id) VALUES (?, ?)', [
    santiagoId,
    courts.losPinos,
  ])
  insert('INSERT INTO favorites (user_id, court_id) VALUES (?, ?)', [
    santiagoId,
    courts.nuevoSur,
  ])

  insert(
    'INSERT INTO reservations (id, user_id, court_id, starts_at, ends_at, status) VALUES (?, ?, ?, ?, ?, ?)',
    [
      createId('reservation'),
      santiagoId,
      courts.losPinos,
      dateAt(0, 20),
      dateAt(0, 22),
      'CONFIRMED',
    ]
  )
  insert(
    'INSERT INTO reservations (id, user_id, court_id, starts_at, ends_at, status) VALUES (?, ?, ?, ?, ?, ?)',
    [
      createId('reservation'),
      santiagoId,
      courts.estadio,
      dateAt(5, 10),
      dateAt(5, 12),
      'PENDING',
    ]
  )
  insert(
    'INSERT INTO reservations (id, user_id, court_id, starts_at, ends_at, status) VALUES (?, ?, ?, ?, ?, ?)',
    [
      createId('reservation'),
      matiasId,
      courts.estadio,
      dateAt(0, 10),
      dateAt(0, 12),
      'CONFIRMED',
    ]
  )

  insert(
    'INSERT INTO promotions (id, venue_id, title, subtitle, cta_label, is_active) VALUES (?, ?, ?, ?, ?, ?)',
    [
      createId('promotion'),
      venues.nuevoSur,
      'Complejo Nuevo Sur — Inauguración',
      '50% de descuento en tu primera reserva · Solo esta semana',
      'Ver oferta',
      1,
    ]
  )
}

function initializeDatabase(db: DatabaseSync) {
  db.exec(schemaSql)
  const count = db.prepare('SELECT COUNT(*) as count FROM courts').get() as {
    count: number
  }

  if (count.count === 0) {
    seedDatabase(db)
  }
}

export function getDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true })
  }

  if (!globalForDb.golfieldDb) {
    const db = new DatabaseSync(DB_PATH)
    initializeDatabase(db)
    globalForDb.golfieldDb = db
  }

  return globalForDb.golfieldDb
}

export function resetDb() {
  if (fs.existsSync(DB_PATH)) {
    fs.rmSync(DB_PATH)
  }
  globalForDb.golfieldDb = undefined
  return getDb()
}
