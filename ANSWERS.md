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

We have an `EmailAddress` class representing an email address. The best approach would be to leverage the object-oriented programming paradigm used in the codebase to create a getter for extracting the domain name.

```ts
public get domainName() {
   return this.value.split("@")[1]; // Or a more complex regex if needed later
}
```

### Task 4: Preventing Duplicate Imports in Parallel Email Processing

In this scenario, we would simply add a unique constraint to the universal_message_id field in the database schema.

```diff
// schema.sql line 8
- "universal_message_id"  TEXT NOT NULL,
+ "universal_message_id"  TEXT NOT NULL UNIQUE,
```

We will also need to append `ON CONFLICT (universal_message_id) DO NOTHING;` to the `INSERT` sql command in the `persist` method of `EmailRepository` to prevent the entire batch insertion from failing.

This way, the database will be in charge of ensuring there are no duplicate emails

<details>

  <summary>Aditional answers</summary>

- Nb1. In scenarios where relevant additional data needs to be persisted even after a second fetch (e.g., ~~User C receives the email as a blind carbon copy, so we're unaware of C when inserting from B~~ *Edit: According to the RFC, BCC results in a new copy of the message, likely with a new Message-ID. However, I lack a better example*), we could adopt an upsert strategy (checking for existing values before inserting) or catch the unique constraint violation error.
- Nb2. Databases already possess many locking mechanisms to prevent data races, but if necessary, we can manage this within our backend for tasks that should not be executed multiple times (e.g., downloading email attachments ?). This can be achieved using a semaphore or a redis (on distributed systems).

</details>

### Task 5: Testing

Let's set aside end-to-end testing since it depends on screen recording, and our project lacks a frontend. Achieving optimal test coverage would involve a combination of unit and integration testing.

Given that our codebase primarily consists of classes—such as Entities, Value Objects, Repositories, and Services—which have internal state values and potential dependencies, unit testing may not always be straightforward. Typically, unit testing is more suited to pure functions, which, given the same input, always return the same output and operate without dependencies. Therefore, our focus will be on testing individual methods rather than entire classes. I am a strong advocate for Test-Driven Development (TDD), where unit tests are written before the core functionality, even though I don't always practice it as much as I should.

For testing classes, integration tests are more applicable as they allow us to examine the functionality of the entire class. Since our project lacks a dependency injection mechanism, additional effort will be required to either swap out dependencies or mock them for testing purposes.

## Feedback
