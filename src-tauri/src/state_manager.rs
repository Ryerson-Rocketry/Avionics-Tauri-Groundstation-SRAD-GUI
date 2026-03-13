use serde::{Serialize, Deserialize};
use std::fs;
use std::fs::File;
use std::io::{BufRead, BufReader, Write};
use std::net::{IpAddr, Ipv4Addr, SocketAddr, TcpListener};
use std::path::PathBuf;
use tauri::{AppHandle, Manager};
use serde_json::json;
use local_ip_address::local_ip;

fn sanitize_save_dir_name(name: &str) -> String {
    name.chars()
        .map(|c| if c.is_alphanumeric() || c == '_' || c == '-' { c } else { '_' })
        .collect::<String>()
        .trim_matches('_')
        .to_string()
        .to_lowercase()
}

fn csv_escape(s: &str) -> String {
    s.replace('"', "\"\"")
}

#[derive(Serialize, Deserialize, Debug)]
pub struct AppSettings {
    pub theme: String,
    pub schemas_path: PathBuf,
    pub saves_path: PathBuf,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct MissionSave {
    pub id: usize,
    pub name: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct StartupData {
    pub settings: AppSettings,
    pub available_saves: Vec<MissionSave>,
}

#[tauri::command]
pub fn initialize_app(handle: AppHandle) -> Result<StartupData, String> {
    // In Tauri v2, we use .path().app_data_dir()
    let app_dir = handle.path().app_data_dir()
        .map_err(|_| "Could not find system AppData directory".to_string())?;
    
    // The rest of your code remains the same...
    let settings_path = app_dir.join("settings.json");
    let saves_dir = app_dir.join("saves");
    let schemas_dir = app_dir.join("schemas");

    // Ensure folders exist
    fs::create_dir_all(&saves_dir).map_err(|e| e.to_string())?;
    fs::create_dir_all(&schemas_dir).map_err(|e| e.to_string())?;

    // Default settings if file doesn't exist
    let settings = if settings_path.exists() {
        let content = fs::read_to_string(&settings_path).map_err(|e| e.to_string())?;
        serde_json::from_str(&content).map_err(|e| e.to_string())?
    } else {
        let default = AppSettings {
            theme: "dark".into(),
            schemas_path: schemas_dir.clone(),
            saves_path: saves_dir.clone(),
        };
        fs::write(&settings_path, serde_json::to_string(&default).unwrap()).unwrap();
        default
    };

    // Scan for saves
    let mut available_saves = Vec::new();
    if let Ok(entries) = fs::read_dir(&saves_dir) {
        for (index, entry) in entries.flatten().enumerate() {
            if entry.path().is_dir() {
                available_saves.push(MissionSave {
                    id: index,
                    name: entry.file_name().to_string_lossy().into(),
                });
            }
        }
    }

    Ok(StartupData { settings, available_saves })
}

#[tauri::command]
pub fn save_schema(handle: tauri::AppHandle, schema: serde_json::Value) -> Result<(), String> {
    let app_dir = handle.path().app_data_dir().unwrap();
    let schemas_dir = app_dir.join("schemas");
    fs::create_dir_all(&schemas_dir).map_err(|e| e.to_string())?;

    // Use the mission name as the filename (sanitized)
    let name = schema["mission_metadata"]["name"].as_str().unwrap_or("unnamed_schema");
    let filename = format!("{}.json", name.to_lowercase().replace(" ", "_"));
    let path = schemas_dir.join(filename);

    let json = serde_json::to_string_pretty(&schema).map_err(|e| e.to_string())?;
    fs::write(path, json).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn load_schemas(handle: tauri::AppHandle) -> Result<Vec<serde_json::Value>, String> {
    let app_dir = handle.path().app_data_dir().unwrap();
    let schemas_dir = app_dir.join("schemas");
    
    let mut results = Vec::new();
    if let Ok(entries) = fs::read_dir(schemas_dir) {
        for entry in entries.flatten() {
            let content = fs::read_to_string(entry.path()).map_err(|e| e.to_string())?;
            let mut json: serde_json::Value = serde_json::from_str(&content).map_err(|e| e.to_string())?;
            
            // Add the filename as a temporary ID for React tracking
            if let Some(obj) = json.as_object_mut() {
                obj.insert("id".to_string(), serde_json::Value::String(entry.file_name().to_string_lossy().to_string()));
            }
            results.push(json);
        }
    }
    Ok(results)
}

#[tauri::command]
pub fn delete_schema(handle: tauri::AppHandle, id: String) -> Result<(), String> {
    let app_dir = handle.path().app_data_dir()
        .map_err(|_| "Could not find AppData directory".to_string())?;
    
    // The 'id' we passed from React is actually the filename (e.g., "my_mission.json")
    let file_path = app_dir.join("schemas").join(&id);

    if file_path.exists() {
        std::fs::remove_file(file_path).map_err(|e| e.to_string())?;
        Ok(())
    } else {
        Err("File not found on disk".into())
    }
}

#[tauri::command]
pub fn save_settings(handle: tauri::AppHandle, new_settings: serde_json::Value) -> Result<(), String> {
    let app_dir = handle.path().app_data_dir().map_err(|e| e.to_string())?;
    let settings_path = app_dir.join("settings.json"); // or .txt if you prefer

    // Convert the JSON to a pretty-printed string
    let content = serde_json::to_string_pretty(&new_settings).map_err(|e| e.to_string())?;
    
    // Write to disk
    std::fs::write(settings_path, content).map_err(|e| e.to_string())?;
    
    println!("System configuration synchronized to disk.");
    Ok(())
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SaveMeta {
    pub mission_name: String,
    pub schema_file: String,
    pub started_at: String,
    pub ended_at: Option<String>,
    pub part_count: Option<u32>,
    pub total_rows: Option<u64>,
}

#[tauri::command]
pub fn create_mission_save(
    handle: AppHandle,
    mission_name: String,
    schema: serde_json::Value,
) -> Result<String, String> {
    let app_dir = handle.path().app_data_dir().map_err(|e| e.to_string())?;
    let saves_dir = app_dir.join("saves");
    fs::create_dir_all(&saves_dir).map_err(|e| e.to_string())?;

    let save_dir_name = if sanitize_save_dir_name(&mission_name).is_empty() {
        "unnamed_mission".to_string()
    } else {
        sanitize_save_dir_name(&mission_name)
    };
    let save_path = saves_dir.join(&save_dir_name);
    if save_path.exists() {
        return Err("A save with this mission name already exists. Choose a different mission name.".to_string());
    }
    fs::create_dir_all(&save_path).map_err(|e| e.to_string())?;

    let started_at = chrono::Utc::now().to_rfc3339();
    let save_meta = SaveMeta {
        mission_name: mission_name.clone(),
        schema_file: "schema.json".to_string(),
        started_at: started_at.clone(),
        ended_at: None,
        part_count: Some(0),
        total_rows: None,
    };
    let save_json = serde_json::to_string_pretty(&save_meta).map_err(|e| e.to_string())?;
    fs::write(save_path.join("save.json"), save_json).map_err(|e| e.to_string())?;

    let schema_json = serde_json::to_string_pretty(&schema).map_err(|e| e.to_string())?;
    fs::write(save_path.join("schema.json"), schema_json).map_err(|e| e.to_string())?;

    Ok(save_dir_name)
}

#[tauri::command]
pub fn append_telemetry_chunk(
    handle: AppHandle,
    save_dir_name: String,
    rows: Vec<(String, String)>,
) -> Result<(), String> {
    if rows.is_empty() {
        return Ok(());
    }
    let app_dir = handle.path().app_data_dir().map_err(|e| e.to_string())?;
    let save_path = app_dir.join("saves").join(&save_dir_name);
    if !save_path.exists() {
        return Err("Save folder not found".to_string());
    }

    let mut part_num = 0u32;
    if let Ok(entries) = fs::read_dir(&save_path) {
        for entry in entries.flatten() {
            let name = entry.file_name().to_string_lossy().to_string();
            if name.starts_with("telemetry_part_") && name.ends_with(".csv") {
                if let Some(n) = name.strip_prefix("telemetry_part_").and_then(|s| s.strip_suffix(".csv")) {
                    if let Ok(n) = n.parse::<u32>() {
                        part_num = part_num.max(n + 1);
                    }
                }
            }
        }
    }
    if part_num == 0 {
        part_num = 1;
    }

    let part_path = save_path.join(format!("telemetry_part_{:03}.csv", part_num));
    let mut f = File::create(&part_path).map_err(|e| e.to_string())?;
    writeln!(f, "tminus,raw_json").map_err(|e| e.to_string())?;
    for (tminus, raw_json) in &rows {
        let escaped = csv_escape(raw_json);
        writeln!(f, "{},\"{}\"", tminus, escaped).map_err(|e| e.to_string())?;
    }
    f.sync_all().map_err(|e| e.to_string())?;

    if let Ok(content) = fs::read_to_string(save_path.join("save.json")) {
        if let Ok(mut meta) = serde_json::from_str::<SaveMeta>(&content) {
            meta.part_count = Some(part_num);
            let _ = fs::write(
                save_path.join("save.json"),
                serde_json::to_string_pretty(&meta).unwrap_or_default(),
            );
        }
    }
    Ok(())
}

#[tauri::command]
pub fn finalize_mission_save(handle: AppHandle, save_dir_name: String) -> Result<u64, String> {
    let app_dir = handle.path().app_data_dir().map_err(|e| e.to_string())?;
    let save_path = app_dir.join("saves").join(&save_dir_name);
    if !save_path.exists() {
        return Err("Save folder not found".to_string());
    }

    let mut part_files: Vec<(u32, PathBuf)> = Vec::new();
    if let Ok(entries) = fs::read_dir(&save_path) {
        for entry in entries.flatten() {
            let path = entry.path();
            let name = path.file_name().and_then(|n| n.to_str()).unwrap_or("");
            if name.starts_with("telemetry_part_") && name.ends_with(".csv") {
                if let Some(n) = name.strip_prefix("telemetry_part_").and_then(|s| s.strip_suffix(".csv")) {
                    if let Ok(n) = n.parse::<u32>() {
                        part_files.push((n, path));
                    }
                }
            }
        }
    }
    part_files.sort_by_key(|(n, _)| *n);

    let merged_path = save_path.join("telemetry.csv");
    let mut out = File::create(&merged_path).map_err(|e| e.to_string())?;
    writeln!(out, "tminus,raw_json").map_err(|e| e.to_string())?;
    let mut total_rows: u64 = 0;
    for (_, path) in part_files {
        let f = File::open(&path).map_err(|e| e.to_string())?;
        let reader = BufReader::new(f);
        let mut lines = reader.lines();
        let _ = lines.next();
        while let Some(Ok(line)) = lines.next() {
            if !line.is_empty() {
                writeln!(out, "{}", line).map_err(|e| e.to_string())?;
                total_rows += 1;
            }
        }
        let _ = fs::remove_file(path);
    }
    out.sync_all().map_err(|e| e.to_string())?;

    let ended_at = chrono::Utc::now().to_rfc3339();
    if let Ok(content) = fs::read_to_string(save_path.join("save.json")) {
        if let Ok(mut meta) = serde_json::from_str::<SaveMeta>(&content) {
            meta.ended_at = Some(ended_at);
            meta.part_count = Some(0);
            meta.total_rows = Some(total_rows);
            fs::write(
                save_path.join("save.json"),
                serde_json::to_string_pretty(&meta).map_err(|e| e.to_string())?,
            ).map_err(|e| e.to_string())?;
        }
    }
    Ok(total_rows)
}

#[tauri::command]
pub fn load_mission_save(handle: AppHandle, save_dir_name: String) -> Result<serde_json::Value, String> {
    let app_dir = handle.path().app_data_dir().map_err(|e| e.to_string())?;
    let save_path = app_dir.join("saves").join(&save_dir_name);
    if !save_path.exists() {
        return Err("Save folder not found".to_string());
    }
    let save_meta_str = fs::read_to_string(save_path.join("save.json")).map_err(|e| e.to_string())?;
    let save_meta: SaveMeta = serde_json::from_str(&save_meta_str).map_err(|e| e.to_string())?;
    let schema_str = fs::read_to_string(save_path.join("schema.json")).map_err(|e| e.to_string())?;
    let schema: serde_json::Value = serde_json::from_str(&schema_str).map_err(|e| e.to_string())?;

    let csv_path = save_path.join("telemetry.csv");
    let mut rows: Vec<serde_json::Value> = Vec::new();
    if csv_path.exists() {
        let f = File::open(&csv_path).map_err(|e| e.to_string())?;
        let reader = BufReader::new(f);
        let mut lines = reader.lines();
        let _ = lines.next();
        while let Some(Ok(line)) = lines.next() {
            if line.is_empty() {
                continue;
            }
            let first_comma = line.find(',').unwrap_or(0);
            let tminus = line[..first_comma].trim().to_string();
            let rest = line[first_comma + 1..].trim();
            let raw_json = if rest.starts_with('"') && rest.ends_with('"') {
                rest[1..rest.len() - 1].replace("\"\"", "\"")
            } else {
                rest.to_string()
            };
            rows.push(serde_json::json!({ "tminus": tminus, "raw_json": raw_json }));
        }
    } else {
        let mut part_files: Vec<(u32, PathBuf)> = Vec::new();
        if let Ok(entries) = fs::read_dir(&save_path) {
            for entry in entries.flatten() {
                let path = entry.path();
                let name = path.file_name().and_then(|n| n.to_str()).unwrap_or("");
                if name.starts_with("telemetry_part_") && name.ends_with(".csv") {
                    if let Some(n) = name.strip_prefix("telemetry_part_").and_then(|s| s.strip_suffix(".csv")) {
                        if let Ok(n) = n.parse::<u32>() {
                            part_files.push((n, path));
                        }
                    }
                }
            }
        }
        part_files.sort_by_key(|(n, _)| *n);
        for (_, path) in part_files {
            let f = File::open(&path).map_err(|e| e.to_string())?;
            let reader = BufReader::new(f);
            let mut lines = reader.lines();
            let _ = lines.next();
            while let Some(Ok(line)) = lines.next() {
                if line.is_empty() {
                    continue;
                }
                let first_comma = line.find(',').unwrap_or(0);
                let tminus = line[..first_comma].trim().to_string();
                let rest = line[first_comma + 1..].trim();
                let raw_json = if rest.starts_with('"') && rest.ends_with('"') {
                    rest[1..rest.len() - 1].replace("\"\"", "\"")
                } else {
                    rest.to_string()
                };
                rows.push(serde_json::json!({ "tminus": tminus, "raw_json": raw_json }));
            }
        }
    }

    Ok(serde_json::json!({
        "save_meta": save_meta,
        "schema": schema,
        "rows": rows
    }))
}

#[tauri::command]
pub fn delete_mission_save(handle: AppHandle, save_dir_name: String) -> Result<(), String> {
    let app_dir = handle.path().app_data_dir().map_err(|e| e.to_string())?;
    let save_path = app_dir.join("saves").join(&save_dir_name);
    if !save_path.exists() {
        return Err("Save folder not found".to_string());
    }
    fs::remove_dir_all(&save_path).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn start_mission_socket(
    _handle: tauri::AppHandle,
    missionName: String,
    schemaId: String,
    saveData: bool,
    notes: String,
) -> Result<serde_json::Value, String> {
    println!(
        "[start_mission_socket] Starting mission (stub): name='{}', schema='{}', save_data={}, notes_len={}",
        missionName,
        schemaId,
        saveData,
        notes.len()
    );

    // Try to detect the primary local IP; fall back to localhost.
    let ip_addr: IpAddr = match local_ip() {
        Ok(addr) => addr,
        Err(err) => {
            eprintln!("[start_mission_socket] Failed to determine local IP: {}. Falling back to 127.0.0.1", err);
            IpAddr::V4(Ipv4Addr::new(127, 0, 0, 1))
        }
    };

    // Bind to an available ephemeral port on that IP.
    let socket = SocketAddr::new(ip_addr, 0);
    let listener = TcpListener::bind(socket).map_err(|e| {
        eprintln!("[start_mission_socket] Failed to bind listener on {}: {}", socket, e);
        format!("Failed to bind mission socket: {}", e)
    })?;

    let addr = listener.local_addr().map_err(|e| {
        eprintln!("[start_mission_socket] Failed to read local_addr: {}", e);
        format!("Failed to read mission socket address: {}", e)
    })?;

    let ip = addr.ip().to_string();
    let port = addr.port();

    // Keep the listener alive in a background thread for now.
    std::thread::spawn(move || {
        for stream in listener.incoming() {
            match stream {
                Ok(_s) => {
                    // TODO: upgrade this to a real telemetry/WebSocket handler.
                }
                Err(err) => {
                    eprintln!("[start_mission_socket] Mission socket error: {}", err);
                    break;
                }
            }
        }
    });

    println!(
        "[start_mission_socket] Returning connection endpoint {}:{}",
        ip, port
    );

    Ok(json!({
        "ip": ip,
        "port": port,
    }))
}