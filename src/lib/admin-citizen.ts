import { CitizenSubmissionStatus } from "@prisma/client";
import { db } from "@/lib/db";

export async function submitCitizenStory(input: {
  submitterName: string;
  email: string;
  title: string;
  body: string;
  mediaUrl?: string | null;
}) {
  return db.citizenSubmission.create({
    data: {
      submitterName: input.submitterName,
      email: input.email.toLowerCase(),
      title: input.title,
      body: input.body,
      mediaUrl: input.mediaUrl ?? null,
      status: CitizenSubmissionStatus.pending,
    },
  });
}

export async function listCitizenSubmissions(options: {
  page: number;
  limit: number;
  status?: CitizenSubmissionStatus;
}) {
  const where = options.status ? { status: options.status } : undefined;

  const [submissions, total] = await Promise.all([
    db.citizenSubmission.findMany({
      where,
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      orderBy: { submittedAt: "desc" },
    }),
    db.citizenSubmission.count({ where }),
  ]);

  return {
    data: submissions.map((s) => ({
      id: s.id,
      submitterName: s.submitterName,
      email: s.email,
      title: s.title,
      body: s.body,
      mediaUrl: s.mediaUrl,
      status: s.status,
      submittedAt: s.submittedAt.toISOString(),
    })),
    total,
    page: options.page,
    limit: options.limit,
  };
}

export async function reviewCitizenSubmission(
  id: string,
  status: "reviewed" | "approved" | "rejected"
) {
  return db.citizenSubmission.update({
    where: { id },
    data: { status: status as CitizenSubmissionStatus },
  });
}

export async function getCitizenSubmissionById(id: string) {
  return db.citizenSubmission.findUnique({ where: { id } });
}

export async function countPendingCitizenSubmissions() {
  return db.citizenSubmission.count({
    where: { status: CitizenSubmissionStatus.pending },
  });
}
