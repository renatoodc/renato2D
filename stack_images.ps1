Add-Type -AssemblyName System.Drawing
$calcadao = [System.Drawing.Bitmap]::FromFile("C:\Users\usuario\Documents\Renato2D\renato2D\public\assets\calcadao_backup.png")
$ruaa = [System.Drawing.Bitmap]::FromFile("C:\Users\usuario\Documents\Renato2D\renato2D\public\assets\ruaa.png")

$sidewalkStartY = 112
$sidewalkHeight = $calcadao.Height - $sidewalkStartY

$newHeight = $ruaa.Height + $sidewalkHeight
$bmp = New-Object System.Drawing.Bitmap($calcadao.Width, $newHeight)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::Transparent)

# Draw street at the top, stretched to the width of the calcadao
$g.DrawImage($ruaa, 0, 0, $calcadao.Width, $ruaa.Height)

# Draw sidewalk at the bottom
$destSidewalk = New-Object System.Drawing.Rectangle(0, $ruaa.Height, $calcadao.Width, $sidewalkHeight)
$srcSidewalk = New-Object System.Drawing.Rectangle(0, $sidewalkStartY, $calcadao.Width, $sidewalkHeight)
$g.DrawImage($calcadao, $destSidewalk, $srcSidewalk, [System.Drawing.GraphicsUnit]::Pixel)

$g.Dispose()
$calcadao.Dispose()
$ruaa.Dispose()
$bmp.Save("C:\Users\usuario\Documents\Renato2D\renato2D\public\assets\calcadao.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Host "Stacked images successfully!"
