<#
.SYNOPSIS
Promote the "Next" documentation of a Marvellous Codeworks project to its stable version.

.DESCRIPTION
Each project keeps only two documentation versions: the stable one (the latest release)
and "Next" (projects/<Project>, previews and upcoming changes). Run this after publishing a release:
the previous stable snapshot is removed and projects/<Project> is snapshotted as the new stable version.

.PARAMETER Project
Project to promote: TGD, TMS or logdrop.

.PARAMETER Version
Version just released (e.g. 9.1.0).

.EXAMPLE
.\Publish-ProjectDocs.ps1 -Project TMS -Version 9.1.0

.NOTES
Giovanni Solone, 2026
#>
param(
    [Parameter(Mandatory)][ValidateSet('TGD', 'TMS', 'logdrop')][string]$Project,
    [Parameter(Mandatory)][ValidatePattern('^\d+\.\d+\.\d+$')][string]$Version
)

$ErrorActionPreference = 'Stop'
$id = $Project.ToLower()

Push-Location $PSScriptRoot
try {
    Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "${id}_versioned_docs", "${id}_versioned_sidebars", "${id}_versions.json"
    npx docusaurus "docs:version:$id" $Version
    if ($LASTEXITCODE -ne 0) { throw "docs:version:$id failed (exit code $LASTEXITCODE)." }
}
finally {
    Pop-Location
}
