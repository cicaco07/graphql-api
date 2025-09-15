# **Patch Notes API Documentation**

## Patch Notes API Table of Contents

- [**Patch Notes API Documentation**](#patch-notes-api-documentation)
  - [Patch Notes API Table of Contents](#patch-notes-api-table-of-contents)
  - [1. Create Patch Note API](#1-create-patch-note-api)
    - [- Example schema field for Create Patch Note API](#--example-schema-field-for-create-patch-note-api)


## 1. Create Patch Note API

Description: This mutation allows you to create a new patch note with attributes such as version, start_date, and changes. You can return the created patch note object in the response.

### - Example schema field for Create Patch Note API
```
mutation {
  createPatchNote(
    createPatchNoteInput: {
      version: string
      start_date: string
      changes: [string]
    }
  ) {
    id
    version
    start_date
    changes
  }
}
```