// Prevents additional console window on Windows in release, do not remove.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::{Arc, Mutex};
use tauri_plugin_shell::ShellExt;
use tauri_plugin_shell::process::{CommandChild, CommandEvent};
use tauri::Emitter;
use tauri::{Builder, Manager};

use tauri::{AppHandle};

// Import your new module
mod state_manager;

//const sidecar_command = app.shell().sidecar("webserver").unwrap();
//const (mut rx, mut child) = sidecar_command
//  .spawn()
//  .expect("Failed to spawn sidecar");

fn sidecar_handle(app: tauri::AppHandle) {
    println!("Initializiting Sidecar");
    let sidecar_command = app.shell().sidecar("webserver_proc").unwrap();
    let (mut _rx, sidecar_child) = sidecar_command
        .spawn()
        .expect("Failed to spawn sidecar");

    // Wrap the child process in Arc<Mutex<>> for shared access
    let child = Arc::new(Mutex::new(Some(sidecar_child)));

    // Clone the Arc to move into the async task
    let child_clone = Arc::clone(&child);


    let window = app.get_webview_window("main").unwrap();

    window.on_window_event( move |event| {
        if let tauri::WindowEvent::CloseRequested { .. } = event {

        let mut child_lock = child_clone.lock().unwrap();
        if let Some(mut child_process) = child_lock.take() {
            if let Err(e) = child_process.write("Exit message from Rust".as_bytes())
            {
            println!("Fail to send to stdin of Python: {}", e);
            }

            if let Err(e) = child_process.kill() {
                eprintln!("Failed to kill child process: {}", e);
            }
        }
        }
    });

    tauri::async_runtime::spawn(async move {
        // read events such as stdout
        while let Some(event) = _rx.recv().await {
            if let CommandEvent::Stdout(line_bytes) = event {
            let line = String::from_utf8_lossy(&line_bytes);
            app
                .emit("stdout", Some(format!("'{}'", line)))
                .expect("failed to emit event");
            println!("stdOut: {}", line);
            }
        }
    });
}


fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_handle = app.handle().clone();
            if cfg!(dev) {
                // `tauri dev` only code
                println!("IN DEV MODE, REMEMBER TO LAUNCH MANUALLY PYTHON WEBSERVER");
                //sidecar_handle(app_handle);

            } else {
                // `tauri build` only code
                sidecar_handle(app_handle);
            }
            /*
            let sidecar_command = app.shell().sidecar("webserver_proc").unwrap();
            let ( _rx, sidecar_child) = sidecar_command
                .spawn()
                .expect("Failed to spawn sidecar");

            // Wrap the child process in Arc<Mutex<>> for shared access
            let child = Arc::new(Mutex::new(Some(sidecar_child)));

            // Clone the Arc to move into the async task
            let child_clone = Arc::clone(&child);


            let window = app.get_webview_window("main").unwrap();

            window.on_window_event( move |event| {
                if let tauri::WindowEvent::CloseRequested { .. } = event {

                let mut child_lock = child_clone.lock().unwrap();
                if let Some(mut child_process) = child_lock.take() {
                    if let Err(e) = child_process.write("Exit message from Rust".as_bytes())
                    {
                    println!("Fail to send to stdin of Python: {}", e);
                    }

                    if let Err(e) = child_process.kill() {
                        eprintln!("Failed to kill child process: {}", e);
                    }
                }
                }
            });
            */

            Ok(())

        })
        .plugin(tauri_plugin_shell::init())
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
