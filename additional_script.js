<!--
    START OF ADDITIONAL SCRIPTS
-->

    <!-- CSS Styles for the modal and buttons -->
    <style>
        /* Modal overlay */
        .modal {
            display: none; 
            position: fixed; 
            z-index: 1; 
            left: 0;
            top: 0;
            width: 100%; 
            height: 100%; 
            overflow: auto; 
            background-color: rgba(0,0,0,0.4); 
        }

        /* Modal content */
        .modal-content {
            background-color: #fefefe;
            margin: 15% auto; 
            padding: 20px;
            border: 1px solid #888;
            width: 80%; 
            max-height: 80%;
            overflow-y: auto;
            word-wrap: break-word;
            white-space: normal;
            display: flex;
            flex-direction: column;
            position: relative;
        }

        /* Close button */
        .close {
            color: #aaa;
            position: absolute;
            top: 10px;
            right: 20px;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }

        .close:hover,
        .close:focus {
            color: black;
            text-decoration: none;
        }

        /* Changes list styling */
        #changesList {
            white-space: pre-wrap;
            font-family: monospace;
            line-height: 1.5;
            word-wrap: break-word;
            flex-grow: 1;
            overflow-y: auto;
            margin-top: 20px;
        }

        #changesList pre {
            white-space: pre-wrap;
            word-wrap: break-word;
            overflow-wrap: break-word;
            max-width: 100%;
        }

        /* Button container */
        .button-container {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 10px;
        }

        /* Button styling */
        .button-container button {
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
        }

        .button-container button:hover {
            background-color: #45a049;
        }

        /* New styles for button group */
        .button-group {
            display: flex;
            gap: 10px;
            margin-top: 10px;
        }

        .submit-btn {
            padding: 5px 10px;
            cursor: pointer;
        }

        /* New style for the Save All button container */
        #saveAllContainer {
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }

        #saveAllButton {
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 16px;
        }

        #saveAllButton:hover {
            background-color: #45a049;
        }
    </style>

    <!-- Modal HTML structure -->
    <div id="changesModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Changes</h2>
            <div id="changesList"></div>
            <div class="button-container">
                <button id="copyButton">Copy to Clipboard</button>
                <button id="downloadButton">Download Text</button>
            </div>
        </div>
    </div>

    <!-- Add this new div for the Save All button after your existing content -->
    <div id="saveAllContainer">
        <button id="saveAllButton">Save All</button>
    </div>

    <script>
    $(document).ready(function() {
        // Create and initialize Select2 dropdown for each file wrapper
        $('.d2h-file-wrapper').each(function() {
            var select = $('<select></select>', { class: 'file-select', multiple: 'multiple' })
                .append('<option value="1">1. Value 1</option>')
                .append('<option value="2">2. Value 2</option>')
                .append('<option value="3">3. Value 3</option>');
            $(this).append(select);

            select.select2({ width: '400px' });

            // Create a container for buttons
            var buttonGroup = $('<div></div>', { class: 'button-group' });

            // Create and append a submit button for each select
            var submitButton = $('<button type="button">Save</button>', { class: 'submit-btn' });
            buttonGroup.append(submitButton);

            // Create "Display Full Text" button
            var displayFullTextButton = $('<button type="button">Display Full Text</button>', { class: 'submit-btn' });
            buttonGroup.append(displayFullTextButton);

            // Append the button group after the select
            select.after(buttonGroup);

            // Modify the submit button click handler
            submitButton.click(function() {
                var fileWrapper = $(this).closest('.d2h-file-wrapper');
                var fullText = '';
                fileWrapper.find('.d2h-ins').find('span.d2h-code-line-ctn').each(function() {
                    var lineElement = $(this).clone();
                    lineElement.find('input.insert-checkbox').remove();

                    lineElement.html(lineElement.html().replace(/<del>.*?<\/del>/g, function(match) {
                        var index = delTexts.indexOf(match.replace(/<\/?del>/g, ''));
                        return currentTexts[index];
                    }));

                    lineElement.find('ins').each(function() {
                        $(this).replaceWith($(this).text());
                    });

                    fullText += lineElement.text().trim() + '\n';
                });

                // Send text to server
                $.ajax({
                    url: 'http://localhost:5000/save',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ text: fullText }),
                    success: function(response) {
                        alert('Text saved successfully. Filename: ' + response.filename);
                        // Trigger download
                        window.location.href = 'http://localhost:5000/download/' + response.filename;
                    },
                    error: function(xhr, status, error) {
                        alert('Failed to save text: ' + error);
                    }
                });
            });


            // Handle "Display Full Text" button click
            displayFullTextButton.click(function() {
                var fileWrapper = $(this).closest('.d2h-file-wrapper');
                var diffTable = fileWrapper.find('.d2h-diff-table');
                var fullText = '';

                diffTable.find('tr').find('.d2h-ins').each(function(index) {
                    var $row = $(this);
                    var $contentCell = $row.find('.d2h-code-line-ctn');
                    
                    if ($contentCell.length > 0) {
                        var lineContent = $contentCell.clone();
                        
                        // Remove checkboxes
                        lineContent.find('input.insert-checkbox').remove();
                        
                        // Replace deleted text with current text (which should be redacted)
                        lineContent.html(lineContent.html().replace(/<del>.*?<\/del>/g, function(match) {
                            var index = delTexts.indexOf(match.replace(/<\/?del>/g, ''));
                            return currentTexts[index];
                        }));
                        
                        // Remove ins tags
                        lineContent.find('ins').each(function() {
                            $(this).replaceWith($(this).text());
                        });
                        
                        fullText += lineContent.text().trim() + '\n';
                    } else {
                        fullText += '\n';
                    }
                });

                // console.log("Full text:", fullText);

                $('#changesList').html(`<pre>${fullText}</pre>`);
                $('#changesModal').show();
            })

        });

        // Initialize arrays for storing text content
        var insTexts = [];
        var delTexts = [];
        var currentTexts = [];

        // Process inserted text
        $('span.d2h-code-line-ctn ins').each(function() {
            insTexts.push($(this));
            currentTexts.push('[REDACTED]');
        });

        // Process deleted text and add checkboxes
        $('span.d2h-code-line-ctn del').each(function(index) {
            var checkbox = $('<input type="checkbox" class="insert-checkbox" />');
            $(this).after(checkbox);
            var delText = $(this).text();
            delTexts.push(delText);

            // Handle checkbox change
            checkbox.change(function() {
                if ($(this).is(':checked')) {
                    currentTexts[index] = delText;
                    $(insTexts[index]).text(delText);
                } else {
                    currentTexts[index] = '[REDACTED]';
                    $(insTexts[index]).text('[REDACTED]');
                }
            });
        });

        // Modal close functionality
        var modal = document.getElementById("changesModal");
        var span = document.getElementsByClassName("close")[0];

        span.onclick = function() {
            modal.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        // Copy to clipboard functionality
        $('#copyButton').click(function() {
            var textToCopy = $('#changesList pre').text();
            navigator.clipboard.writeText(textToCopy).then(function() {
                alert('Text copied to clipboard!');
            }, function(err) {
                console.error('Could not copy text: ', err);
            });
        });

        // Download text functionality
        $('#downloadButton').click(function() {
            var textToDownload = $('#changesList pre').text();
            var blob = new Blob([textToDownload], {type: "text/plain;charset=utf-8"});
            var url = URL.createObjectURL(blob);
            var link = document.createElement('a');
            link.href = url;
            link.download = "changes.txt";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });

        // Add click handler for the Save All button
        $('#saveAllButton').click(function() {
            saveAll();
        });

        // Method for "Save All" functionality
        function saveAll() {
            var allFiles = [];
            $('.d2h-file-wrapper').each(function(index) {
                var fileName = $(this).find('.d2h-file-name').text().trim();
                var fileContent = '';
                $(this).find('.d2h-ins').find('span.d2h-code-line-ctn').each(function() {
                    var lineElement = $(this).clone();
                    lineElement.find('input.insert-checkbox').remove();

                    lineElement.html(lineElement.html().replace(/<del>.*?<\/del>/g, function(match) {
                        var index = delTexts.indexOf(match.replace(/<\/?del>/g, ''));
                        return currentTexts[index];
                    }));

                    lineElement.find('ins').each(function() {
                        $(this).replaceWith($(this).text());
                    });

                    fileContent += lineElement.text().trim() + '\n';
                });

                allFiles.push({
                    name: fileName,
                    content: fileContent
                });
            });

            // Send all files to server
            $.ajax({
                url: 'http://localhost:5000/save_all',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(allFiles),
                success: function(response) {
                    alert('All files saved successfully. Files: ' + response.files.join(', '));
                    // You can add code here to download all files if needed
                },
                error: function(xhr, status, error) {
                    alert('Failed to save files: ' + error);
                }
            });
        }
    });
    </script>

<!--
    END OF ADDITIONAL SCRIPTS
-->
