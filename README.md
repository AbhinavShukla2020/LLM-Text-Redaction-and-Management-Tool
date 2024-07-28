# Text Redaction and Management Tool

This project provides a web-based interface for managing and redacting text files, with features for comparing original and modified versions, selective redaction, and file management.

## Files and Structure

- `new/`: Folder containing redacted text files
- `original/`: Folder containing original, unredacted text files
- `README.md`: This file, providing an overview of the project
- `additional_script.html`: Additional JavaScript and HTML for enhanced UI functionality
- `example_result_01.html`: An example of the resulting HTML output
- `server.py`: Python server script to handle backend operations

## Features

- Side-by-side diff view of original and redacted text
- Selective redaction with checkboxes
- File selection dropdown for each diff view
- Individual and bulk save options
- Full text display modal
- Copy to clipboard and download functionality
- Server-side file saving and management

## Setup and Running

1. Ensure you have Python installed on your system.
2. Install the required Python packages (details to be added).
3. Run the server: python server.py
4. Open the main HTML file in a web browser.

## Usage

1. The main interface displays diff views of original and redacted text files.
2. Use the checkboxes next to deleted text to toggle redaction.
3. Select options from the dropdown for each file to apply specific actions.
4. Use the "Save" button to save individual file changes.
5. Click "Display Full Text" to view the complete redacted text in a modal.
6. Use "Save All" to process and save all files at once.

## Additional Scripts

The `additional_script.html` file contains extra JavaScript and CSS that enhance the functionality of the base interface. It adds:

- Modal for displaying full text
- Copy to clipboard and download buttons
- "Save All" functionality
- Improved styling for buttons and dropdowns

## Server Functionality

The `server.py` script handles:

- Saving individual and multiple files
- File downloads
- Management of original and redacted text versions
