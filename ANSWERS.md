# Upstream Sync

### Task 1: Group messages by threads
As the assignment aims to reward simplicity and readability, I have voluntarily reduced the complexity. A more performant approach would involve using Array.reduce to group all messages by their top-level Message-Id, then bulk-create all the threads, and finally link the newly inserted IDs to messages before inserting them. This method would reduce the number of calls to the database and the need for awaiting promises in a waterfall sequence.

### Task 2: Take messages stored in database into account

### Task 3: Display the domain name of the sender


### Task 4: Preventing Duplicate Imports in Parallel Email Processing

### Task 5: Testing

## Feedback

