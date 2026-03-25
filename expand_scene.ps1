Add-Type -AssemblyName System.Drawing

$rua1Path = "C:\Users\usuario\Documents\Renato2D\renato2D\public\assets\rua..png"
$calcadaoBackupPath = "C:\Users\usuario\Documents\Renato2D\renato2D\public\assets\calcadao_backup.png"
$restingaPath = "C:\Users\usuario\Documents\Renato2D\renato2D\public\assets\restingaa.png"
$outputPath = "C:\Users\usuario\Documents\Renato2D\renato2D\public\assets\calcadao_v3.png"

# Load images
$rua1 = [System.Drawing.Bitmap]::FromFile($rua1Path)
$calcadaoBackup = [System.Drawing.Bitmap]::FromFile($calcadaoBackupPath)
$skyPath = "C:\Users\usuario\.gemini\antigravity\brain\303691d4-ac9b-4305-b60c-90453a717660\cartoon_sky_1774169776101.png"
$sky = [System.Drawing.Bitmap]::FromFile($skyPath)
$restinga = [System.Drawing.Bitmap]::FromFile($restingaPath)

$targetWidth = 4096
$scale = $targetWidth / 1435.0

# 0. Top Black Padding
$topPaddingH = 2500 # Extra black space above the road

# 1. Road Dimensions (Full rua..png height: 393px)
$roadSrcY = 0
$roadSrcH = 393
$roadDestH = [int][math]::Round($roadSrcH * $scale)

# 2. Sidewalk/Ciclovia Dimensions
# Hardcoded to requested sizes
$grayDestH = 350
$redDestH = 450

# 3. Restinga Dimensions — crop transparent top/bottom padding
$restingaSrcY = 302       # First opaque row
$restingaSrcH = 368       # Height of actual content (rows 302-669)
$restingaScale = $targetWidth / $restinga.Width
$restingaDestH = [int][math]::Round($restingaSrcH * $restingaScale)

$totalH = $topPaddingH + $roadDestH + $grayDestH + $redDestH + $restingaDestH

# Create final bitmap
$bmp = New-Object System.Drawing.Bitmap($targetWidth, $totalH)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Fill entire top padding with solid blue
$pureBlue = $sky.GetPixel(20, 20)
$blueBrush = New-Object System.Drawing.SolidBrush($pureBlue)
$g.FillRectangle($blueBrush, 0, 0, $targetWidth, $topPaddingH)

# Draw Sky Background ONLY in the middle layer (Y=1024 to 2048)
$skyBrush = New-Object System.Drawing.TextureBrush($sky)
$skyBrush.TranslateTransform(0, 1024)
$skyRect = New-Object System.Drawing.Rectangle(0, 1024, $targetWidth, 1024)
$g.FillRectangle($skyBrush, $skyRect)
$skyBrush.Dispose()
$blueBrush.Dispose()

# Helper
function Draw-S {
    param($srcImg, $srcX, $srcY, $srcW, $srcH, $destX, $destY, $destW, $destH)
    $sR = New-Object System.Drawing.Rectangle([int]$srcX, [int]$srcY, [int]$srcW, [int]$srcH)
    $dR = New-Object System.Drawing.Rectangle([int]$destX, [int]$destY, [int]$destW, [int]$destH)
    $g.DrawImage($srcImg, $dR, $sR, [System.Drawing.GraphicsUnit]::Pixel)
}

# START STACKING
$currY = $topPaddingH

# A. ROAD
# First, draw the road background
Draw-S $rua1 0 $roadSrcY 1435 $roadSrcH 0 $currY $targetWidth $roadDestH

$currY += $roadDestH

# C. DROPPED CURB (Rebaixamento da guia da rua)

# Extend the crosswalk from slightly above the road curb down over the curb.
# The `rua..png` bottom curb is from y=372 to y=393 (height 21).
$crossSrcY = 351
$crossSrcH = 21
$crossDestY = $topPaddingH + [int][math]::Round(372 * $scale)
$crossDestH = [int][math]::Round(21 * $scale) # Cover down to bottom

# Left Drop (True left crosswalk widened to 0)
$ramp1SrcW = 57 - 0
$ramp1X = [int][math]::Round(0 * $scale)
$ramp1W = [int][math]::Round($ramp1SrcW * $scale)
Draw-S $rua1 0 $crossSrcY $ramp1SrcW $crossSrcH $ramp1X $crossDestY $ramp1W $crossDestH

# Right Drop (True right crosswalk at 1355)
# Widen to the very edge of the image (1435) to remove the remaining curb piece
$ramp2SrcW = 1435 - 1355
$ramp2X = [int][math]::Round(1355 * $scale)
$ramp2W = [int][math]::Round($ramp2SrcW * $scale)
Draw-S $rua1 1355 $crossSrcY $ramp2SrcW $crossSrcH $ramp2X $crossDestY $ramp2W $crossDestH

# B. CICLOVIA (Gray asphalt) - Fixed 350px
$grayStart = $currY
$curbDestH = [int][math]::Round(18 * $scale) # approx 51px
$cicloBodyDestH = $grayDestH - $curbDestH # 299px

