param(
    [string]$Debug
)
# Check the current branch
# Announce to user what branch they're on.
# Ensure they want to use this branch.
$currentBranch = git rev-parse --abbrev-ref HEAD
while ($true) {
    $answer = Read-host "Are you sure you want to deploy to $currentBranch? Type 'yes' or 'no' (case sensitive) "
    if ($answer -eq "yes") {
        break
    }
    elseif ($answer -eq "no") {
        return
    }
    else {
        Write-host "Invalid input"
    }
}
# Test app build before building path.
if(($Debug -ne "true") -and ($currentBranch -ne "dev")){
    Write-host "Linting app..."
    Set-Location ../
    npm run test
    if($LASTEXITCODE -eq 0){
        Write-Host "npm run test passed successfully"
    }
    else{
        Write-Host "npm run test failed with exit code: $LASTEXITCODE. Closing..."
        return
    }
    Set-Location pipeline
}
# Test is path build exists, if it doesn't, build it
if (-not (Test-Path -Path "../build")) {
    Write-host "No build file present, building file..."
    if ($Debug -ne "true") {
        Set-Location ../
        npm run build
        if($LASTEXITCODE -eq 0){
            Write-Host "npm build complete"
        }
        else{
            Write-Host "Build failed with exit code: $LASTEXITCODE"
            return
        }
        Set-Location pipeline
    }
}

$buildPath = "../build"
# Collect server addr and path from env variables.
# Read .env file into a hashtable
$envFile = Get-Content ".env" | Where-Object { $_ -match "=" } |
ForEach-Object {
    $name, $value = $_ -split "=", 2
    @{ Key = $name; Value = $value }
}
# Convert to dictionary
$envDict = @{}
foreach ($item in $envFile) {
    $envDict[$item.Key] = $item.Value
}
$Link = $envDict["LINK"]
$Path = $envDict["PATH"]
foreach ($file in $files) {
    Write-Host $file.Name
}

# Collect credentials to user and log in.
$credential = New-Object System.Management.Automation.PSCredential (Get-Credential)
$sftpSession = New-SFTPSession -ComputerName $Link -Credential $credential
# Navigate to sftp path for uploading the files
$remotePath = ""
if ($currentBranch -eq "main") {
    $remotePath = "$Path"
}
else {
    $remotePath = "$Path$currentBranch"
}

# #Upload directory contents recursively
Get-ChildItem -Path $buildPath -Recurse | ForEach-Object {
    # Get full file path, create a relative path in order to separate the contents of the build file.
    $fullPath = $_.FullName
    $index = $fullPath.ToLower().IndexOf("build\")
    if ($index -ge 0) {
        $relativePath = $fullPath.Substring($index + 6) -replace '\\', '/'
    }
    # Using the relative path, join the remote path with it to establish the proper directory to send the file to.
    $remoteFile = (Join-Path $remotePath $relativePath) -replace '\\', '/'
    # Checks if relative path is a directory. If it is then create it in the webserver (if it doesn't exist already)
    if (Test-Path -Path "../build/$relativePath" -PathType Container) {
        if ($Debug -ne "true") {
            New-SFTPItem -SessionId $sftpSession.SessionID -Path "$remotePath/$relativePath" -ItemType Directory -ErrorAction SilentlyContinue
        }
    }
    else {
        # If the remoteFile path is not a dir, then reformat it to fit the proper path format for the web server to interperet.
        $remoteFile = Split-Path $remoteFile
        # Replace backslashes with forward slashes
        $remoteFile = $remoteFile -replace '\\', '/'
        # Upload file to user. Force upload regardless if file of same name exists within webserver.
        Write-Host "Uploading $fullPath to $remoteFile"
        if ($Debug -ne "true") {
            Set-SFTPItem -Session $sftpSession.SessionID -Destination $remoteFile -Path $fullPath -verbose -force
        }
    }
}
$out = Remove-SFTPSession -SFTPSession $sftpSession
if ($out -ne "true") {
    $out
}