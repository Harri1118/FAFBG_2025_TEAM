# Check the current branch
# Announce to user what branch they're on.
$currentBranch = git rev-parse --abbrev-ref HEAD
Write-Host "You are on branch: $currentBranch"
# Test is path build exists, if it doesn't, build it
Test-Path -Path "../build"
$localPath = "../build"
# Collect server addr and path from env variables.
# Read .env file into a hashtable
$envFile = Get-Content ".env" | Where-Object {$_ -match "="} |
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
# foreach ($file in $files) {
#     Write-Host $file.Name
# }

# Collect credentials to user and log in.
$credential = New-Object System.Management.Automation.PSCredential (Get-Credential)
$sftpSession = New-SFTPSession -ComputerName $Link -Credential $credential
# Navigate to sftp path for uploading the files
$remoteDir = ""
$remotePath = ""
if($currentBranch -eq "main"){
    $remotePath = "$Path"
}
else{
    $remotePath = "$Path$currentBranch"
}
$remoteDir = Get-SFTPChildItem -SFTPSession $sftpSession -Path $remotePath

# Upload directory contents recursively
Get-ChildItem -Path $localPath -Recurse | ForEach-Object {
    $localFile  = $_.FullName
    # need to remove bath 
    $relativePath = $_.FullName.Substring($localPath.Length).TrimStart('\')
    $remoteFile   = (Join-Path $remotePath $relativePath) -replace '\\','/'
    # Use Test-Path to check if the directory exists
    if (Test-Path -Path $remotePath -PathType Container) {
        Write-Host "The directory '$remotePath' exists."
    } else {
        Write-Host "The directory '$remotePath' does not exist."
    }
    if (-not $_.PSIsContainer) {
        $remoteFile
        Write-Host "Uploading $localFile to $remoteFile"
        Set-SFTPItem -Session $sftpSession.SessionID -Destination $remotePath -Path $localFile -verbose -force
    }
}
Remove-SFTPSession -SFTPSession $sftpSession
