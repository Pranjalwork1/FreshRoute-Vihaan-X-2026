$git = (Get-ChildItem -Path "$env:LOCALAPPDATA\GitHubDesktop" -Filter "git.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -ExpandProperty FullName -First 1)
if (-not $git) {
    Write-Host "Git not found in GitHubDesktop"
    exit 1
}
Write-Host "Using git at: $git"
& $git status -s
& $git add .
& $git commit -m "FreshRoute: Complete UI/UX migration from master HTML design across homepage, navigation, auth, and workspaces"
& $git push origin main
Write-Host "Git push complete."