# Stripe math
$stripeDestH = [int][math]::Round(13 * $scale) # 37px
$asphaltDestH = [int][math]::Round(($cicloBodyDestH - $stripeDestH) / 2.0) # 131px
$asphalt2DestH = $cicloBodyDestH - $stripeDestH - $asphaltDestH # 131px

# Top asphalt (y=9, h=40)
Draw-S $calcadaoBackup 0 9 1435 40 0 $currY $targetWidth $asphaltDestH
$currY += $asphaltDestH

# Stripe (y=49, h=13)
Draw-S $calcadaoBackup 0 49 1435 13 0 $currY $targetWidth $stripeDestH
$currY += $stripeDestH

# Bottom asphalt (y=62, h=40)
Draw-S $calcadaoBackup 0 62 1435 40 0 $currY $targetWidth $asphalt2DestH
$currY += $asphalt2DestH

# Middle curb (Restored continuous curb)
Draw-S $calcadaoBackup 0 112 1435 18 0 $currY $targetWidth $curbDestH
$currY = $grayStart + $grayDestH # Ensure perfect alignment

# C. CALÇADÃO (Red tiles) - Fixed 450px
$botCurbDestH = [int][math]::Round(52 * $scale) # approx 148px
$redBodyDestH = $redDestH - $botCurbDestH # 302px

$redSrcCropH = [int][math]::Round($redBodyDestH / $scale) # approx 106px
Draw-S $calcadaoBackup 0 130 1435 $redSrcCropH 0 $currY $targetWidth $redBodyDestH
$currY += $redBodyDestH

# Bottom Curb/Sand Transition
Draw-S $calcadaoBackup 0 270 1435 52 0 $currY $targetWidth $botCurbDestH
$currY = $grayStart + $grayDestH + $redDestH # Ensure perfect alignment
# D. RESTINGA — sand background + restinga centered, overlapping sidewalk
# Load sand tile
$sandPath = "C:\Users\usuario\Documents\Renato2D\renato2D\public\assets\sand_tile.png"
$sandTile = [System.Drawing.Bitmap]::FromFile($sandPath)

# How much to pull restinga up into the sidewalk
$overlapUp = 30

# The visible restinga content height (rows 302-668 = 367px of opaque content)
$restingaSrcY = 302
$restingaSrcH = 367
$restingaScale = $targetWidth / $restinga.Width
$restingaDestH = [int][math]::Round($restingaSrcH * $restingaScale)

# Sand band height from sidewalk edge to bottom of canvas (restinga + extra sand below)
$sandBelowH = 300
$zoneTotalH = $restingaDestH + $sandBelowH

# Expand total bitmap to fit
$newTotalH = $currY - $overlapUp + $zoneTotalH
$bmp2 = New-Object System.Drawing.Bitmap($targetWidth, $newTotalH)
$g.Dispose()
$g = [System.Drawing.Graphics]::FromImage($bmp2)

# Copy existing layers (road + ciclovia + sidewalk) into new bitmap
$g.DrawImage($bmp, [System.Drawing.Rectangle]::new(0,0,$targetWidth,$currY),
             [System.Drawing.Rectangle]::new(0,0,$targetWidth,$currY),
             [System.Drawing.GraphicsUnit]::Pixel)
$bmp.Dispose()

$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

# Fill the full sand zone with tiled sand_tile.png
$sandZoneY = $currY - $overlapUp
$tiledSandDestH = $zoneTotalH + $overlapUp
$tx = 0
while ($tx -lt $targetWidth) {
    $ty = $sandZoneY
    while ($ty -lt ($sandZoneY + $tiledSandDestH)) {
        $drawW = [math]::Min($sandTile.Width, $targetWidth - $tx)
        $drawH = [math]::Min($sandTile.Height, ($sandZoneY + $tiledSandDestH) - $ty)
        $srcR = New-Object System.Drawing.Rectangle(0, 0, [int]$drawW, [int]$drawH)
        $dstR = New-Object System.Drawing.Rectangle([int]$tx, [int]$ty, [int]$drawW, [int]$drawH)
        $g.DrawImage($sandTile, $dstR, $srcR, [System.Drawing.GraphicsUnit]::Pixel)
        $ty += $sandTile.Height
    }
    $tx += $sandTile.Width
}

# Draw restinga on top of sand (overlapping sidewalk by $overlapUp px)
$restingaDestY = $currY - $overlapUp
$srcRest = New-Object System.Drawing.Rectangle(0, $restingaSrcY, $restinga.Width, $restingaSrcH)
$dstRest = New-Object System.Drawing.Rectangle(0, $restingaDestY, $targetWidth, $restingaDestH)
$g.DrawImage($restinga, $dstRest, $srcRest, [System.Drawing.GraphicsUnit]::Pixel)

# Cleanup
$g.Dispose()
$bmp2.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp2.Dispose()
$rua1.Dispose()
$calcadaoBackup.Dispose()
$sky.Dispose()
$restinga.Dispose()
$sandTile.Dispose()

Write-Host "V3 Asset Created: $outputPath ($targetWidth x $newTotalH)"
