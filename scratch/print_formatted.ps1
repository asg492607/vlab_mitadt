$scratchDir = "C:\Users\Atharva\.gemini\antigravity\brain\de07a3b0-c2e3-4687-bc41-39d9784c7bca\scratch"
$files = Get-ChildItem -Path $scratchDir -Filter formatted_line_* | Sort-Object { [int]($_.BaseName -replace 'formatted_line_','') }
foreach ($file in $files) {
    Write-Host "=== $($file.Name) ==="
    Get-Content $file.FullName
    Write-Host ""
}
