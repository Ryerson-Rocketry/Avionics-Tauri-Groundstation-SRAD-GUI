

# Overview

Subprocess for managing data source input for the main GUI. Supports two states, "Demo": which simulates a rocket using pre supplied csv file; and "Live": which makes an attempt to connect to a radio to provide actual data to GUI.


# Communication



# Process

- For Production: Process is packaged into a standalone binary and launched as a "sidecar" for the Tauri application automatically with no user inputs
- For Development: should be launched independently before any interactions with GUI