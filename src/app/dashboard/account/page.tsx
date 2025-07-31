// src/app/dashboard/account/page.tsx
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSettingsForm from "@/components/dashboard/ProfileSettingsForm";
import SecuritySettings from "@/components/dashboard/SecuritySettings";
import NotificationSettingsForm from "@/components/dashboard/NotificationSettingsForm";
import PrivacySettingsForm from "@/components/dashboard/PrivacySettingsForm";
import ContributorProfileForm from "@/components/dashboard/ContributorProfileForm";
import ShowcaseSettings from "@/components/dashboard/ShowcaseSettings";

export default async function AccountSettingsPage({
  searchParams,
}: {
  searchParams: { view?: "user" | "contributor" | "business" };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  // Determine the current workspace view from the URL, defaulting to 'user'
  const currentView = searchParams?.view || "user";

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      `
      full_name, username, bio,
      wants_review_replies_notifications,
      wants_new_follower_notifications,
      wants_weekly_digest_notifications,
      is_profile_public,
      prefers_anonymous_reviews,
      contributors ( portfolio_url, specialties )
    `
    )
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    console.error("Error fetching full profile:", error);
    notFound();
  }

  // Merge nested data for easier use in forms
  const mergedProfileData = {
    ...profile,
    ...(profile.contributors && Array.isArray(profile.contributors)
      ? profile.contributors[0]
      : {}),
  };

  // ✅ FIX: Determine which tabs to show based on the current workspace view
  const showContributorTabs = currentView === "contributor";
  // Future: Add a similar check for business-specific tabs if they exist
  // const showBusinessTabs = currentView === 'business';

  const hasPassword = user.app_metadata.providers.includes("password");

  // Define tab structures
  const userTabs = [
    { value: "profile", label: "Profile" },
    { value: "security", label: "Security" },
    { value: "notifications", label: "Notifications" },
    { value: "privacy", label: "Privacy" },
  ];

  const contributorTabs = [
    ...userTabs.slice(0, 1), // Profile tab
    { value: "contributor", label: "Contributor" },
    { value: "showcase", label: "Showcase" },
    ...userTabs.slice(1), // Security, Notifications, Privacy tabs
  ];

  const businessTabs = userTabs; // Business view currently shows the same tabs as user view

  let activeTabs;
  switch (currentView) {
    case "contributor":
      activeTabs = contributorTabs;
      break;
    case "business":
      activeTabs = businessTabs;
      break;
    default:
      activeTabs = userTabs;
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-gray-900">Account Settings</h1>
        <p className="mt-2 text-lg text-gray-600">
          Manage your profile, security, notifications, and privacy preferences.
        </p>
      </header>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className={`grid w-full grid-cols-${activeTabs.length}`}>
          {activeTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* --- Tab Content Sections --- */}
        <TabsContent value="profile">
          <div className="bg-white p-8 rounded-lg border mt-6">
            <h3 className="text-2xl font-semibold">Public Profile</h3>
            <p className="mt-1 text-gray-500">
              This information will be displayed on your public profile.
            </p>
            <div className="mt-8">
              <ProfileSettingsForm profile={mergedProfileData} />
            </div>
          </div>
        </TabsContent>

        {showContributorTabs && (
          <>
            <TabsContent value="contributor">
              <div className="bg-white p-8 rounded-lg border mt-6">
                <h3 className="text-2xl font-semibold">Contributor Profile</h3>
                <p className="mt-1 text-gray-500">
                  Information specific to your public contributor page.
                </p>
                <div className="mt-8">
                  <ContributorProfileForm profile={mergedProfileData} />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="showcase">
              <div className="bg-white p-8 rounded-lg border mt-6">
                <ShowcaseSettings username={profile.username} />
              </div>
            </TabsContent>
          </>
        )}

        <TabsContent value="security">
          <div className="bg-white p-8 rounded-lg border mt-6">
            <h3 className="text-2xl font-semibold">
              {hasPassword ? "Change Your Password" : "Set a Password"}
            </h3>
            <p className="mt-1 text-gray-500">
              {hasPassword
                ? "Update your password here."
                : "Add a password for an alternative way to log in."}
            </p>
            <SecuritySettings hasPassword={hasPassword} />
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="bg-white p-8 rounded-lg border mt-6">
            <h3 className="text-2xl font-semibold">Email Notifications</h3>
            <p className="mt-1 text-gray-500">
              Choose what emails you want to receive.
            </p>
            <div className="mt-8">
              <NotificationSettingsForm profile={mergedProfileData} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="privacy">
          <div className="bg-white p-8 rounded-lg border mt-6">
            <h3 className="text-2xl font-semibold">Privacy & Data</h3>
            <p className="mt-1 text-gray-500">
              Manage your public presence and account data.
            </p>
            <div className="mt-8">
              <PrivacySettingsForm profile={mergedProfileData} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
