import { textEllipsis } from "../../utils/textEllipsis";
import { AbstractEntity } from "./AbstractEntity";
import { EmailEntity } from "./EmailEntity";

export class ThreadEntity extends AbstractEntity {
  constructor(
    public readonly name: string,
    id?: number
  ) {
    super(id);
  }

  public static createFromTopLevelEmail(email: EmailEntity): ThreadEntity {
    if (email.inReplyTo) throw new Error("Email must be a top-level email");

    const threadName = email.subject.length
      ? textEllipsis(email.subject, 20)
      : "(Untitled thread)";
    return new ThreadEntity(threadName);
  }
}
