import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const lawmateApi = createApi({
  reducerPath: 'lawmateApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('lawmate-token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),

  tagTypes: ['Me', 'AdvocateProfile', 'AdvocateList', 'Bookings', 'Queries', 'Documents', 'LegalActs', 'AdminPending'],

  endpoints: (builder) => ({

    /* ───────── Auth ───────── */

    getMe: builder.query({
      query: () => '/auth/me',
      transformResponse: (res) => res.data,
      providesTags: ['Me'],
    }),

    login: builder.mutation({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      transformResponse: (res) => res.data,
      invalidatesTags: ['Me', 'AdvocateProfile'],
    }),

    register: builder.mutation({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
      transformResponse: (res) => res.data,
      invalidatesTags: ['Me'],
    }),

    uploadProfileImage: builder.mutation({
      query: (formData) => ({ url: '/auth/profile-image', method: 'POST', body: formData }),
      transformResponse: (res) => res.data,
      invalidatesTags: ['Me'],
    }),

    uploadIdProof: builder.mutation({
      query: (formData) => ({ url: '/auth/upload-id-proof', method: 'POST', body: formData }),
      transformResponse: (res) => res.data,
      invalidatesTags: ['Me'],
    }),

    /* ───────── Advocate Profile ───────── */

    getMyAdvocateProfile: builder.query({
      query: () => '/advocates/profile',
      transformResponse: (res) => res.data,
      providesTags: ['AdvocateProfile'],
    }),

    updateAdvocateProfile: builder.mutation({
      query: (body) => ({ url: '/advocates/profile', method: 'PUT', body }),
      transformResponse: (res) => res.data,
      invalidatesTags: ['AdvocateProfile', 'AdvocateList'],
    }),

    uploadAdvocateProfilePicture: builder.mutation({
      query: (formData) => ({ url: '/advocates/profile/picture', method: 'PUT', body: formData }),
      transformResponse: (res) => res.data,
      invalidatesTags: ['AdvocateProfile', 'Me'],
    }),

    /* ───────── Advocates Directory ───────── */

    getAdvocates: builder.query({
      query: (params = {}) => ({ url: '/advocates', params }),
      transformResponse: (res) => res.data,
      providesTags: ['AdvocateList'],
    }),

    /* ───────── Bookings ───────── */

    getBookings: builder.query({
      query: () => '/bookings',
      transformResponse: (res) => res.data,
      providesTags: ['Bookings'],
    }),

    createBooking: builder.mutation({
      query: ({ advocateId, message }) => ({
        url: `/bookings/${advocateId}`,
        method: 'POST',
        body: { message },
      }),
      invalidatesTags: ['Bookings'],
    }),

    updateBookingStatus: builder.mutation({
      query: ({ bookingId, status }) => ({
        url: `/bookings/${bookingId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Bookings'],
    }),

    rateBooking: builder.mutation({
      query: ({ bookingId, rating }) => ({
        url: `/bookings/${bookingId}/rate`,
        method: 'POST',
        body: { rating },
      }),
      invalidatesTags: ['Bookings'],
    }),

    /* ───────── Queries (Legal Chat) ───────── */

    getQueries: builder.query({
      query: () => '/queries',
      transformResponse: (res) => res.data,
      providesTags: ['Queries'],
    }),

    createQuery: builder.mutation({
      query: (body) => ({ url: '/queries', method: 'POST', body }),
      transformResponse: (res) => res.data,
      invalidatesTags: ['Queries'],
    }),

    deleteQuery: builder.mutation({
      query: (id) => ({ url: `/queries/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Queries'],
    }),

    analyzeQuery: builder.mutation({
      query: (formData) => ({ url: '/queries/analyze', method: 'POST', body: formData }),
      transformResponse: (res) => res.data,
    }),

    /* ───────── Documents ───────── */

    getMyDocuments: builder.query({
      query: () => '/documents/my-documents',
      transformResponse: (res) => res.data,
      providesTags: ['Documents'],
    }),

    getDocumentTemplates: builder.query({
      query: () => '/documents/templates',
      transformResponse: (res) => res.data,
    }),

    generateDocument: builder.mutation({
      query: (body) => ({ url: '/documents/generate', method: 'POST', body }),
      transformResponse: (res) => res.data,
      invalidatesTags: ['Documents'],
    }),

    deleteDocument: builder.mutation({
      query: (id) => ({ url: `/documents/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Documents'],
    }),

    /* ───────── Legal Acts ───────── */

    getLegalActCategories: builder.query({
      query: () => '/legal-acts/categories',
      transformResponse: (res) => res.data,
      providesTags: ['LegalActs'],
    }),

    getLegalActs: builder.query({
      query: (params = {}) => ({ url: '/legal-acts', params }),
      transformResponse: (res) => res.data,
      providesTags: ['LegalActs'],
    }),

    getLegalActById: builder.query({
      query: (id) => `/legal-acts/${id}`,
      transformResponse: (res) => res.data,
    }),

    /* ───────── Admin ───────── */

    getPendingAdvocates: builder.query({
      query: () => '/admin/pending-advocates',
      transformResponse: (res) => res.data,
      providesTags: ['AdminPending'],
    }),

    verifyAdvocate: builder.mutation({
      query: ({ id, action }) => ({
        url: `/admin/verify-advocate/${id}`,
        method: 'POST',
        body: { action },
      }),
      invalidatesTags: ['AdminPending', 'AdvocateList'],
    }),

  }),
});

export const {
  // Auth
  useGetMeQuery,
  useLoginMutation,
  useRegisterMutation,
  useUploadProfileImageMutation,
  useUploadIdProofMutation,
  // Advocate profile
  useGetMyAdvocateProfileQuery,
  useUpdateAdvocateProfileMutation,
  useUploadAdvocateProfilePictureMutation,
  // Advocates directory
  useGetAdvocatesQuery,
  // Bookings
  useGetBookingsQuery,
  useCreateBookingMutation,
  useUpdateBookingStatusMutation,
  useRateBookingMutation,
  // Queries
  useGetQueriesQuery,
  useCreateQueryMutation,
  useDeleteQueryMutation,
  useAnalyzeQueryMutation,
  // Documents
  useGetMyDocumentsQuery,
  useGetDocumentTemplatesQuery,
  useGenerateDocumentMutation,
  useDeleteDocumentMutation,
  // Legal Acts
  useGetLegalActCategoriesQuery,
  useGetLegalActsQuery,
  useGetLegalActByIdQuery,
  // Admin
  useGetPendingAdvocatesQuery,
  useVerifyAdvocateMutation,
} = lawmateApi;
