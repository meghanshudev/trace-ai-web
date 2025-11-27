import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Mail, User, Phone, MapPin, Calendar, Save, Check } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { UserProfile } from '../types';
import { updateProfile } from '../services/user';

interface ProfileScreenProps {
  user: UserProfile | null;
  onBack: () => void;
  onProfileUpdate: () => void;
}

export function ProfileScreen({ user, onBack, onProfileUpdate }: ProfileScreenProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: 'Product designer focused on creating beautiful and functional experiences.',
    joinDate: 'January 2024',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        ...profileData,
        name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        full_name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        location: profileData.location,
      });
      setIsSaved(true);
      onProfileUpdate();
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error) {
      console.error('Failed to update profile', error);
      // Optionally, show an error message to the user
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoChange = () => {
    // In real app, this would open file picker
    console.log('Opening file picker...');
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-8 space-y-6">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-6"
      >
        <motion.button
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="size-10 rounded-full bg-[#1e1e1e] border border-[#333333] flex items-center justify-center hover:border-[#8a70d6] transition-colors"
        >
          <ArrowLeft className="size-5 text-[#b3b3b3]" />
        </motion.button>
        <div className="flex-1">
          <h1 className="text-white">Edit Profile</h1>
          <p className="text-[#b3b3b3]">Update your personal information</p>
        </div>
      </motion.header>

      {/* Profile Photo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] border-[#333333]">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="size-24 rounded-2xl bg-gradient-to-br from-[#8a70d6] to-[#6a56b1] flex items-center justify-center shadow-2xl shadow-[#8a70d6]/30">
                <User className="size-12 text-white" strokeWidth={2} />
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePhotoChange}
                className="absolute -bottom-2 -right-2 size-10 rounded-full bg-gradient-to-r from-[#8a70d6] to-[#6a56b1] border-2 border-[#1e1e1e] flex items-center justify-center shadow-lg"
              >
                <Camera className="size-5 text-white" strokeWidth={2} />
              </motion.button>
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-1">{profileData.name}</h3>
              <p className="text-[#b3b3b3] text-sm mb-2">{profileData.email}</p>
              <div className="flex items-center gap-2 text-[#b3b3b3] text-sm">
                <Calendar className="size-4" strokeWidth={2} />
                <span>Joined {profileData.joinDate}</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Basic Information */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-white mb-4">Basic Information</h2>
        <Card className="p-5 bg-[#1e1e1e] border-[#333333] space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-[#b3b3b3] text-sm mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#b3b3b3]" strokeWidth={2} />
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-[#121212] border border-[#333333] rounded-xl text-white placeholder:text-[#b3b3b3] focus:border-[#8a70d6] focus:outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[#b3b3b3] text-sm mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#b3b3b3]" strokeWidth={2} />
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-[#121212] border border-[#333333] rounded-xl text-white placeholder:text-[#b3b3b3] focus:border-[#8a70d6] focus:outline-none transition-colors"
                placeholder="john.doe@example.com"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[#b3b3b3] text-sm mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#b3b3b3]" strokeWidth={2} />
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-[#121212] border border-[#333333] rounded-xl text-white placeholder:text-[#b3b3b3] focus:border-[#8a70d6] focus:outline-none transition-colors"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-[#b3b3b3] text-sm mb-2">Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#b3b3b3]" strokeWidth={2} />
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-[#121212] border border-[#333333] rounded-xl text-white placeholder:text-[#b3b3b3] focus:border-[#8a70d6] focus:outline-none transition-colors"
                placeholder="San Francisco, CA"
              />
            </div>
          </div>
        </Card>
      </motion.section>

      {/* Bio */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-white mb-4">About</h2>
        <Card className="p-5 bg-[#1e1e1e] border-[#333333]">
          <label className="block text-[#b3b3b3] text-sm mb-2">Bio</label>
          <textarea
            value={profileData.bio}
            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 bg-[#121212] border border-[#333333] rounded-xl text-white placeholder:text-[#b3b3b3] focus:border-[#8a70d6] focus:outline-none transition-colors resize-none"
            placeholder="Tell us about yourself..."
          />
          <p className="text-[#b3b3b3] text-xs mt-2">
            {profileData.bio.length}/200 characters
          </p>
        </Card>
      </motion.section>

      {/* Account Stats */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-white mb-4">Activity</h2>
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 bg-gradient-to-br from-[#8a70d6]/10 to-[#6a56b1]/10 border-[#8a70d6]/30 text-center">
            <p className="text-white text-2xl mb-1">24</p>
            <p className="text-[#b3b3b3] text-sm">Tasks Done</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-[#8a70d6]/10 to-[#6a56b1]/10 border-[#8a70d6]/30 text-center">
            <p className="text-white text-2xl mb-1">7</p>
            <p className="text-[#b3b3b3] text-sm">Day Streak</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-[#8a70d6]/10 to-[#6a56b1]/10 border-[#8a70d6]/30 text-center">
            <p className="text-white text-2xl mb-1">5</p>
            <p className="text-[#b3b3b3] text-sm">Apps Connected</p>
          </Card>
        </div>
      </motion.section>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="sticky bottom-6"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleSave}
            disabled={isSaving || isSaved}
            className="w-full bg-gradient-to-r from-[#8a70d6] to-[#6a56b1] hover:from-[#b4a6e8] hover:to-[#8a70d6] text-white border-0 py-6 shadow-2xl shadow-[#8a70d6]/30 disabled:opacity-50"
          >
            {isSaved ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2"
              >
                <Check className="size-5" strokeWidth={2} />
                <span>Changes Saved!</span>
              </motion.div>
            ) : isSaving ? (
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Save className="size-5" strokeWidth={2} />
                </motion.div>
                <span>Saving...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="size-5" strokeWidth={2} />
                <span>Save Changes</span>
              </div>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
