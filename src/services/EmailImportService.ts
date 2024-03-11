import { EmailRepository } from "../datastore/repositories/EmailRepository";
import { MessageRepository } from "../datastore/repositories/MessageRepository";
import { ThreadRepository } from "../datastore/repositories/ThreadRepository";
import { UserRepository } from "../datastore/repositories/UserRepository";
import { EmailEntity } from "../model/entities/EmailEntity";
import { MessageEntity } from "../model/entities/MessageEntity";
import { ThreadEntity } from "../model/entities/ThreadEntity";
import { EmailFetcherService } from "./EmailFetcherService";
import { sortByAscDate } from "../utils/sortByDate";

export class EmailImportService {
  constructor(
    private readonly emailFetcherService: EmailFetcherService,
    private readonly emailRepository: EmailRepository,
    private readonly messageRepository: MessageRepository,
    private readonly threadRepository: ThreadRepository,
    private readonly userRepository: UserRepository
  ) {}

  public async import(): Promise<void> {
    const fetchedEmails = await this.retrieveAndPersistEmails();
    // Sort emails first, so parents should be treated before childrens
    const sortedEmails = fetchedEmails.sort(sortByAscDate);
    // Create a thread map to find them quickly without a find operation
    const threadMap: Record<string, ThreadEntity> = {};
    // Create a list of messages to persist, instead of persisting them one by one in the loop
    const messages: MessageEntity[] = [];

    for (const email of sortedEmails) {
      if (!email.inReplyTo) {
        // If there is no inReplyTo, it's a top-level email, create a new thread from it
        const thread = ThreadEntity.createFromTopLevelEmail(email);
        await this.threadRepository.persist([thread]);
        threadMap[email.universalMessageId.toString()] = thread;
        messages.push(await this.createMessageFromEmail(email, thread));
      } else {
        const thread = threadMap[email.inReplyTo.toString()];
        if (thread) {
          messages.push(await this.createMessageFromEmail(email, thread));
        } else {
          // Thread is not present in memory, check the database
        }
      }
    }
    await this.messageRepository.persist(messages);
  }

  private async retrieveAndPersistEmails() {
    const fetchedEmails = await this.emailFetcherService.fetch();
    await this.emailRepository.persist(fetchedEmails);
    return fetchedEmails;
  }

  // This method is not used in the current implementation
  private async createDefaultThread() {
    const singleThread = new ThreadEntity("Default Thread");
    await this.threadRepository.persist([singleThread]);
    return singleThread;
  }

  private async createMessageFromEmail(
    email: EmailEntity,
    thread: ThreadEntity
  ): Promise<MessageEntity> {
    const user = await this.userRepository.findByEmail(email.from.email);
    const messageSenderId = user?.id ?? null;

    const message = MessageEntity.createFromEmail(
      messageSenderId,
      thread.id!,
      email
    );
    return message;
  }
}
