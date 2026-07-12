Write-Host "hello from prebuild.ps1"
Write-Host "PWD=" (Get-Location)
Write-Host "SCRIPT=" $MyInvocation.MyCommand.Path
Write-Host "BASE=" (Split-Path -Parent $MyInvocation.MyCommand.Path)
