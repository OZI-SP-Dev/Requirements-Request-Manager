# Changelog
All notable changes to this project will be documented in this file.
Include any required SharePoint changes that will be needed to deploy you PR
Update the version number in package.json when submitting your PR

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),

## [Unreleased]
- (Keep your changes here until you have a release version)

## [0.1.13] 2020-09-15
### Fixed
- Bug that prevented a normal user from changing the Requester of a Request that they created
- Bug that incorrectly made a request read-only if you loaded directly into an edit request page

## [0.1.12] 2020-08-28
### Added
- A formatted ID to show to the user to help them refer more easily to different requests

### Changed
- Consolidated the Requests details view on the Requests table so that users only see quick/useful information there and they can go to the full view if they need more info

## [0.1.11] 2020-08-24
### Added
- Notes SP List for tracking Notes added to a Request
- Ability for users with the Manager role to add/edit/delete Notes
- Note Cards to Request views
- Option to send email notifying users that a Note has been added to their Request

## [0.1.10] 2020-08-12
### Added
- Emails are now sent when a request is submitted and approved

### Fixed
- Bug with showing empty ReceviedDate correctly

## [0.1.9] 2020-08-07
### Added
- Roles page for managing roles
- Roles SP List
- Roles enforcement throughout the application

## [0.1.8] 2020-07-30
### Added
- Error handling on all external facing code
- Error alerts for when errors do occur
- Form validation on submit for the Request form
- RequestDate field on form

## [0.1.7] 2020-07-28
### Added
- Added Requester field that defaults to the current user.
- Added a check that uses the requester as the PEO.

### Changed
- Changed the PEO fields to say 2 Ltr/PEO.

### Fixed
- Fixed bug that didn't check the funded checkbox when it should be

## [0.1.6] 2020-07-24
### Added
- Filter on the Requests page that limits the requests to show only the user's requests by default

### Changed
- The app will only load the user's requests in the initial load, instead of all of them
- If a user navigates directly to a Request's view/edit page that hasn't been loaded then it will be loaded dynamically

### Fixed
- The fetchById methods in the API classes now return properly, before they would not map any of the nested list objects such as people

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