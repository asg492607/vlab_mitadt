$brainDir = "C:\Users\Atharva\.gemini\antigravity\brain"
$logFiles = Get-ChildItem -Path $brainDir -Filter transcript.jsonl -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Found $($logFiles.Count) transcript files. Searching for untruncated audit report..."

foreach ($file in $logFiles) {
    $path = $file.FullName
    # Read line by line to avoid memory issues with huge files
    $lineNum = 0
    $reader = [System.IO.File]::OpenText($path)
    try {
        while ($null -ne ($line = $reader.ReadLine())) {
            $lineNum++
            if ($line.Contains("Comprehensive Audit Report") -and $line.Contains("[BUG-1]") -and $line.Contains("[BUG-2]")) {
                Write-Host "Possible match in $path at line $lineNum"
                # Let's inspect the length and whether it contains literal "truncated" in the text
                # We can parse the JSON or search for the length of the line
                Write-Host "Line length: $($line.Length)"
                
                # Check if this line contains "truncated" keyword that isn't part of normal text
                # Try to extract the Message argument or content
                try {
                    $json = ConvertFrom-Json $line
                    $msg = $null
                    if ($json.tool_calls -and $json.tool_calls[0] -and $json.tool_calls[0].args -and $json.tool_calls[0].args.Message) {
                        $msg = $json.tool_calls[0].args.Message
                        Write-Host "Found in tool_calls Message arg. Length: $($msg.Length)"
                    } elseif ($json.content) {
                        $msg = $json.content
                        Write-Host "Found in content. Length: $($msg.Length)"
                    }
                    
                    if ($msg -ne $null) {
                        $hasTruncated = $msg.Contains("truncated")
                        Write-Host "Contains 'truncated' keyword: $hasTruncated"
                        # Save the message to a unique file
                        $filename = "extracted_report_" + $file.Parent.Parent.Name + "_" + $lineNum + ".md"
                        $dest = Join-Path "C:\Users\Atharva\OneDrive\Desktop\netforge-vlab\scratch" $filename
                        [System.IO.File]::WriteAllText($dest, $msg, [System.Text.Encoding]::UTF8)
                        Write-Host "Saved to $dest"
                    }
                } catch {
                    Write-Host "Failed to parse JSON: $_"
                }
            }
        }
    } finally {
        $reader.Close()
    }
}
