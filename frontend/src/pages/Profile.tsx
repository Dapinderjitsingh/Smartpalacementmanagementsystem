import { Navbar } from "@/components/landing/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import API_BASE_URL from "@/lib/api";

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const profilePic =
    user.profilePic && user.profilePic.startsWith("http")
      ? user.profilePic
      : `${API_BASE_URL.replace("/api", "")}${user.profilePic || ""}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-10">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profilePic} />
              <AvatarFallback>{user.name.slice(0, 1).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-muted-foreground text-sm">{user.email}</p>
              <p className="text-sm mt-1 capitalize">Role: {user.role}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
