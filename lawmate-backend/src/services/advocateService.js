const User = require('../models/User');
const AdvocateProfile = require('../models/AdvocateProfile');

/* -------------------- List Advocates -------------------- */

exports.list = async (filters = {}) => {
  const { specialization, minExperience, available, sortBy, searchQuery } = filters;

  const profileFilter = {};

  if (specialization) {
    profileFilter.specialization = { $in: [specialization] };
  }

  if (minExperience) {
    profileFilter.experience = { $gte: Number(minExperience) };
  }

  if (available !== undefined) {
    profileFilter.isAvailable = available === 'true';
  }

  // Text search optimization (if needed later, ensuring indexing)
  // if (searchQuery) ...

  let profiles = await AdvocateProfile.find(profileFilter)
    .populate({
      path: 'user',
      select: 'name email phone isAdvocateVerified',
      match: { isAdvocateVerified: true }
    })
    .lean();

  // Remove profiles where the user doesn't match `isAdvocateVerified: true` (which populate sets to null)
  profiles = profiles.filter(p => p.user !== null);

  // Smart Ranking Logic
  profiles = profiles.map(p => {
    let score = 0;

    // 1. Experience Weight (1.5 points per year, max 30)
    score += Math.min((p.experience || 0) * 1.5, 30);

    // 2. Rating Weight (20 points per star, max 100)
    score += (p.rating || 0) * 20;

    // 3. Specialization Match (High Priority)
    // If user filtered by specialization, it's already exact match.
    // However, if we're ranking for a specific query later, we can boost matches.
    if (specialization && Array.isArray(p.specialization) && p.specialization.includes(specialization)) {
      score += 50; 
    }
    
    // 4. Availability Boost
    if (p.isAvailable) score += 10;

    return { ...p, score };
  });

  // Sorting
  if (sortBy === 'rating') {
    profiles.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'experience') {
    profiles.sort((a, b) => b.experience - a.experience);
  } else {
    // Default: Smart Sort (Score)
    profiles.sort((a, b) => b.score - a.score);
  }

  return profiles;
};


/* -------------------- Get Advocate Profile -------------------- */

exports.getProfile = async (userId) => {
  const profile = await AdvocateProfile.findOne({ user: userId })
    .populate('user', 'name email phone')
    .lean();

  if (!profile) {
    // Return an empty profile template instead of throwing an error 
    // so new advocates can access their dashboard and create one.
    return {
       user: userId,
       bio: '',
       specialization: [],
       experience: 0,
       barCouncilNumber: '',
       hourlyRate: 0,
       isAvailable: false,
       location: '',
       rating: 0,
       reviewCount: 0
    };
  }

  return profile;
};

/* -------------------- Create or Update Profile -------------------- */

exports.upsertProfile = async (userId, body) => {

  const user = await User.findById(userId);

  if (!user || user.role !== 'advocate') {
    const e = new Error("Only advocates can create or update profile");
    e.statusCode = 403;
    throw e;
  }

  let profile = await AdvocateProfile.findOne({ user: userId });

  const updateData = {};

  const allowedFields = [
    'bio',
    'specialization',
    'experience',
    'barCouncilNumber',
    'hourlyRate',
    'isAvailable',
    'location'
  ];

  allowedFields.forEach(field => {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  });

  if (profile) {
    Object.assign(profile, updateData);
    await profile.save();
  } else {
    profile = await AdvocateProfile.create({
      user: userId,
      ...updateData
    });
  }

  return profile;
};

/* -------------------- Update Profile Picture -------------------- */

exports.updateProfilePicture = async (userId, dataUrl) => {
  let profile = await AdvocateProfile.findOne({ user: userId });

  if (profile) {
    profile.profilePicture = dataUrl;
    await profile.save();
  } else {
    profile = await AdvocateProfile.create({
      user: userId,
      profilePicture: dataUrl
    });
  }

  return profile;
};
