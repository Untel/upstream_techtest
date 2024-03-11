# Upstream Sync

### Task 1: Group messages by threads
As the assignment aims to reward simplicity and readability, I have voluntarily reduced the complexity. A more performant approach would involve using Array.reduce to group all messages by their top-level Message-Id, then bulk-create all the threads, and finally link the newly inserted IDs to messages before inserting them. This method would reduce the number of calls to the database and the need for awaiting promises in a waterfall sequence.

### Task 2: Take messages stored in database into account
We would use the `MessageRepository` and the method `findOneByEmailUniversalMessageIdentifier` to fetch the missing messages. Once we have the missing parent message, we can assign the same threadId to its children. While `findOneByEmailUniversalMessageIdentifier` returns only the `threadId` and not a `ThreadEntity`, we will need to modify the `createMessageFromEmail` method to accept a `threadId` instead of a `ThreadEntity`.

<details>

  <summary>Additional answers</summary>

- Note 1: Creating a `findManyByEmailUniversalMessageIdentifiers` method could be more efficient for fetching missing messages in a single SQL call.
- Note 2: A potential solution could involve setting the top-level `Message-ID` as the thread's primary key. This would automatically include them in the next `INNER JOIN`, eliminating the need to check the database upfront or worry about fetching the child before its parent. However, using a remote ID as our primary key might not be best practice. This solution requires knowing the top-level `Message-ID`, and the RFC mentions the use of the `References` field instead of `In-Reply-To`.
</details>

### Task 3: Display the domain name of the sender


### Task 4: Preventing Duplicate Imports in Parallel Email Processing

### Task 5: Testing

## Feedback

