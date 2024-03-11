import { EmailRepository } from "../datastore/repositories/EmailRepository";
import { MessageRepository } from "../datastore/repositories/MessageRepository";
import { ThreadRepository } from "../datastore/repositories/ThreadRepository";
import { UserRepository } from "../datastore/repositories/UserRepository";
import { textEllipsis } from "../utils/textEllipsis";

export class MessageDisplayService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly threadRepository: ThreadRepository,
    private readonly userRepository: UserRepository,
    private readonly emailRepository: EmailRepository
  ) {}

  public async displayMessages(): Promise<void> {
    const messages = await this.messageRepository.findAll();
    const threads = await this.threadRepository.findAll();
    const senders = await this.userRepository.findAll();
    const emails = await this.emailRepository.findAll();

    for (const thread of threads) {
      const threadMessages = messages.filter(
        (message) => message.threadId === thread.id
      );
      console.log(`\nThread: ${textEllipsis(thread.name, 20)}`);
      for (const message of threadMessages) {
        const sender = senders.find((sender) => sender.id === message.senderId);
        const email = emails.find((email) => email.id === message.emailId);
        const actualSender = textEllipsis(
          sender?.displayName ?? email!.from.email.value!,
          20
        );
        const truncatedBody = textEllipsis(message.body, 100);
        const formattedDate = textEllipsis(
          message.date.toLocaleDateString(),
          10
        );

        console.log(`   ${formattedDate} ${actualSender}: ${truncatedBody}`);
      }
    }
  }
}
