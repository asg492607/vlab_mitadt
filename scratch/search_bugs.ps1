$brainDir = "C:\Users\Atharva\.gemini\antigravity\brain"
$files = Get-ChildItem -Path $brainDir -Recurse -File -ErrorAction SilentlyContinue

Write-Host "Searching $($files.Count) files for 'BUG-3'..."

foreach ($file in $files) {
    if ($file.Extension -in ".md", ".txt", ".json", ".jsonl", ".js") {
        $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
        if ($content.Contains("BUG-3")) {
            Write-Host "Found BUG-3 in: $($file.FullName) (Size: $($file.Length))"
        }
    }
}
