# Changelog
All notable changes to this project will be documented in this file.
Include any required SharePoint changes that will be needed to deploy you PR
Update the version number in package.json when submitting your PR

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),

## [Unreleased]
- (Keep your changes here until you have a release version)

## [0.1.5] - 2020-07-21
### Changed
- RequestApprovals SP list now has all of the fields of the RequirementsRequests SP list
- Made a request uneditable after it has been approved
- The RequirementsRequestsApi will prioritize the request fields found from the RequestApprovalsApi so that it is effectively read-only

## [0.1.4] - 2020-07-20
### Added
- A spinner for when the requests or the user is currently loading

## [0.1.3] - 2020-07-17
### Added
- Review page for approvers to review and approve a request
- RequestApprovals SP list to store the approvals for requests
- View page for users to see a read-only view of a request
- PEOApprovedComment on the domain objects to show any comment that the approver made

### Changed
- General formatting fixes on Requests page
- PEOApprovedDate to PEOApprovedDateTime on Request objects
- Child pages of /Requests now scroll to top on navigating to them

## [0.1.2] - 2020-07-09
### Added
- Details view of requests on the /Requests page, expanded by clicking on a Request in the table
- Edit page/route to edit existing Requests
- Ability to delete a Request

## [0.1.1] - 2020-07-06
### Added
- /Requests page to display requests submitted
- /Requests/new page to create a new request
- RequirementsRequests SharePoint list

## [0.1.0] - 2020-06-01
### Added
- This CHANGELOG file.

### Types of changes
- Added for new features.
- Changed for changes in existing functionality.
- Deprecated for soon-to-be removed features.
- Removed for now removed features.
- Fixed for any bug fixes.
- Security in case of vulnerabilities.