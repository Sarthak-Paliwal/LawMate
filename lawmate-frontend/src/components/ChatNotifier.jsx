/**
 * ChatNotifier — mounts once globally in App.jsx
 * Listens for new socket messages across ALL accepted bookings
 * and fires a toast notification when the user isn't looking at that chat.
 */
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useGetBookingsQuery } from '../store/services/lawmateApi';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function ChatNotifier({ activeChatBookingId }) {
  const { user } = useAuth();
  const { data: bookings = [] } = useGetBookingsQuery(undefined, { skip: !user });
  const socketRef = useRef(null);
  const joinedRooms = useRef(new Set());

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('lawmate-token');
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      forceNew: true, // Dedicated connection for notifications
    });

    socketRef.current = socket;

    const handleConnect = () => {
      // Join all accepted/completed booking rooms to receive notifications
      bookings
        .filter(b => ['accepted'].includes(b.status))
        .forEach(b => {
          if (!joinedRooms.current.has(b._id)) {
            socket.emit('join-room', b._id);
            joinedRooms.current.add(b._id);
          }
        });
    };

    if (socket.connected) {
      handleConnect();
    }
    socket.on('connect', handleConnect);

    socket.on('new-message', (msg) => {
      const senderId =
        typeof msg.sender === 'object'
          ? msg.sender?._id?.toString()
          : msg.sender?.toString();

      // Only notify if the message is FROM the OTHER person
      if (senderId === user._id?.toString()) return;

      const bookingId = msg.booking?.toString() || msg.booking;

      // Only notify if the chat window for this booking is NOT currently open
      if (activeChatBookingId && activeChatBookingId === bookingId) return;

      const senderName =
        typeof msg.sender === 'object' ? msg.sender?.name : 'Someone';

      toast.custom(
        (t) => (
          <div
            className={`flex items-start gap-3 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/60 shadow-xl rounded-2xl px-4 py-3 max-w-xs transition-all ${
              t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
            style={{ transition: 'all 0.3s ease' }}
          >
            <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm flex-shrink-0">
              💬
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">New Message</p>
              <p className="text-sm font-semibold text-default truncate">{senderName}</p>
              <p className="text-xs text-muted mt-0.5 truncate">{msg.text}</p>
            </div>
          </div>
        ),
        { duration: 5000, position: 'bottom-right' }
      );
    });

    return () => {
      socket.disconnect();
      joinedRooms.current.clear();
    };
  // Re-run when bookings list changes so new accepted bookings get joined
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, bookings.length]);

  return null;
}
