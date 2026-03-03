import { useLanguage } from '../i18n/LanguageContext';
import { MdDashboard, MdPerson, MdSmartToy, MdDescription, MdCalendarMonth, MdEditNote } from 'react-icons/md';

const TABS = [
  { id: 'overview',  icon: MdDashboard, labelKey: 'overview' },
  { id: 'profile',   icon: MdPerson, labelKey: 'profile' },
  { id: 'queries',   icon: MdSmartToy, labelKey: 'savedQueries' },
  { id: 'documents', icon: MdDescription, labelKey: 'myDocuments' },
  { id: 'bookings',  icon: MdCalendarMonth, labelKey: 'bookingHistory' },
  { id: 'generator', icon: MdEditNote, labelKey: 'generateDocument' },
];

export default function DashboardSidebar({ activeTab, onTabChange, collapsed }) {
  const { t } = useLanguage();

  return (
    <nav className={`dashboard-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`sidebar-item ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="sidebar-icon"><tab.icon size={18} /></span>
          <span>{t(tab.labelKey)}</span>
        </button>
      ))}
    </nav>
  );
}
