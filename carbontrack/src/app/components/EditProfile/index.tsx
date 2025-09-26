"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useFetchUsers from "@/app/hooks/useFetchProfile";
import { updateUser } from "@/app/utils/fetchProfile";
import { CameraIcon, Eye, EyeOff } from "lucide-react";
import Button from "@/app/sharedComponents/Button";
import Image from "next/image";

interface ProfileFormData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  profile_image: File | null;
  user_type: string;
  phone_number: string;
}

type ProfileUpdatePayload = {
  email: string;
  first_name: string;
  last_name: string;
  password?: string;
  role: string;
};

export default function EditProfilePage() {
  const router = useRouter();
  const { user: profile, error } = useFetchUsers();
  
 
  const getProfileRoute = () => {
    return formData.user_type === "factory" ? "/factory-profile" : "/ktda-profile";
  };
  
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    profile_image: null,
    user_type: "",
    phone_number: "",
  });

  
  useEffect(() => {
    if (profile) {
      setFormData({
        email: profile.email || "",
        password: "",
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        profile_image: null,
        user_type: profile.user_type || "",
        phone_number: profile.phone_number || "",
      });
    }
  }, [profile]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    
    if (type === "file" && files && files[0]) {
      const file = files[0];
      setProfileImage(file);
      setFormData((prev) => ({ ...prev, profile_image: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError(null);
    setIsSubmitting(true);
    setUpdateSuccess(false);

    const { email, first_name: firstName, last_name: lastName, password } = formData;

    
    if (!email) {
      setUpdateError("Email is required.");
      setIsSubmitting(false);
      return;
    }
    if (!firstName) {
      setUpdateError("First name is required.");
      setIsSubmitting(false);
      return;
    }
    if (!lastName) {
      setUpdateError("Last name is required.");
      setIsSubmitting(false);
      return;
    }

    
    let dataToSend: FormData | ProfileUpdatePayload;
    
    if (profileImage) {
      const form = new FormData();
      form.append("email", email);
      form.append("first_name", firstName);
      form.append("last_name", lastName);
      if (password) form.append("password", password);
      form.append("profile_image", profileImage);
      form.append("role", "manager");
      dataToSend = form;
    } else {
      dataToSend = {
        email,
        first_name: firstName,
        last_name: lastName,
        ...(password && { password }),
        role: "manager",
      };
    }

    try {
      await updateUser(dataToSend);
      setUpdateSuccess(true);
      setIsSubmitting(false);
      setTimeout(() => {
        router.push(getProfileRoute());
      }, 2000);
    } catch (error) {
      setUpdateError((error as Error).message || "Error updating profile.");
      setIsSubmitting(false);
    }
  };

  if (error) return <div className="mt-32 text-center text-red-500">{error}</div>;
  if (!profile) return null;

  return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-20">
        <div className="max-w-6xl mx-auto">
          
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-2">Edit Profile</h1>
            <div className="w-32 h-1 bg-[#F79B72] rounded" />
          </div>
          
          <div className="flex flex-col md:flex-row gap-10 bg-blend-multiply bg-gray-800 rounded-2xl shadow-xl p-8 relative">
            
            <div className="md:w-1/3 flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-64 h-64 rounded-full border-4 border-[#F79B72] flex items-center justify-center overflow-hidden bg-gray-700">
                  {profileImage ? (
                    <Image
                      src={URL.createObjectURL(profileImage)}
                      alt="Profile"
                      style={{ objectFit: "cover" , borderRadius: "50%" }}
                      priority
                      fill
                    />
                  ) : profile.profile_image ? (
                    <Image
                      src={profile.profile_image}
                      alt="Current Profile"
                      fill
                      style={{ objectFit: "cover", borderRadius: "50%" }}
                      priority
                    />
                  ) : (
                    <Image
                      src="/Images/image 4.png"
                      alt="Default Profile"
                      fill
                      style={{ objectFit: "cover" }}
                      priority
                    />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => document.getElementById("profileInput")?.click()}
                  className="absolute bottom-4 right-4 bg-[#F79B72] text-black w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-[#F3FBFD] transition-all"
                  aria-label="Upload profile picture"
                >
                  <CameraIcon className="w-6 h-6" />
                </button>
                <input
                  id="profileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </div>
              {formData.first_name && (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-[#F79B72] mb-1">
                    {formData.first_name} {formData.last_name}
                  </h2>
                  <p className="text-gray-400">{formData.user_type}</p>
                </div>
              )}
            </div>

            
            <div className="md:w-2/3">
              {updateError && (
                <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
                  {updateError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div>
                    <label className="block text-gray-300 mb-2">First Name *</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F79B72] text-white"
                      placeholder="First Name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F79B72] text-white"
                      placeholder="Last Name"
                    />
                  </div>
                  
                
                  <div>
                    <label className="block text-gray-300 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F79B72] text-white"
                      placeholder="Phone Number"
                    />
                  </div>
                  
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F79B72] text-white"
                      placeholder="Email"
                    />
                  </div>
                  
                
                  <div>
                    <label className="block text-gray-300 mb-2">Role</label>
                    <input
                      type="text"
                      name="user_type"
                      value={formData.user_type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F79B72] text-white"
                      placeholder="User Type"
                      readOnly
                    />
                  </div>
                  
                  
                  <div>
                    <label className="block text-gray-300 mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter new password"
                        autoComplete="new-password"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F79B72] text-white pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#F79B72] hover:text-white focus:outline-none"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => router.push(getProfileRoute())}
                    className="px-6 py-2 border border-[#F79B72] text-[#F79B72] rounded-lg font-medium hover:bg-gray-700 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    variant="update"
                    type="submit"
                    buttonText={isSubmitting ? "updating..." : "Update Profile"}
                  />
                </div>
                
                
                {updateSuccess && (
                  <div className="mt-2 flex justify-end text-white font-semibold">
                    Profile updated successfully
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
  );
}