$data = Get-Content "C:\Users\Atharva\OneDrive\Desktop\netforge-vlab\vlabData.js"
$keys = @{}
$duplicates = @()

foreach ($line in $data) {
    if ($line -match 'window\.VLAB_DATA\.([a-zA-Z0-9_]+)\s*=') {
        $key = $Matches[1]
        if ($keys.ContainsKey($key)) {
            $duplicates += $key
            Write-Host "Duplicate key found: $key"
        } else {
            $keys[$key] = $true
        }
    }
}

if ($duplicates.Count -eq 0) {
    Write-Host "No duplicate keys found in VLAB_DATA."
} else {
    Write-Host "Total duplicates: $($duplicates.Count)"
}
