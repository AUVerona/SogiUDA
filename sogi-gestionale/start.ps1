# Script per avviare il progetto SOGI UDA

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  SOGI UDA - Gestionale" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Verifica MongoDB
Write-Host "Verifico MongoDB..." -ForegroundColor Yellow
$mongoRunning = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue

if ($mongoRunning -and $mongoRunning.Status -eq "Running") {
    Write-Host "✓ MongoDB è in esecuzione" -ForegroundColor Green
} else {
    Write-Host "⚠ MongoDB non è in esecuzione" -ForegroundColor Red
    Write-Host "Tentativo di avvio MongoDB..." -ForegroundColor Yellow
    
    try {
        Start-Service -Name "MongoDB" -ErrorAction Stop
        Write-Host "✓ MongoDB avviato con successo" -ForegroundColor Green
    } catch {
        Write-Host "✗ Impossibile avviare MongoDB automaticamente" -ForegroundColor Red
        Write-Host "Avvia MongoDB manualmente prima di procedere" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "Avvio server di sviluppo..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Il sito sarà disponibile su: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Premi CTRL+C per terminare" -ForegroundColor Gray
Write-Host ""

# Avvia Next.js
npm run dev
