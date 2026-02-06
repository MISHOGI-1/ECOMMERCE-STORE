"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/Layout";
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave, FiEdit2 } from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface UserProfile {
  name: string;
  nickname: string;
  email: string;
  phone: string;
  location: string;
  preferences: string[];
  favoriteStyles: string[];
  address: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

const styleOptions = [
  "Casual",
  "Formal",
  "Streetwear",
  "Athletic",
  "Vintage",
  "Minimalist",
  "Bold & Edgy",
  "Classic",
  "Trendy",
  "Comfortable",
];

const preferenceOptions = [
  "New Arrivals",
  "Sale Items",
  "Premium Quality",
  "Sustainable Fashion",
  "Limited Edition",
  "Customizable Items",
];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    nickname: "",
    email: "",
    phone: "",
    location: "",
    preferences: [],
    favoriteStyles: [],
    address: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "UK",
    },
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (session) {
      fetchProfile();
    }
  }, [session, status, router]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/account/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile({
          name: data.name || "",
          nickname: data.nickname || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          preferences: data.preferences ? JSON.parse(data.preferences) : [],
          favoriteStyles: data.favoriteStyles ? JSON.parse(data.favoriteStyles) : [],
          address: data.address || {
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            zipCode: "",
            country: "UK",
          },
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          nickname: profile.nickname,
          phone: profile.phone,
          location: profile.location,
          preferences: JSON.stringify(profile.preferences),
          favoriteStyles: JSON.stringify(profile.favoriteStyles),
          address: profile.address,
        }),
      });

      if (res.ok) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const togglePreference = (pref: string) => {
    if (!isEditing) return;
    setProfile((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter((p) => p !== pref)
        : [...prev.preferences, pref],
    }));
  };

  const toggleStyle = (style: string) => {
    if (!isEditing) return;
    setProfile((prev) => ({
      ...prev,
      favoriteStyles: prev.favoriteStyles.includes(style)
        ? prev.favoriteStyles.filter((s) => s !== style)
        : [...prev.favoriteStyles, style],
    }));
  };

  if (status === "loading" || loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <FiEdit2 className="w-5 h-5" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  fetchProfile();
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <FiSave className="w-5 h-5" />
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FiUser className="mr-2 text-primary-600" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nickname
                </label>
                <input
                  type="text"
                  value={profile.nickname}
                  onChange={(e) =>
                    setProfile({ ...profile, nickname: e.target.value })
                  }
                  disabled={!isEditing}
                  placeholder="Your preferred nickname"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiMail className="mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email || session?.user?.email || ""}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiPhone className="mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  disabled={!isEditing}
                  placeholder="+44 123 456 7890"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiMapPin className="mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) =>
                    setProfile({ ...profile, location: e.target.value })
                  }
                  disabled={!isEditing}
                  placeholder="City, Country"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Customer Preferences
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Select your shopping preferences to get personalized recommendations
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {preferenceOptions.map((pref) => (
                <button
                  key={pref}
                  onClick={() => togglePreference(pref)}
                  disabled={!isEditing}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    profile.preferences.includes(pref)
                      ? "bg-primary-100 border-primary-600 text-primary-700 font-semibold"
                      : "bg-white border-gray-300 text-gray-700 hover:border-primary-300"
                  } ${!isEditing ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Favorite Styles
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Choose your favorite fashion styles to help us recommend products you&apos;ll love
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {styleOptions.map((style) => (
                <button
                  key={style}
                  onClick={() => toggleStyle(style)}
                  disabled={!isEditing}
                  className={`px-4 py-2 rounded-lg border-2 transition-all text-sm ${
                    profile.favoriteStyles.includes(style)
                      ? "bg-primary-100 border-primary-600 text-primary-700 font-semibold"
                      : "bg-white border-gray-300 text-gray-700 hover:border-primary-300"
                  } ${!isEditing ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                >
                  {style}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Address Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  value={profile.address.addressLine1}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      address: {
                        ...profile.address,
                        addressLine1: e.target.value,
                      },
                    })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={profile.address.addressLine2}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      address: {
                        ...profile.address,
                        addressLine2: e.target.value,
                      },
                    })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={profile.address.city}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      address: {
                        ...profile.address,
                        city: e.target.value,
                      },
                    })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State/County *
                </label>
                <input
                  type="text"
                  value={profile.address.state}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      address: {
                        ...profile.address,
                        state: e.target.value,
                      },
                    })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP/Postal Code *
                </label>
                <input
                  type="text"
                  value={profile.address.zipCode}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      address: {
                        ...profile.address,
                        zipCode: e.target.value,
                      },
                    })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  value={profile.address.country}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      address: {
                        ...profile.address,
                        country: e.target.value,
                      },
                    })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

