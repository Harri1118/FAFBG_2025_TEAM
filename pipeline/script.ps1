# Check the current branch
# Announce to user what branch they're on.
$currentBranch = git rev-parse --abbrev-ref HEAD
Write-Host "You are on branch: $currentBranch"
# Test is path build exists, if it doesn't, build it
Test-Path -Path "../build"
$pth = "../build"
$files = dir $pth
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
$Link
$Path
# foreach ($file in $files) {
#     Write-Host $file.Name
# }

# Collect credentials to user and log in.
$credential = New-Object System.Management.Automation.PSCredential (Get-Credential)
$sftpSession = New-SFTPSession -ComputerName $Link -Credential $credential
# Navigate to sftp path for uploading the files
if($currentBranch -eq "main"){
    Get-SFTPChildItem -SFTPSession $sftpSession -Path $Path
}
else{
    Get-SFTPChildItem -SFTPSession $sftpSession -Path "$Path$currentBranch"
}

# Upload directory contents recursively
Get-ChildItem -Path $localPath -Recurse | ForEach-Object {
    $localFile  = $_.FullName
    $remoteFile = Join-Path $remotePath ($_.FullName.Substring($localPath.Length) -replace '\\','/')

    if (-not $_.PSIsContainer) {
        Write-Host "Uploading $localFile to $remoteFile"
        Set-SFTPFile -SFTPSession $sftpSession -LocalFile $localFile -RemotePath $remoteFile -Confirm:$false
    }
}
Remove-SFTPSession -SFTPSession $sftpSession
