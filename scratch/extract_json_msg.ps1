$jsonPath = "C:\Users\Atharva\.gemini\antigravity\brain\de07a3b0-c2e3-4687-bc41-39d9784c7bca\.system_generated\messages\4d8c5f61-636f-4732-9303-d41027b97fb4.json"
if (Test-Path $jsonPath) {
    Write-Host "Reading $jsonPath"
    $content = [System.IO.File]::ReadAllText($jsonPath, [System.Text.Encoding]::UTF8)
    $obj = ConvertFrom-Json $content
    Write-Host "Keys in JSON: $($obj | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name)"
    
    # Let's see if there is a Message field or similar
    # Typically, messages in system_generated/messages have a content or Message field.
    if ($obj.Message) {
        $msg = $obj.Message
    } elseif ($obj.content) {
        $msg = $obj.content
    } elseif ($obj.Body) {
        $msg = $obj.Body
    } else {
        $msg = $content
    }
    
    Write-Host "Extracted message length: $($msg.Length)"
    $dest = "C:\Users\Atharva\OneDrive\Desktop\netforge-vlab\scratch\extracted_parent_message.md"
    [System.IO.File]::WriteAllText($dest, $msg, [System.Text.Encoding]::UTF8)
    Write-Host "Saved to $dest"
} else {
    Write-Host "JSON file not found"
}
