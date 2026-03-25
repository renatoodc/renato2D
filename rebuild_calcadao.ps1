Add-Type -AssemblyName System.Drawing
$calcadaoBackupPath = "C:\Users\usuario\Documents\Renato2D\renato2D\public\assets\calcadao_backup.png"
$ruaPath = "C:\Users\usuario\Documents\Renato2D\renato2D\public\assets\rua.png"
$finalPath = "C:\Users\usuario\Documents\Renato2D\renato2D\public\assets\calcadao.png"

$calcadao = [System.Drawing.Bitmap]::FromFile($calcadaoBackupPath)
$rua = [System.Drawing.Bitmap]::FromFile($ruaPath)

# Target Width is fixed at 1435 to match the original tile width
$targetWidth = 1435
$scaleFactor = $targetWidth / $rua.Width
$newRuaHeight = [math]::Floor($rua.Height * $scaleFactor)

$meioFioHeight = 10
$sidewalkStartY = 112 # Based on previous red-pixel analysis
$sidewalkHeight = $calcadao.Height - $sidewalkStartY

$totalHeight = $newRuaHeight + $meioFioHeight + $sidewalkHeight

$bmp = New-Object System.Drawing.Bitmap($targetWidth, $totalHeight)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::Transparent)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::Bicubic

# 1. Draw scaled Rua (Road + Roundabout)
$destRua = New-Object System.Drawing.Rectangle(0, 0, $targetWidth, $newRuaHeight)
$g.DrawImage($rua, $destRua)

# 2. Draw Curb (Meio-fio)
$curbBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#E0E0E0'))
$g.FillRectangle($curbBrush, 0, $newRuaHeight, $targetWidth, $meioFioHeight)

# Add line separation for the curb
$linePen = New-Object System.Drawing.Pen([System.Drawing.Color]::Black, 1)
$g.DrawLine($linePen, 0, $newRuaHeight, $targetWidth, $newRuaHeight)
$g.DrawLine($linePen, 0, $newRuaHeight + $meioFioHeight - 1, $targetWidth, $newRuaHeight + $meioFioHeight - 1)

# 3. Draw Sidewalk (Tijolinhos)
$sidewalkY = $newRuaHeight + $meioFioHeight
$destSidewalk = New-Object System.Drawing.Rectangle(0, $sidewalkY, $targetWidth, $sidewalkHeight)
$srcSidewalk = New-Object System.Drawing.Rectangle(0, $sidewalkStartY, $calcadao.Width, $sidewalkHeight)
$g.DrawImage($calcadao, $destSidewalk, $srcSidewalk, [System.Drawing.GraphicsUnit]::Pixel)

$g.Dispose()
$calcadao.Dispose()
$rua.Dispose()
$bmp.Save($finalPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

Write-Host "New calcadao.png created successfully! Dimensions: $($targetWidth)x$($totalHeight)"
