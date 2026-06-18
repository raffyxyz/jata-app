import Database from "@tauri-apps/plugin-sql";
import type { JobApplication, DashboardStats, ApplicationStatus, ResumeFile } from "./types";

let db: Database | null = null;

export async function initDb(): Promise<Database> {
  if (!db) {
    db = await Database.load("sqlite:jata.db");
    await fixSchema(db);
  }
  return db;
}

async function fixSchema(database: Database) {
  const rows = await database.select<{ name: string }[]>(
    "SELECT name FROM pragma_table_info('applications')"
  );
  const cols = rows.map((r) => r.name);

  if (!cols.includes("salary")) {
    try {
      await database.execute("ALTER TABLE applications ADD COLUMN salary TEXT");
    } catch { }
  }
  if (!cols.includes("notes")) {
    try {
      await database.execute("ALTER TABLE applications ADD COLUMN notes TEXT");
    } catch { }
  }
  if (!cols.includes("applied_date")) {
    try {
      await database.execute("ALTER TABLE applications ADD COLUMN applied_date TEXT");
    } catch { }
  }
  if (!cols.includes("location")) {
    if (cols.includes("job_location")) {
      try {
        await database.execute("ALTER TABLE applications RENAME COLUMN job_location TO location");
      } catch { }
    } else {
      try {
        await database.execute("ALTER TABLE applications ADD COLUMN location TEXT");
      } catch { }
    }
  }
  if (!cols.includes("position")) {
    if (cols.includes("job_title")) {
      try {
        await database.execute("ALTER TABLE applications RENAME COLUMN job_title TO position");
      } catch { }
    } else {
      try {
        await database.execute("ALTER TABLE applications ADD COLUMN position TEXT");
      } catch { }
    }
  }
}

function mapRow(row: Record<string, unknown>): JobApplication {
  return {
    id: row.id as string,
    company: row.company as string,
    position: row.position as string,
    status: row.status as ApplicationStatus,
    appliedDate: (row.applied_date || row.created_at || "") as string,
    location: (row.location || "") as string,
    salary: (row.salary as string) || undefined,
    notes: (row.notes as string) || undefined,
  };
}

export async function getApplications(): Promise<JobApplication[]> {
  const database = await initDb();
  const rows = await database.select<Record<string, unknown>[]>(
    "SELECT id, company, position, status, location, salary, notes, applied_date, created_at FROM applications ORDER BY created_at DESC"
  );
  return rows.map(mapRow);
}

export async function getStats(): Promise<DashboardStats> {
  const database = await initDb();
  const rows = await database.select<Record<string, unknown>[]>(
    "SELECT status, COUNT(*) as count FROM applications GROUP BY status"
  );
  const counts: Record<string, number> = {};
  let total = 0;
  for (const row of rows) {
    counts[row.status as string] = row.count as number;
    total += row.count as number;
  }
  const active = (counts["applied"] || 0) + (counts["interview"] || 0);
  return {
    totalApplications: total,
    activeApplications: active,
    interviews: counts["interview"] || 0,
    offers: counts["offer"] || 0,
    rejected: counts["rejected"] || 0,
  };
}

export async function saveApplication(data: {
  company: string;
  position: string;
  status: ApplicationStatus;
  location: string;
  salary?: string;
  notes?: string;
  jobUrl?: string;
}): Promise<string> {
  const database = await initDb();
  const id = crypto.randomUUID();
  const appliedDate = data.status === "saved" ? "" : new Date().toISOString().split("T")[0];
  await database.execute(
    `INSERT INTO applications (id, user_id, company, position, status, location, salary, notes, job_url, applied_date)
     VALUES ($1, 'default', $2, $3, $4, $5, $6, $7, $8, $9)`,
    [id, data.company, data.position, data.status, data.location, data.salary || null, data.notes || null, data.jobUrl || null, appliedDate]
  );
  return id;
}

export async function deleteApplication(id: string): Promise<void> {
  const database = await initDb();
  await database.execute("DELETE FROM applications WHERE id = $1", [id]);
}

function base64Size(b64: string): number {
  const comma = b64.indexOf(",");
  const raw = comma >= 0 ? b64.slice(comma + 1) : b64;
  const padding = raw.endsWith("==") ? 2 : raw.endsWith("=") ? 1 : 0;
  return Math.round((raw.length * 3) / 4 - padding);
}

export async function getResumes(): Promise<ResumeFile[]> {
  const database = await initDb();
  const rows = await database.select<Record<string, unknown>[]>(
    "SELECT id, name, parsed_text as data, file_url, file_path, created_at FROM resumes WHERE user_id = 'default' ORDER BY created_at DESC"
  );
  return rows.map((row) => {
    const data = (row.data || "") as string;
    const filePath = (row.file_path || "") as string;
    return {
      id: row.id as string,
      name: (row.name || "Untitled") as string,
      data,
      size: filePath ? 0 : (data ? base64Size(data) : 0),
      filePath,
      createdAt: (row.created_at || "") as string,
    };
  });
}

export async function saveResume(
  name: string,
  data: string,
  filePath?: string
): Promise<string> {
  const database = await initDb();
  const id = crypto.randomUUID();
  await database.execute(
    `INSERT INTO resumes (id, user_id, name, parsed_text, file_path)
     VALUES ($1, 'default', $2, $3, $4)`,
    [id, name, data, filePath || null]
  );
  return id;
}

export async function deleteResume(
  id: string
): Promise<{ filePath: string } | null> {
  const database = await initDb();
  const rows = await database.select<Record<string, unknown>[]>(
    "SELECT file_path FROM resumes WHERE id = $1",
    [id]
  );
  await database.execute("DELETE FROM resumes WHERE id = $1", [id]);
  if (rows.length > 0 && rows[0].file_path) {
    return { filePath: rows[0].file_path as string };
  }
  return null;
}
