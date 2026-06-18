import { redirect } from "next/navigation";
import { requireUserSessionPage } from "@/lib/auth-utils";
import { getUserProfile, getFeedPreferences } from "@/lib/users";
import { getCategoriesForEditor } from "@/lib/articles-admin";
import ProfileForm from "@/components/reader/ProfileForm";
import FeedPreferences from "@/components/reader/FeedPreferences";
import PushNotificationPrompt from "@/components/reader/PushNotificationPrompt";
import PremiumStatusCard from "@/components/premium/PremiumStatusCard";

export const metadata = {
  title: "Your Profile",
};

export default async function ProfilePage() {
  const session = await requireUserSessionPage("/profile");

  const [profile, preferences, categories] = await Promise.all([
    getUserProfile(session.userId),
    getFeedPreferences(session.userId),
    getCategoriesForEditor(),
  ]);
  if (!profile) redirect("/sign-in");

  return (
    <div className="container-main py-12 max-w-2xl">
      <h1 className="font-serif text-3xl font-black text-foreground mb-2">Profile</h1>
      <p className="font-ui text-sm text-text-muted mb-8">
        Manage your account and feed preferences
      </p>

      <PushNotificationPrompt />
      <PremiumStatusCard userId={session.userId} />
      <ProfileForm profile={profile} />
      <FeedPreferences initial={preferences} categories={categories} />
    </div>
  );
}
