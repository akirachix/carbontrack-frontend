
"use client";

import { useRouter } from "next/navigation";
import { User as UserIcon, Mail, PhoneCallIcon, Edit2 } from "lucide-react";
import useFetchUsers from "@/app/hooks/useFetchProfile";
import Image from "next/image";

export default function ProfileDisplay() {
  const router = useRouter();
  const { user: profile, error } = useFetchUsers();

  if (error) return <div className="mt-32 text-center text-red-500">{error}</div>;
if (!profile) return null;

const getProfileRoute = () => {
  return profile.user_type === "factory" ? "/edit-factory-profile" : "/ktda-edit-profile";
};


  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-20 xl:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl mt-15 font-bold mb-2">Profile</h1>
          <div className="w-32 h-1 bg-[#F79B72] rounded" />
        </div>
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col md:flex-row gap-8 relative">
       
          <div className="md:w-1/3 flex flex-col items-center relative">
            <div className="w-64 h-64 rounded-full border-4 border-[#F79B72] flex items-center justify-center overflow-hidden bg-gray-700 mx-auto relative">
              {profile.profile_image ? (
                <Image
                  src={profile.profile_image}
                  alt="Profile"
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-400">
                  <UserIcon className="w-24 h-24" />
                </div>
              )}
            </div>
            <button
              onClick={() => router.push(getProfileRoute())}
              className="absolute bottom-20 right-18 lg:right-10 bg-[#F79B72] text-black w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-[#F3FBFD] transition-all"
              aria-label="Edit Profile"
              type="button"
            >
              <Edit2 className="w-6 h-6" />
            </button>
          </div>
          <div className="md:w-2/3">
            <div className="bg-gray-700 rounded-xl p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-gray-800 p-3 rounded-full">
                  <UserIcon className="w-6 h-6 text-[#F79B72]" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Full Name</p>
                  <p className="text-xl font-medium">{profile.first_name} {profile.last_name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-gray-800 p-3 rounded-full">
                  <Mail className="w-6 h-6 text-[#F79B72]" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email Address</p>
                  <p className="text-xl font-medium break-words">{profile.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-gray-800 p-3 rounded-full">
                  <PhoneCallIcon className="w-6 h-6 text-[#F79B72]" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Phone Number</p>
                  <p className="text-xl font-medium break-words">{profile.phone_number}</p>
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => router.push(getProfileRoute())}
                  className="px-6 py-3 bg-[#F79B72] text-black rounded-lg font-medium hover:bg-[#F3FBFD] transition flex items-center gap-2 cursor-pointer">
                  <Edit2 className="w-5 h-5" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}