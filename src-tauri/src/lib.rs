use std::fs;
use tauri::Manager;
use tauri_plugin_sql::{Migration, MigrationKind};

#[tauri::command]
fn save_pdf(app: tauri::AppHandle, file_name: String, file_data: Vec<u8>) -> Result<String, String> {
    let app_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join("resumes");
    fs::create_dir_all(&app_dir).map_err(|e| e.to_string())?;
    let file_path = app_dir.join(&file_name);
    if file_path.exists() {
        let stamp = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap_or_default()
            .as_millis();
        let stem = file_name
            .rsplit_once('.')
            .map(|(n, _)| n)
            .unwrap_or(&file_name);
        let ext = file_name
            .rsplit_once('.')
            .map(|(_, e)| e)
            .unwrap_or("pdf");
        let file_path = app_dir.join(format!("{}_{}.{}", stem, stamp, ext));
        fs::write(&file_path, &file_data).map_err(|e| e.to_string())?;
        Ok(file_path.to_string_lossy().to_string())
    } else {
        fs::write(&file_path, &file_data).map_err(|e| e.to_string())?;
        Ok(file_path.to_string_lossy().to_string())
    }
}

#[tauri::command]
fn read_pdf(file_path: String) -> Result<Vec<u8>, String> {
    fs::read(&file_path).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_pdf_file(file_path: String) -> Result<(), String> {
    if let Ok(m) = fs::metadata(&file_path) {
        if m.is_file() {
            fs::remove_file(&file_path).map_err(|e| e.to_string())?;
        }
    }
    Ok(())
}

fn get_migrations() -> Vec<Migration> {
    vec![
        Migration {
            version: 1,
            description: "create initial tables",
            sql: include_str!("../migrations/001_initial.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "add application fields",
            sql: include_str!("../migrations/002_add_app_fields.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "add file path to resumes",
            sql: include_str!("../migrations/003_add_file_path.sql"),
            kind: MigrationKind::Up,
        },
    ]
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_upload::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:jata.db", get_migrations())
                .build(),
        )
        .invoke_handler(tauri::generate_handler![save_pdf, read_pdf, delete_pdf_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
