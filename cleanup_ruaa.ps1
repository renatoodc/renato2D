Add-Type -AssemblyName System.Drawing
$ruaaPath = "C:\Users\usuario\Documents\Renato2D\renato2D\public\assets\ruaa_backup.png"

$bmp = [System.Drawing.Bitmap]::FromFile($ruaaPath)
$roadColor = [System.Drawing.ColorTranslator]::FromHtml('#808388')

for ($x = 715; $x -lt $bmp.Width; $x++) {
    $topY = -1
    $bottomY = -1
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        if ($bmp.GetPixel($x, $y).A -gt 10) { $topY = $y; break }
    }
    for ($y = $bmp.Height - 1; $y -ge 0; $y--) {
        if ($bmp.GetPixel($x, $y).A -gt 10) { $bottomY = $y; break }
    }

    if ($topY -ne -1 -and $bottomY -ne -1) {
        # Keep 5 pixels margin for top/bottom borders (black/white edge lines)
        for ($y = $topY + 6; $y -le $bottomY - 6; $y++) {
            $bmp.SetPixel($x, $y, $roadColor)
        }
        
        # Dashed line
        $centerY = 159 # Using absolute center mapped earlier to keep it strictly horizontal
        if ($y -gt $centerY -5 -and $y -lt $centerY + 5) {
             # safely inside bounds for dashed line
             if ([math]::Floor(($x - 715) / 20) % 2 -eq 0) {
                 $bmp.SetPixel($x, $centerY - 1, [System.Drawing.Color]::White)
                 $bmp.SetPixel($x, $centerY, [System.Drawing.Color]::White)
                 $bmp.SetPixel($x, $centerY + 1, [System.Drawing.Color]::White)
             }
        }
    }
}
$bmp.Save("C:\Users\usuario\Documents\Renato2D\renato2D\public\assets\ruaa_cleaned.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Host "Inner bounds robust cleanup successful!"
