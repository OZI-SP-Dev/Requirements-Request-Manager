# Changelog
All notable changes to this project will be documented in this file.
Include any required SharePoint changes that will be needed to deploy you PR
Update the version number in package.json when submitting your PR

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),

## [Unreleased]
- (Keep your changes here until you have a release version)

## [0.1.27] 2020-12-09
### Changed
- The Request Status text when displaying to the user
- The Large Request View now shows the Title, previous status, and next status above the timeline
- Status wording

### Removed
- ReceivedDate field

## [0.1.26] 2020-12-08
### Changed
- The Only My Requests filter on the Requests table page will now default to false for users with the Manager role
- The useRequests hook will now only begin loading Requests after the roles have been loaded so that the defaults can be applied

## [0.1.25] 2020-12-07
### Added
- Red asterisk to indicate required fields

### Changed
- Notes look in UI to look more like post-it notes
- Notes section of Large Request View now contains status update notes with colors associated to that statuses
- Regular users can now add notes to their own Requests

### Removed
- Ability for users to edit/delete notes

## [0.1.24] 2020-12-07
### Fixed
- Requests table format so that a scroll bar doesn't appear when expanding a request
- Formatting on Large Request View so that it properly fills the available space when no notes are there
- Buttons properly disable when a status change is happening

### Changed
- Notes container on Large Request View will now take up all of the available space of the page before adding a scrollbar
- Buttons now use their actions as text instead of saying "Set to..."
- Reworded some of the email text

### Removed
- Notes from small request view

## [0.1.23] 2020-12-02
### Added
- Status and StatusDateTime fields on RequirementsRequests SP List
- Status field on Notes SP List
- Workflow timeline for Request statuses on large RequestView page
- Many new statuses and the ability to transition between them

### Changed
- How the approval API code works and how the RequirementsRequestApi will fetch Approvals

### Removed
- ApprovedComment and ApprovedDateTime fields, since those can be fetched by looking at the notes

## [0.1.22] 2020-11-05
### Added
- Timestamp to NoteCards

## [0.1.21] 2020-11-04
### Fixed
- Spelling mistakes on view pages

### Added
- Tooltip to Approver field on form

### Changed
- PEOOrgSymbol to ApproverOrgSymbol on RequirementsRequest and RequestApprovals
- FundingOrgOrPEO to FundingOrgOrDeputy on RequirementsRequest and RequestApprovals
- ApprovingPEO to Approver on RequirementsRequest and RequestApprovals
- PEO_DSNPhone to ApproverDSNPhone on RequirementsRequest and RequestApprovals
- PEO_CommPhone to ApproverCommPhone on RequirementsRequest and RequestApprovals

### Removed
- FuncRequirementType field on RequirementsRequest and RequestApprovals

## [0.1.20] 2020-10-20
### Changed
- IsFunded field changed from a checkbox to Yes/No radio buttons so that users must choose an option

## [0.1.19] 2020-10-19
### Changed
- IRM dates on home page now says every two months
- DSN fields on Request forms are no longer required

### Added
- When a person is searched on the Request form, the corresponding org field will attempt to auto-populate by searching for the org in the person's title

## [0.1.18] 2020-10-01
### Added
- Home page with overview and helpful information for users

## [0.1.17] 2020-09-28
### Changed
- For RequirementsRequests SP list split RequirementType into NoveltyRequirementType and FuncRequirementType so the user can select two options 
- For RequestApprovals SP list split RequirementType into NoveltyRequirementType and FuncRequirementType to match the RequeirementsRequests change
- Split the review page into sections to be more organized
- Made the projected number of users field optional

## [0.1.16] 2020-09-24
### Added
- Confirmation popovers for deleting requests and notes
- IsDeleted field on RequirementsRequests SP list

### Changed
- Deleting a request now just makes the IsDeleted field flip to true
- Filter out requests in queries that have IsDeleted set to true

## [0.1.15] 2020-09-21
### Changed
- The builds are now location agnostic, so they can run in any SP site with the proper lists

## [0.1.14] 2020-09-16
### Fixed
- Bug that prevented a user from saving a request that had an operational need date from before the current date
- Bug that made new requests read only for normal users

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