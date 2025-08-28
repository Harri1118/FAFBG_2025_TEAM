$currentBranch = git rev-parse --abbrev-ref HEAD
Write-Host "You are on branch: $currentBranch"
if($currentBranch -eq "main"){
    $currentBranch = ""
}
$pth = "../build"
$files = dir $pth
foreach ($file in $files) {
    Write-Host $file.Name
}
# $credential = New-Object System.Management.Automation.PSCredential (Get-Credential)
# $sftpSession = New-SFTPSession -ComputerName "" -Credential $credential
# Get-SFTPChildItem -SFTPSession $sftpSession -Path "/wwwres/arce/$currentBranch"
# Remove-SFTPSession -SFTPSession $sftpSession
