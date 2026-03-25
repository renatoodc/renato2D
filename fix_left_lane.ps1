Add-Type -AssemblyName System.Drawing
$ruaa = [System.Drawing.Bitmap]::FromFile("C:\Users\usuario\Documents\Renato2D\renato2D\public\assets\ruaa_backup.png")
$g = [System.Drawing.Graphics]::FromImage($ruaa)

$roadBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#808388'))

# 1. Fill the top dip and bottom island to make a straight wide road
$g.FillRectangle($roadBrush, 130, 112, 440, 108)

# 1b. Fix top borders
$whitePenSolid = New-Object System.Drawing.Pen([System.Drawing.Color]::White, 1)
$blackPenSolid = New-Object System.Drawing.Pen([System.Drawing.Color]::Black, 1)
$g.DrawLine($whitePenSolid, 130, 112, 570, 112)
$g.DrawLine($blackPenSolid, 130, 111, 570, 111)

# 2. Add dashed median line
$whitePen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, 2)
$whitePen.DashPattern = @(10.0, 10.0)
$centerY = [math]::Floor((112 + 219) / 2)
$g.DrawLine($whitePen, 130, $centerY, 570, $centerY)

$g.Dispose()

# 3. Extend crosswalk downward via pixel copying
for ($y = 195; $y -le 219; $y++) {
    $srcY = 180 + (($y - 195) % 15)
    for ($x = 75; $x -le 135; $x++) {
        $ruaa.SetPixel($x, $y, $ruaa.GetPixel($x, $srcY))
    }
}

$ruaa.Save("C:\Users\usuario\Documents\Renato2D\renato2D\public\assets\ruaa_left_fixed.png", [System.Drawing.Imaging.ImageFormat]::Png)
$ruaa.Dispose()
Write-Host "Left lane fix complete."
