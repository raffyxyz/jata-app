PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id         TEXT PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

INSERT OR IGNORE INTO users (id, email) VALUES ('default', 'default@email.com');

CREATE TABLE IF NOT EXISTS resumes (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL,
  name        TEXT,
  file_url    TEXT,
  parsed_text TEXT,
  created_at  TEXT NOT NULL DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);

CREATE TABLE IF NOT EXISTS applications (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL DEFAULT 'default',
  company       TEXT NOT NULL,
  position      TEXT NOT NULL,
  job_url       TEXT,
  location      TEXT,
  salary        TEXT,
  notes         TEXT,
  status        TEXT NOT NULL DEFAULT 'saved'
                  CHECK (status IN ('saved','applied','interview','offer','rejected','withdrawn')),
  applied_date  TEXT,
  created_at    TEXT NOT NULL DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status  ON applications(status);

CREATE TABLE IF NOT EXISTS ats_results (
  id               TEXT PRIMARY KEY,
  application_id   TEXT NOT NULL,
  overall_score    INTEGER CHECK (overall_score BETWEEN 0 AND 100),
  subscores        TEXT,
  matched_keywords TEXT,
  missing_keywords TEXT,
  weak_sections    TEXT,
  parsed_jd        TEXT,
  summary          TEXT,
  created_at       TEXT NOT NULL DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ats_results_application_id ON ats_results(application_id);

CREATE TABLE IF NOT EXISTS generated_documents (
  id             TEXT PRIMARY KEY,
  application_id TEXT NOT NULL,
  type           TEXT NOT NULL
                   CHECK (type IN ('cover_letter','cold_email','linkedin_dm','proposal')),
  content        TEXT,
  created_at     TEXT NOT NULL DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_generated_documents_application_id ON generated_documents(application_id);
