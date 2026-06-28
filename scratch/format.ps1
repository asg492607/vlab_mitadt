$path = "C:\Users\Atharva\.gemini\antigravity\brain\de07a3b0-c2e3-4687-bc41-39d9784c7bca\scratch\full_audit_report.md"
if (Test-Path $path) {
    Write-Host "Reading $path"
    $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    Write-Host "Length: $($content.Length)"
    if ($content.Contains('\n')) {
        Write-Host "Replacing escaped characters..."
        $content = $content.Replace('\n', "`n").Replace('\t', "`t").Replace('\"', '"')
    }
    $outPath = "C:\Users\Atharva\.gemini\antigravity\brain\de07a3b0-c2e3-4687-bc41-39d9784c7bca\scratch\clean_report.md"
    [System.IO.File]::WriteAllText($outPath, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Wrote to $outPath"
} else {
    Write-Host "File not found"
}
