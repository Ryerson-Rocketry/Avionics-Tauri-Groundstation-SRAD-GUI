// Prevents additional console window on Windows in release, do not remove.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Import your new module
mod state_manager;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            state_manager::initialize_app,
            state_manager::save_schema,
            state_manager::load_schemas,
            state_manager::delete_schema,
            state_manager::save_settings,
            state_manager::create_mission_save,
            state_manager::append_telemetry_chunk,
            state_manager::finalize_mission_save,
            state_manager::load_mission_save,
            state_manager::delete_mission_save,
            state_manager::start_mission_socket
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}