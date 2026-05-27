import { ArticleStatus } from "@prisma/client";
import { db } from "@/lib/db";

export async function getPollByArticleSlug(slug: string, voterKey?: string) {
  const poll = await db.poll.findFirst({
    where: { article: { slug, status: ArticleStatus.published } },
    include: {
      options: { orderBy: { voteCount: "desc" } },
    },
  });

  if (!poll) return null;

  let userVote: string | null = null;
  if (voterKey) {
    const vote = await db.pollVote.findUnique({
      where: { pollId_voterKey: { pollId: poll.id, voterKey } },
    });
    userVote = vote?.optionId ?? null;
  }

  const totalVotes = poll.options.reduce((sum, o) => sum + o.voteCount, 0);

  return {
    id: poll.id,
    question: poll.question,
    endsAt: poll.endsAt?.toISOString() ?? null,
    totalVotes,
    userVote,
    options: poll.options.map((o) => ({
      id: o.id,
      text: o.optionText,
      votes: o.voteCount,
      percentage: totalVotes > 0 ? Math.round((o.voteCount / totalVotes) * 100) : 0,
    })),
  };
}

export async function getPollById(pollId: string, voterKey?: string) {
  const poll = await db.poll.findUnique({
    where: { id: pollId },
    include: { options: { orderBy: { voteCount: "desc" } } },
  });
  if (!poll) return null;

  let userVote: string | null = null;
  if (voterKey) {
    const vote = await db.pollVote.findUnique({
      where: { pollId_voterKey: { pollId, voterKey } },
    });
    userVote = vote?.optionId ?? null;
  }

  const totalVotes = poll.options.reduce((sum, o) => sum + o.voteCount, 0);

  return {
    id: poll.id,
    question: poll.question,
    endsAt: poll.endsAt?.toISOString() ?? null,
    totalVotes,
    userVote,
    options: poll.options.map((o) => ({
      id: o.id,
      text: o.optionText,
      votes: o.voteCount,
      percentage: totalVotes > 0 ? Math.round((o.voteCount / totalVotes) * 100) : 0,
    })),
  };
}

export async function castPollVote(
  pollId: string,
  optionId: string,
  voterKey: string,
  userId?: string
): Promise<
  | { error: string }
  | NonNullable<Awaited<ReturnType<typeof getPollById>>>
> {
  const poll = await db.poll.findUnique({
    where: { id: pollId },
    include: { options: true },
  });
  if (!poll) return { error: "Poll not found" as const };
  if (poll.endsAt && poll.endsAt < new Date()) {
    return { error: "Poll has ended" as const };
  }

  const option = poll.options.find((o) => o.id === optionId);
  if (!option) return { error: "Invalid option" as const };

  const existing = await db.pollVote.findUnique({
    where: { pollId_voterKey: { pollId, voterKey } },
  });
  if (existing) return { error: "Already voted" as const };

  await db.$transaction([
    db.pollVote.create({
      data: { pollId, optionId, voterKey, userId: userId ?? null },
    }),
    db.pollOption.update({
      where: { id: optionId },
      data: { voteCount: { increment: 1 } },
    }),
  ]);

  const updated = await getPollById(pollId, voterKey);
  if (!updated) return { error: "Poll not found" as const };
  return updated;
}
