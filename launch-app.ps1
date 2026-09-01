$ErrorActionPreference = "SilentlyContinue"
$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$url = "http://localhost:5174"
$logFile = Join-Path $projectDir "launch.log"

function Write-Log($msg) {
    "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $msg" | Out-File -FilePath $logFile -Append -Encoding utf8
}

function Test-ServerRunning {
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2
        return $response.StatusCode -ge 200
    } catch {
        return $false
    }
}

Set-Location $projectDir
Write-Log "Launcher started"

if (-not (Test-Path "$projectDir\node_modules")) {
    Write-Log "Installing dependencies..."
    & npm install --silent 2>&1 | Out-Null
}

if (-not (Test-ServerRunning)) {
    Write-Log "Starting dev server..."
    Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "cd /d `"$projectDir`" && npm run dev -- --port 5174" -WindowStyle Hidden
    $retries = 0
    while (-not (Test-ServerRunning) -and $retries -lt 30) {
        Start-Sleep -Milliseconds 500
        $retries++
    }
    Write-Log "Server check done (attempts: $retries, running: $(Test-ServerRunning))"
} else {
    Write-Log "Server already running"
}

Start-Process $url
Write-Log "Browser opened at $url"

