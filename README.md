# LLM Text Redaction and Management Tool

This project provides a web-based interface, which adds to diff2html, managing and redacting text files, with features for comparing original and modified versions, selective redaction, and file management.


## Files and Structure

- `new/`: Folder containing redacted text files
- `original/`: Folder containing original, unredacted text files
- `README.md`: This file, providing an overview of the project
- `additional_script.js`: Additional JavaScript and HTML for enhanced UI functionality, which adds on to diff2html
- `example_result_01.html`: An example of the resulting HTML output
- `server.py`: Python server script to handle backend operations

## Features

- Side-by-side diff view of original and redacted text(from diff2html)
- Selective redaction with checkboxes
- File selection dropdown for each diff view
- Individual and bulk download options
- Full text display modal
- Copy to clipboard and download functionality
- Server-side file saving

## Setup and Running

1. Ensure you have Python installed on your system and the required dependencies in `requirements.txt`.
2. Run the server: `python server.py`
3. Use diff2html to generate the initial side-by-side changes in an HTML file
4. Add the `additional_script.js` as a script in the header or the footer of the HTML file(example shown in `example_result_01.html`
5. Open the HTML file in a web browser.

[Video demonstration of setup and running process](https://drive.google.com/file/d/1dQJaYsHggKmM0g51afdH6U33hunB7YlP/view?usp=sharing)

## Usage

1. The main interface displays diff views of original and redacted text files.
2. Use the checkboxes next to deleted text to toggle redaction.
3. Select options from the dropdown for each file to apply specific actions.
4. Use the "Save" button to download individual file changes.
5. Click "Display Full Text" to view the complete redacted text in a modal.
6. Use "Save All" to process and save all files at once to the web server in a uploads folder.


## Server Functionality

The `server.py` script handles:

- Saving individual and multiple files
- File downloads
- Management of original and redacted text versions
