import { useState, useEffect } from 'react';

// ============================================
// CATCHBOARD v8 - Enhanced UX
// ============================================

const AUSTRALIAN_STATES = ['VIC', 'NSW', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'];

const POSTCODE_DATA = {
  '3000': { city: 'Melbourne', state: 'VIC' },
  '3395': { city: 'Beulah', state: 'VIC' },
  '3500': { city: 'Mildura', state: 'VIC' },
  '3550': { city: 'Bendigo', state: 'VIC' },
  '3350': { city: 'Ballarat', state: 'VIC' },
  '3630': { city: 'Shepparton', state: 'VIC' },
  '3850': { city: 'Sale', state: 'VIC' },
  '2000': { city: 'Sydney', state: 'NSW' },
  '2600': { city: 'Canberra', state: 'ACT' },
  '2640': { city: 'Albury', state: 'NSW' },
  '4000': { city: 'Brisbane', state: 'QLD' },
  '4670': { city: 'Bundaberg', state: 'QLD' },
  '4740': { city: 'Mackay', state: 'QLD' },
  '5000': { city: 'Adelaide', state: 'SA' },
  '6000': { city: 'Perth', state: 'WA' },
  '7000': { city: 'Hobart', state: 'TAS' },
  '0800': { city: 'Darwin', state: 'NT' },
};

const FISH_SPECIES_LIST = [
  { id: 1, name: 'Murray Cod', slang: ['Coddy', 'Goodoo', 'Green Fish'], native: true },
  { id: 2, name: 'Golden Perch', slang: ['Yellowbelly', 'Callop', 'Murray Perch'], native: true },
  { id: 3, name: 'Silver Perch', slang: ['Bidyan', 'Grunter', 'Black Bream', 'Silver Bream'], native: true },
  { id: 4, name: 'Trout Cod', slang: ['Bluenose Cod', 'Rock Cod'], native: true },
  { id: 5, name: 'Australian Bass', slang: ['Bass', 'Freshwater Perch'], native: true },
  { id: 6, name: 'Barramundi', slang: ['Barra', 'Giant Perch'], native: true },
  { id: 7, name: 'Sooty Grunter', slang: ['Black Bream', 'Grunter'], native: true },
  { id: 8, name: 'Redfin', slang: ['English Perch', 'European Perch'], native: false },
  { id: 9, name: 'Carp', slang: ['European Carp', 'Common Carp'], native: false },
  { id: 10, name: 'Brown Trout', slang: ['Brownie', 'German Trout'], native: false },
  { id: 11, name: 'Rainbow Trout', slang: ['Rainbow', 'Steelhead'], native: false },
  { id: 12, name: 'Brook Trout', slang: ['Brookie', 'Speckled Trout'], native: false },
  { id: 13, name: 'Freshwater Catfish', slang: ['Catfish', 'Jewfish', 'Tandan'], native: true },
  { id: 14, name: 'Eel-tailed Catfish', slang: ['Tandanus', 'Dewfish'], native: true },
  { id: 15, name: 'Macquarie Perch', slang: ['Maccie', 'Mountain Perch'], native: true },
  { id: 16, name: 'Mary River Cod', slang: ['Mary Cod'], native: true },
  { id: 17, name: 'Spangled Perch', slang: ['Spangled Grunter', 'Bobby Perch'], native: true },
];

const WINNING_CRITERIA = [
  { id: 'longest_cm', name: 'Longest Fish (cm)', description: 'Single longest fish measured in centimeters' },
  { id: 'heaviest_kg', name: 'Heaviest Fish (kg)', description: 'Single heaviest fish weighed in kilograms' },
  { id: 'total_length', name: 'Total Length (cm)', description: 'Combined length of all fish caught' },
  { id: 'total_weight', name: 'Total Weight (kg)', description: 'Combined weight of all fish caught' },
  { id: 'most_fish', name: 'Most Fish Caught', description: 'Total number of fish caught' },
];

const formatDateTime = (date, startTime, endTime) => {
  if (!date) return 'Date not set';
  const d = new Date(date);
  const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
  return `${d.toLocaleDateString('en-AU', options)} • ${startTime || '00:00'} - ${endTime || '00:00'}`;
};

const formatDate = (date) => {
  if (!date) return 'TBD';
  const d = new Date(date);
  return d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });
};

const getMonthYear = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' });
};

const isEventLive = (event) => {
  if (event.status !== 'planned') return false;
  const now = new Date();
  const eventDate = new Date(event.date);
  const [startHour, startMin] = (event.startTime || '00:00').split(':').map(Number);
  const [endHour, endMin] = (event.endTime || '23:59').split(':').map(Number);
  const start = new Date(eventDate); start.setHours(startHour, startMin, 0);
  const end = new Date(eventDate); end.setHours(endHour, endMin, 0);
  return now >= start && now <= end;
};

const getEventStatus = (event) => {
  if (event.status === 'draft') return 'draft';
  if (event.status === 'completed') return 'completed';
  if (isEventLive(event)) return 'live';
  return 'planned';
};

const generateEventCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
};

const styles = {
  app: { minHeight: '100vh', background: 'linear-gradient(180deg, #0c1929 0%, #1a3a5c 50%, #2d5a7b 100%)', fontFamily: "'Outfit', system-ui, sans-serif", color: '#f0f4f8' },
  header: { background: 'rgba(0,0,0,0.3)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 },
  logo: { fontSize: '1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },
  content: { padding: '20px', maxWidth: '800px', margin: '0 auto' },
  card: { background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.1)' },
  cardTitle: { fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' },
  input: { width: '100%', padding: '14px 16px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: '1rem', marginBottom: '12px', boxSizing: 'border-box', outline: 'none' },
  textarea: { width: '100%', padding: '14px 16px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: '1rem', marginBottom: '12px', boxSizing: 'border-box', outline: 'none', minHeight: '100px', resize: 'vertical', fontFamily: 'inherit' },
  select: { width: '100%', padding: '14px 16px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: '1rem', marginBottom: '12px', boxSizing: 'border-box' },
  primaryButton: { width: '100%', padding: '16px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#000', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)' },
  secondaryButton: { width: '100%', padding: '16px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' },
  greenButton: { width: '100%', padding: '16px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: '#fff', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)' },
  statBox: { background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', textAlign: 'center', flex: 1 },
  statNumber: { fontSize: '2rem', fontWeight: '800', color: '#f59e0b' },
  statLabel: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px' },
  hero: { textAlign: 'center', padding: '40px 20px', background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 100%)' },
  heroTitle: { fontSize: '2rem', fontWeight: '800', marginBottom: '8px' },
  heroSubtitle: { fontSize: '1rem', color: 'rgba(255,255,255,0.7)', marginBottom: '24px' },
  tabs: { display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '12px', marginBottom: '20px', overflowX: 'auto' },
  label: { fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px', display: 'block' },
  photoUpload: { border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '12px', padding: '30px 20px', textAlign: 'center', marginBottom: '12px', cursor: 'pointer', background: 'rgba(0,0,0,0.2)' },
  eventCard: { background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' },
  monthHeader: { fontSize: '1rem', fontWeight: '700', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px', marginTop: '24px' },
  navButton: { padding: '6px 12px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: '0.85rem' },
};

const tabStyle = (active) => ({ flex: 1, padding: '12px 8px', borderRadius: '10px', border: 'none', background: active ? '#f59e0b' : 'transparent', color: active ? '#000' : 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' });
const badgeStyle = (type) => ({ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', background: type === 'live' ? 'rgba(239,68,68,0.2)' : type === 'planned' ? 'rgba(34,197,94,0.2)' : type === 'draft' ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.1)', color: type === 'live' ? '#ef4444' : type === 'planned' ? '#22c55e' : type === 'draft' ? '#f59e0b' : '#fff', marginLeft: '8px' });
const smallBadgeStyle = (type) => ({ display: 'inline-block', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: '600', background: type === 'walkup' ? 'rgba(59,130,246,0.2)' : 'rgba(168,85,247,0.2)', color: type === 'walkup' ? '#60a5fa' : '#a78bfa', marginLeft: '8px' });
const filterPillStyle = (active) => ({ padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)', background: active ? '#f59e0b' : 'transparent', color: active ? '#000' : '#fff', fontSize: '0.85rem', fontWeight: '500', cursor: 'pointer' });
const leaderboardItemStyle = (rank) => ({ display: 'flex', alignItems: 'center', padding: '16px', background: rank === 1 ? 'linear-gradient(135deg, rgba(245,158,11,0.3) 0%, rgba(217,119,6,0.2) 100%)' : rank === 2 ? 'rgba(192,192,192,0.15)' : rank === 3 ? 'rgba(205,127,50,0.15)' : 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '8px', border: rank <= 3 ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.05)' });
const rankStyle = (pos) => ({ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', marginRight: '12px', background: pos === 1 ? '#f59e0b' : pos === 2 ? '#94a3b8' : pos === 3 ? '#cd7f32' : 'rgba(255,255,255,0.1)', color: pos <= 3 ? '#000' : '#fff' });

export default function CatchBoard() {
  const [currentPage, setCurrentPage] = useState('home');
  const [activeTab, setActiveTab] = useState('registration');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [entrantPhone, setEntrantPhone] = useState('');
  const [isEntrantLoggedIn, setIsEntrantLoggedIn] = useState(false);
  const [loginPhone, setLoginPhone] = useState('');
  const [loginName, setLoginName] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showQRFlyer, setShowQRFlyer] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showCatchModal, setShowCatchModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [verifyView, setVerifyView] = useState('pending');
  const [showAddSpeciesModal, setShowAddSpeciesModal] = useState(false);
  const [newSpeciesName, setNewSpeciesName] = useState('');
  const [newSpeciesCategory, setNewSpeciesCategory] = useState('');
  const [pendingCatchId, setPendingCatchId] = useState(null);
  const [showAwardsModal, setShowAwardsModal] = useState(false);
  const [editingAwardCategory, setEditingAwardCategory] = useState('');
  const [editingAwardDivision, setEditingAwardDivision] = useState('');
  const [newAwardPlace, setNewAwardPlace] = useState('1');
  const [newAwardPrize, setNewAwardPrize] = useState('');
  const [filterState, setFilterState] = useState('All States');
  const [confirmModal, setConfirmModal] = useState({ show: false, contestantId: null, name: '', amount: 0 });
  const [selectedDivision, setSelectedDivision] = useState('Adult');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddNew, setShowAddNew] = useState(false);
  const [newEntrantName, setNewEntrantName] = useState('');
  const [newEntrantPhone, setNewEntrantPhone] = useState('');
  const [newEntrantAge, setNewEntrantAge] = useState('');
  const [newEntrantPostcode, setNewEntrantPostcode] = useState('');
  const [newEntrantCity, setNewEntrantCity] = useState('');
  const [newEntrantState, setNewEntrantState] = useState('');
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminPhone, setNewAdminPhone] = useState('');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAge, setRegAge] = useState('');
  const [regPostcode, setRegPostcode] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regState, setRegState] = useState('');
  const [catchSpecies, setCatchSpecies] = useState('');
  const [catchLength, setCatchLength] = useState('');
  const [catchWeight, setCatchWeight] = useState('');
  const [catchPhoto1, setCatchPhoto1] = useState(null);
  const [catchPhoto2, setCatchPhoto2] = useState(null);
  
  const [isNewEvent, setIsNewEvent] = useState(false);
  const [editEventName, setEditEventName] = useState('');
  const [editEventDescription, setEditEventDescription] = useState('');
  const [editEventDate, setEditEventDate] = useState('');
  const [editEventStartTime, setEditEventStartTime] = useState('');
  const [editEventEndTime, setEditEventEndTime] = useState('');
  const [editEventTimezone, setEditEventTimezone] = useState('AEST');
  const [editEventPostcode, setEditEventPostcode] = useState('');
  const [editEventCity, setEditEventCity] = useState('');
  const [editEventState, setEditEventState] = useState('');
  const [editEventAdultFee, setEditEventAdultFee] = useState('');
  const [editEventJuniorFee, setEditEventJuniorFee] = useState('');
  const [editEventWaterBody, setEditEventWaterBody] = useState('');
  const [editEventLaunchSite, setEditEventLaunchSite] = useState('');
  const [editEventRegStand, setEditEventRegStand] = useState('');
  const [editEventPhotoRequired, setEditEventPhotoRequired] = useState(true);
  const [editEventTieBreaker, setEditEventTieBreaker] = useState('most_fish');
  const [editEventCode, setEditEventCode] = useState('');
  const [editCategories, setEditCategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryCriteria, setNewCategoryCriteria] = useState('longest_cm');
  const [newCategorySpecies, setNewCategorySpecies] = useState([]);
  const [speciesSearchQuery, setSpeciesSearchQuery] = useState('');

  useEffect(() => {
    try {
      const remembered = localStorage.getItem('catchboard_user');
      if (remembered) { const user = JSON.parse(remembered); setCurrentUser(user); setIsLoggedIn(true); }
      const rememberedEntrant = localStorage.getItem('catchboard_entrant');
      if (rememberedEntrant) { setEntrantPhone(rememberedEntrant); setIsEntrantLoggedIn(true); }
    } catch (e) {}
  }, []);

  const [events, setEvents] = useState([
    { id: 1, name: 'Beulah Open', description: 'Annual fishing competition at Lake Beulah featuring native and non-native categories.', date: '2026-03-22', startTime: '06:00', endTime: '14:00', timezone: 'AEST',
      postcode: '3395', city: 'Beulah', state: 'VIC', waterBody: 'Lake Beulah', launchSite: 'Main Boat Ramp', regStand: 'Near the boat ramp shelter', eventCode: 'BEU2026',
      status: 'planned', adultFee: 15, juniorFee: 10, flyer: null, photoRequired: true, tieBreaker: 'most_fish', topPrize: '$500 + Trophy',
      categories: [
        { id: 1, name: 'Native Fish', criteria: 'longest_cm', species: [1, 2, 3] },
        { id: 2, name: 'Non-Native', criteria: 'longest_cm', species: [8, 9, 10, 11] },
      ],
      divisions: ['Adult', 'Junior (Under 16)'],
      awards: [{ category: 'Native Fish', division: 'Adult', place: 1, prize: '$500 + Trophy' }, { category: 'Native Fish', division: 'Adult', place: 2, prize: '$200' }],
      admins: [{ name: 'Steve Gruebner', phone: '0412345678', isCreator: true, confirmed: true }] },
    { id: 2, name: 'Murray Cod Classic', description: 'Premier Murray Cod event. Catch and release only.', date: '2026-04-15', startTime: '05:00', endTime: '15:00', timezone: 'AEST',
      postcode: '3500', city: 'Mildura', state: 'VIC', waterBody: 'Murray River', launchSite: 'Mildura Marina', regStand: 'Marina office', eventCode: 'MCC2026',
      status: 'planned', adultFee: 25, juniorFee: 15, flyer: null, photoRequired: true, tieBreaker: 'most_fish', topPrize: '$1000',
      categories: [{ id: 1, name: 'Murray Cod', criteria: 'longest_cm', species: [1] }],
      divisions: ['Adult', 'Junior (Under 16)'], awards: [{ category: 'Murray Cod', division: 'Adult', place: 1, prize: '$1000' }],
      admins: [{ name: 'John Doe', phone: '0498765432', isCreator: true, confirmed: true }] },
  ]);

  const [contestants, setContestants] = useState([
    { id: 1, eventId: 1, name: 'Dave Wilson', phone: '0412111222', age: 35, division: 'Adult', hometown: 'Melbourne', homeTownState: 'VIC', paid: true, amountPaid: 15, source: 'preregistered' },
    { id: 2, eventId: 1, name: 'Sarah Mitchell', phone: '0412111223', age: 14, division: 'Junior (Under 16)', hometown: 'Bendigo', homeTownState: 'VIC', paid: true, amountPaid: 10, source: 'preregistered' },
    { id: 3, eventId: 1, name: 'Mike Thompson', phone: '0434567890', age: 42, division: 'Adult', hometown: 'Ballarat', homeTownState: 'VIC', paid: true, amountPaid: 15, source: 'walkup' },
    { id: 4, eventId: 1, name: 'Lisa Park', phone: '0467890123', age: 55, division: 'Adult', hometown: 'Melbourne', homeTownState: 'VIC', paid: false, amountPaid: 0, source: 'preregistered' },
  ]);

  const [catches, setCatches] = useState([
    { id: 1, eventId: 1, contestantName: 'Mike Thompson', phone: '0434567890', species: 'Murray Cod', length: 72, category: 'Native Fish', division: 'Adult', time: '07:45', verified: true },
    { id: 2, eventId: 1, contestantName: 'Dave Wilson', phone: '0412111222', species: 'Golden Perch', length: 45, category: 'Native Fish', division: 'Adult', time: '08:22', verified: true },
    { id: 3, eventId: 1, contestantName: 'Sarah Mitchell', phone: '0412111223', species: 'Redfin', length: 32, category: 'Non-Native', division: 'Junior (Under 16)', time: '09:15', verified: true },
  ]);

  // Computed values
  const eventContestants = contestants.filter(c => c.eventId === currentEvent?.id);
  const eventCatches = catches.filter(c => c.eventId === currentEvent?.id);
  const preRegistered = eventContestants.filter(c => !c.paid);
  const paidContestants = eventContestants.filter(c => c.paid);
  const totalCollected = paidContestants.reduce((sum, c) => sum + c.amountPaid, 0);
  const pendingCatches = eventCatches.filter(c => !c.verified);
  const verifiedCatches = eventCatches.filter(c => c.verified);
  const filteredPreRegistered = preRegistered.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredPaid = paidContestants.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const myCompetitions = events.filter(event => contestants.some(c => c.eventId === event.id && c.phone === entrantPhone));

  const getFilteredEvents = () => {
    let filtered = events.filter(e => e.status === 'planned');
    if (filterState !== 'All States') filtered = filtered.filter(e => e.state === filterState);
    return filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const groupEventsByMonth = (eventList) => {
    const groups = {};
    eventList.forEach(event => { const m = getMonthYear(event.date); if (!groups[m]) groups[m] = []; groups[m].push(event); });
    return groups;
  };

  const getLeaderboard = () => {
    if (!selectedCategory) return [];
    return eventCatches.filter(c => c.division === selectedDivision && c.category === selectedCategory && c.verified).sort((a, b) => b.length - a.length);
  };
  const leaderboard = getLeaderboard();

  const getSpeciesName = (id) => FISH_SPECIES_LIST.find(f => f.id === id)?.name || 'Unknown';
  const getFilteredSpecies = () => {
    if (!speciesSearchQuery) return FISH_SPECIES_LIST;
    const q = speciesSearchQuery.toLowerCase();
    return FISH_SPECIES_LIST.filter(f => f.name.toLowerCase().includes(q) || f.slang.some(s => s.toLowerCase().includes(q)));
  };
  const lookupPostcode = (postcode) => POSTCODE_DATA[postcode] || null;

  const findCategoryForSpecies = (speciesName) => {
    if (!currentEvent) return null;
    const fish = FISH_SPECIES_LIST.find(f => f.name === speciesName);
    if (!fish) return null;
    for (const cat of currentEvent.categories) {
      if (cat.species.includes(fish.id)) return cat.name;
    }
    return null;
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Phone', 'Age', 'Division', 'Hometown', 'Paid', 'Amount'];
    const rows = eventContestants.map(c => [c.name, c.phone, c.age, c.division, c.hometown, c.paid ? 'Yes' : 'No', c.amountPaid]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${currentEvent?.name || 'event'}-data.csv`; a.click();
  };

  // Handlers
  const handleLogin = () => {
    if (!loginPhone || !loginName) { setLoginError('Please enter name and phone'); return; }
    const user = { name: loginName, phone: loginPhone }; 
    setIsLoggedIn(true); setCurrentUser(user);
    try { localStorage.setItem('catchboard_user', JSON.stringify(user)); } catch (e) {}
    setLoginPhone(''); setLoginName(''); setCurrentPage('myEvents');
  };
  const handleLogout = () => { setIsLoggedIn(false); setCurrentUser(null); setCurrentPage('home'); try { localStorage.removeItem('catchboard_user'); } catch (e) {} };
  const handleEntrantLogin = () => { if (!entrantPhone || entrantPhone.length < 10) return; setIsEntrantLoggedIn(true); try { localStorage.setItem('catchboard_entrant', entrantPhone); } catch (e) {} setCurrentPage('myCompetitions'); };
  const handleEntrantLogout = () => { setIsEntrantLoggedIn(false); setEntrantPhone(''); try { localStorage.removeItem('catchboard_entrant'); } catch (e) {} setCurrentPage('home'); };

  const handlePostcodeChange = (postcode, setter, citySetter, stateSetter) => {
    setter(postcode);
    const location = lookupPostcode(postcode);
    if (location) { citySetter(location.city); stateSetter(location.state); }
    else { citySetter(''); stateSetter(''); }
  };

  const handleCreateNewEvent = () => {
    const newEvent = { id: Date.now(), name: '', description: '', date: '', startTime: '06:00', endTime: '14:00', timezone: 'AEST', postcode: '', city: '', state: '', waterBody: '', launchSite: '', regStand: '', status: 'draft', adultFee: 15, juniorFee: 10, flyer: null, photoRequired: true, tieBreaker: 'most_fish', eventCode: generateEventCode(), topPrize: '', categories: [], divisions: ['Adult', 'Junior (Under 16)'], awards: [], admins: [{ name: currentUser.name, phone: currentUser.phone, isCreator: true, confirmed: true }] };
    setEvents([...events, newEvent]); setCurrentEvent(newEvent); setIsNewEvent(true); loadEventForEditing(newEvent);
  };

  const loadEventForEditing = (event) => {
    setEditEventName(event.name || ''); setEditEventDescription(event.description || ''); setEditEventDate(event.date || '');
    setEditEventStartTime(event.startTime || '06:00'); setEditEventEndTime(event.endTime || '14:00'); setEditEventTimezone(event.timezone || 'AEST');
    setEditEventPostcode(event.postcode || ''); setEditEventCity(event.city || ''); setEditEventState(event.state || '');
    setEditEventAdultFee(String(event.adultFee || 15)); setEditEventJuniorFee(String(event.juniorFee || 10));
    setEditEventWaterBody(event.waterBody || ''); setEditEventLaunchSite(event.launchSite || ''); setEditEventRegStand(event.regStand || '');
    setEditEventPhotoRequired(event.photoRequired !== false); setEditEventTieBreaker(event.tieBreaker || 'most_fish');
    setEditEventCode(event.eventCode || generateEventCode()); setEditCategories(event.categories || []); setCurrentPage('editEvent');
  };

  const handleSaveEvent = () => {
    if (!editEventName || !editEventDate) { alert('Please fill in event name and date'); return; }
    const topPrize = currentEvent.awards?.find(a => a.place === 1)?.prize || '';
    const updated = { ...currentEvent, name: editEventName, description: editEventDescription, date: editEventDate, startTime: editEventStartTime, endTime: editEventEndTime, timezone: editEventTimezone, postcode: editEventPostcode, city: editEventCity, state: editEventState, adultFee: parseInt(editEventAdultFee) || 15, juniorFee: parseInt(editEventJuniorFee) || 10, waterBody: editEventWaterBody, launchSite: editEventLaunchSite, regStand: editEventRegStand, photoRequired: editEventPhotoRequired, tieBreaker: editEventTieBreaker, eventCode: editEventCode, categories: editCategories, topPrize };
    setEvents(events.map(e => e.id === currentEvent.id ? updated : e)); setCurrentEvent(updated); setIsNewEvent(false); setCurrentPage('eventDashboard');
  };

  const handleCancelEdit = () => {
    if (isNewEvent) { setEvents(events.filter(e => e.id !== currentEvent?.id)); setCurrentEvent(null); setCurrentPage('myEvents'); }
    else { setCurrentPage('eventDashboard'); }
    setIsNewEvent(false);
  };

  const handleDeleteEvent = () => {
    setEvents(events.filter(e => e.id !== currentEvent.id)); setCurrentEvent(null); setShowDeleteConfirm(false); setCurrentPage('myEvents');
  };

  const handleAddCategory = () => {
    if (!newCategoryName) return;
    const newCat = { id: Date.now(), name: newCategoryName, criteria: newCategoryCriteria, species: newCategorySpecies };
    setEditCategories([...editCategories, newCat]); setNewCategoryName(''); setNewCategoryCriteria('longest_cm'); setNewCategorySpecies([]); setShowAddCategory(false);
  };

  const handleRemoveCategory = (catId) => setEditCategories(editCategories.filter(c => c.id !== catId));
  const toggleCategorySpecies = (speciesId) => setNewCategorySpecies(newCategorySpecies.includes(speciesId) ? newCategorySpecies.filter(id => id !== speciesId) : [...newCategorySpecies, speciesId]);

  const handleGoLive = () => {
    if (currentEvent?.status === 'draft') {
      const updated = { ...currentEvent, status: 'planned' };
      setEvents(events.map(e => e.id === currentEvent.id ? updated : e)); setCurrentEvent(updated);
    }
  };

  const handleAddAdmin = () => {
    if (!newAdminName || !newAdminPhone) return;
    const updated = { ...currentEvent, admins: [...currentEvent.admins, { name: newAdminName, phone: newAdminPhone, isCreator: false, confirmed: false }] };
    setEvents(events.map(e => e.id === currentEvent.id ? updated : e)); setCurrentEvent(updated);
    setNewAdminName(''); setNewAdminPhone(''); setShowAddAdmin(false);
  };

  const handleRegister = () => {
    if (!regName || !regPhone || !regAge) { alert('Please fill in name, phone and age'); return; }
    const age = parseInt(regAge); const division = age < 16 ? 'Junior (Under 16)' : 'Adult';
    const newC = { id: contestants.length + 1, eventId: currentEvent.id, name: regName, phone: regPhone, age, division, hometown: regCity || 'Not provided', homeTownState: regState || '', paid: false, amountPaid: 0, source: 'preregistered' };
    setContestants([...contestants, newC]); setEntrantPhone(regPhone); setIsEntrantLoggedIn(true);
    try { localStorage.setItem('catchboard_entrant', regPhone); } catch (e) {}
    setRegName(''); setRegPhone(''); setRegAge(''); setRegPostcode(''); setRegCity(''); setRegState('');
  };

  const handleMarkPaid = (id) => { const c = contestants.find(x => x.id === id); const amt = c.division === 'Adult' ? currentEvent.adultFee : currentEvent.juniorFee; setConfirmModal({ show: true, contestantId: id, name: c.name, amount: amt }); };
  const confirmPayment = () => { setContestants(contestants.map(c => c.id === confirmModal.contestantId ? { ...c, paid: true, amountPaid: confirmModal.amount } : c)); setConfirmModal({ show: false, contestantId: null, name: '', amount: 0 }); };

  const handleAddWalkUp = (markAsPaid = true) => {
    if (!newEntrantName || !newEntrantPhone || !newEntrantAge) return;
    const age = parseInt(newEntrantAge); const division = age < 16 ? 'Junior (Under 16)' : 'Adult'; const amt = division === 'Adult' ? currentEvent.adultFee : currentEvent.juniorFee;
    const newC = { id: contestants.length + 1, eventId: currentEvent.id, name: newEntrantName, phone: newEntrantPhone, age, division, hometown: newEntrantCity || 'Not provided', homeTownState: newEntrantState || '', paid: markAsPaid, amountPaid: markAsPaid ? amt : 0, source: 'walkup' };
    setContestants([...contestants, newC]); setNewEntrantName(''); setNewEntrantPhone(''); setNewEntrantAge(''); setNewEntrantPostcode(''); setNewEntrantCity(''); setNewEntrantState(''); setShowAddNew(false);
  };

  const handleSubmitCatch = () => {
    if (!catchSpecies || !catchLength) { alert('Please fill species and length'); return; }
    const comp = eventContestants.find(c => c.phone === entrantPhone && c.paid);
    if (!comp) { alert('Must be registered and paid'); return; }
    const category = findCategoryForSpecies(catchSpecies);
    const newC = { id: catches.length + 1, eventId: currentEvent.id, contestantName: comp.name, phone: comp.phone, species: catchSpecies, length: parseFloat(catchLength), weight: catchWeight ? parseFloat(catchWeight) : null, category, division: comp.division, time: new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false }), verified: false, photo1: catchPhoto1, photo2: catchPhoto2 };
    setCatches([...catches, newC]); setCatchSpecies(''); setCatchLength(''); setCatchWeight(''); setCatchPhoto1(null); setCatchPhoto2(null); setShowCatchModal(false);
  };

  const handleVerifyCatch = (id) => setCatches(catches.map(c => c.id === id ? { ...c, verified: true } : c));

  const handleAddAward = () => {
    if (!newAwardPrize) return;
    const newA = { category: editingAwardCategory, division: editingAwardDivision, place: parseInt(newAwardPlace), prize: newAwardPrize };
    const updatedAwards = [...currentEvent.awards.filter(a => !(a.category === editingAwardCategory && a.division === editingAwardDivision && a.place === parseInt(newAwardPlace))), newA].sort((a, b) => a.place - b.place);
    const topPrize = updatedAwards.find(a => a.place === 1)?.prize || '';
    const updated = { ...currentEvent, awards: updatedAwards, topPrize }; 
    setEvents(events.map(e => e.id === currentEvent.id ? updated : e)); setCurrentEvent(updated);
    setNewAwardPrize(''); setNewAwardPlace(String(parseInt(newAwardPlace) + 1));
  };

  // Navigation Header Components
  const PublicHeader = () => (
    <header style={styles.header}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={styles.logo} onClick={() => setCurrentPage('home')}>🎣 CatchBoard</div>
        <nav style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setCurrentPage('home')} style={styles.navButton}>🏠 Home</button>
          <button onClick={() => setCurrentPage('browseEvents')} style={styles.navButton}>🔍 Find Events</button>
          {isEntrantLoggedIn && <button onClick={() => setCurrentPage('myCompetitions')} style={styles.navButton}>🏆 My Comps</button>}
        </nav>
      </div>
      <div>
        {isEntrantLoggedIn ? <button onClick={handleEntrantLogout} style={{ ...styles.navButton, background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>Logout</button> : <button onClick={() => setCurrentPage('entrantLogin')} style={styles.navButton}>Login</button>}
      </div>
    </header>
  );

  const OrganiserHeader = () => (
    <header style={styles.header}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={styles.logo} onClick={() => setCurrentPage('home')}>🎣 CatchBoard</div>
        <nav style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setCurrentPage('home')} style={styles.navButton}>🏠 Home</button>
          <button onClick={() => setCurrentPage('myEvents')} style={styles.navButton}>📋 My Events</button>
        </nav>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>{currentUser?.name}</span>
        <button onClick={handleLogout} style={{ ...styles.navButton, background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>Logout</button>
      </div>
    </header>
  );

  return (
    <div style={styles.app}>
      {/* Payment Modal */}
      {confirmModal.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#1a3a5c', borderRadius: '16px', padding: '24px', maxWidth: '320px', width: '100%', border: '1px solid rgba(255,255,255,0.2)', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💰</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>Confirm Payment</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '24px' }}>{confirmModal.name} paid <strong style={{ color: '#22c55e' }}>${confirmModal.amount}</strong>?</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setConfirmModal({ show: false, contestantId: null, name: '', amount: 0 })} style={{ ...styles.secondaryButton, flex: 1, padding: '14px' }}>Cancel</button>
              <button onClick={confirmPayment} style={{ ...styles.greenButton, flex: 1, padding: '14px' }}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#1a3a5c', borderRadius: '16px', padding: '24px', maxWidth: '320px', width: '100%', border: '1px solid rgba(239,68,68,0.3)', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px', color: '#f87171' }}>Delete Event?</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '24px' }}>This will permanently delete "{currentEvent?.name}". This cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowDeleteConfirm(false)} style={{ ...styles.secondaryButton, flex: 1, padding: '14px' }}>Cancel</button>
              <button onClick={handleDeleteEvent} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: '#dc2626', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Catch Modal */}
      {showCatchModal && currentEvent && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px', overflowY: 'auto' }}>
          <div style={{ background: '#1a3a5c', borderRadius: '16px', padding: '24px', maxWidth: '400px', width: '100%', border: '1px solid rgba(255,255,255,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px', textAlign: 'center' }}>🐟 Submit a Catch</h3>
            <p style={{ textAlign: 'center', color: '#f59e0b', marginBottom: '16px', fontFamily: 'monospace' }}>Event Code: {currentEvent.eventCode}</p>
            
            <label style={styles.label}>Species *</label>
            <select style={styles.select} value={catchSpecies} onChange={(e) => setCatchSpecies(e.target.value)}>
              <option value="">Select species...</option>
              {FISH_SPECIES_LIST.map(f => (<option key={f.id} value={f.name}>{f.name}</option>))}
            </select>
            {catchSpecies && <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '-8px', marginBottom: '12px' }}>Category: {findCategoryForSpecies(catchSpecies) || 'Not in any category'}</p>}

            <label style={styles.label}>Length (cm) *</label>
            <input style={styles.input} type="number" placeholder="e.g. 45" value={catchLength} onChange={(e) => setCatchLength(e.target.value)} />

            <label style={styles.label}>Weight (kg) - optional</label>
            <input style={styles.input} type="number" step="0.1" placeholder="e.g. 2.5" value={catchWeight} onChange={(e) => setCatchWeight(e.target.value)} />

            {currentEvent.photoRequired && (
              <>
                <label style={styles.label}>Photo 1 - Fish with measuring tape *</label>
                <div style={styles.photoUpload} onClick={() => setCatchPhoto1('photo1.jpg')}>
                  {catchPhoto1 ? <div style={{ color: '#22c55e' }}>✓ Photo added</div> : <><div style={{ fontSize: '2rem' }}>📷</div><div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Tap to take photo</div></>}
                </div>
                <label style={styles.label}>Photo 2 - Fish with event code written</label>
                <div style={styles.photoUpload} onClick={() => setCatchPhoto2('photo2.jpg')}>
                  {catchPhoto2 ? <div style={{ color: '#22c55e' }}>✓ Photo added</div> : <><div style={{ fontSize: '2rem' }}>📷</div><div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Show "{currentEvent.eventCode}" in photo</div></>}
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button onClick={() => { setShowCatchModal(false); setCatchSpecies(''); setCatchLength(''); setCatchWeight(''); setCatchPhoto1(null); setCatchPhoto2(null); }} style={{ ...styles.secondaryButton, flex: 1, padding: '14px' }}>Cancel</button>
              <button onClick={handleSubmitCatch} style={{ ...styles.primaryButton, flex: 1, padding: '14px' }}>Submit Catch</button>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {showEventDetails && currentEvent && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px', overflowY: 'auto' }}>
          <div style={{ background: '#1a3a5c', borderRadius: '16px', padding: '24px', maxWidth: '450px', width: '100%', border: '1px solid rgba(255,255,255,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setShowEventDetails(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>✕</button>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '20px' }}>📋 {currentEvent.name}</h2>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>DESCRIPTION</div>
              <p style={{ color: 'rgba(255,255,255,0.9)' }}>{currentEvent.description || 'No description'}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div><div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>DATE & TIME</div><p>📅 {formatDateTime(currentEvent.date, currentEvent.startTime, currentEvent.endTime)}</p></div>
              <div><div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>TIMEZONE</div><p>🕐 {currentEvent.timezone}</p></div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>LOCATION</div>
              <p>📍 {currentEvent.city}, {currentEvent.state}</p>
              <p>🌊 {currentEvent.waterBody}</p>
              <p>🚤 Launch: {currentEvent.launchSite}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div><div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>ENTRY FEES</div><p>Adult: ${currentEvent.adultFee}</p><p>Junior: ${currentEvent.juniorFee}</p></div>
              <div><div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>REGISTRATION</div><p>📌 {currentEvent.regStand || 'See event signage'}</p></div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>CATEGORIES</div>
              {currentEvent.categories.map(cat => (
                <div key={cat.id} style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '8px' }}>
                  <div style={{ fontWeight: '600', color: '#f59e0b' }}>{cat.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>{WINNING_CRITERIA.find(c => c.id === cat.criteria)?.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>Species: {cat.species.map(id => getSpeciesName(id)).join(', ') || 'All'}</div>
                </div>
              ))}
            </div>

            {currentEvent.topPrize && <div style={{ padding: '16px', background: 'rgba(34,197,94,0.1)', borderRadius: '12px', border: '1px solid rgba(34,197,94,0.3)', textAlign: 'center' }}><div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>TOP PRIZE</div><div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#22c55e' }}>🏆 {currentEvent.topPrize}</div></div>}

            <button onClick={() => setShowEventDetails(false)} style={{ ...styles.primaryButton, marginTop: '16px' }}>Close</button>
          </div>
        </div>
      )}

      {/* Awards Modal */}
      {showAwardsModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#1a3a5c', borderRadius: '16px', padding: '24px', maxWidth: '400px', width: '100%', border: '1px solid rgba(255,255,255,0.2)', maxHeight: '80vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px', textAlign: 'center' }}>🏅 Edit Awards</h3>
            <label style={styles.label}>Category</label>
            <select style={styles.select} value={editingAwardCategory} onChange={(e) => setEditingAwardCategory(e.target.value)}>{currentEvent?.categories.map(c => (<option key={c.id} value={c.name}>{c.name}</option>))}</select>
            <label style={styles.label}>Division</label>
            <select style={styles.select} value={editingAwardDivision} onChange={(e) => setEditingAwardDivision(e.target.value)}>{currentEvent?.divisions.map(d => (<option key={d} value={d}>{d}</option>))}</select>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Current Awards:</div>
              {currentEvent?.awards.filter(a => a.category === editingAwardCategory && a.division === editingAwardDivision).sort((a, b) => a.place - b.place).map(aw => (<div key={aw.place} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '4px' }}>#{aw.place}: {aw.prize}</div>))}
              {currentEvent?.awards.filter(a => a.category === editingAwardCategory && a.division === editingAwardDivision).length === 0 && <div style={{ color: 'rgba(255,255,255,0.5)' }}>No awards set</div>}
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <div style={{ width: '80px' }}><label style={styles.label}>Place</label><select style={{ ...styles.select, marginBottom: 0 }} value={newAwardPlace} onChange={(e) => setNewAwardPlace(e.target.value)}>{[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
                <div style={{ flex: 1 }}><label style={styles.label}>Prize</label><input style={{ ...styles.input, marginBottom: 0 }} placeholder="e.g. $500 + Trophy" value={newAwardPrize} onChange={(e) => setNewAwardPrize(e.target.value)} /></div>
              </div>
              <button onClick={handleAddAward} style={{ ...styles.primaryButton, padding: '12px' }}>Add/Update Award</button>
            </div>
            <button onClick={() => setShowAwardsModal(false)} style={{ ...styles.secondaryButton, marginTop: '16px', padding: '12px' }}>Done</button>
          </div>
        </div>
      )}

      {/* QR Flyer */}
      {showQRFlyer && currentEvent && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(180deg, #0c1929 0%, #1a3a5c 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '40px', textAlign: 'center' }}>
          <button onClick={() => setShowQRFlyer(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>✕ Close</button>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎣</div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>{currentEvent.name}</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '40px' }}>{formatDateTime(currentEvent.date, currentEvent.startTime, currentEvent.endTime)}</p>
          <div style={{ width: '200px', height: '200px', background: '#fff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}><div style={{ color: '#000' }}>📱 QR CODE</div></div>
          <p style={{ fontSize: '1.2rem', fontWeight: '700' }}>Scan to Pre-Register</p>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Adults ${currentEvent.adultFee} • Juniors ${currentEvent.juniorFee}</p>
          <p style={{ color: '#f59e0b', fontWeight: '600' }}>Pay at the registration stand to finalise entry</p>
        </div>
      )}

      {/* HOME PAGE */}
      {currentPage === 'home' && (
        <>
          <header style={styles.header}><div style={styles.logo}>🎣 CatchBoard</div></header>
          <div style={styles.hero}><div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎣</div><h1 style={styles.heroTitle}>CatchBoard</h1><p style={styles.heroSubtitle}>Fishing Competitions Made Easy</p></div>
          <div style={styles.content}>
            <div style={{ display: 'grid', gap: '16px', maxWidth: '400px', margin: '0 auto' }}>
              <button style={styles.primaryButton} onClick={() => setCurrentPage('browseEvents')}>🔍 Find Competitions</button>
              <button style={styles.greenButton} onClick={() => { if (isEntrantLoggedIn) setCurrentPage('myCompetitions'); else setCurrentPage('entrantLogin'); }}>🏆 My Competitions</button>
              <button style={styles.secondaryButton} onClick={() => { if (isLoggedIn) setCurrentPage('myEvents'); else setCurrentPage('login'); }}>🔐 Organiser Login</button>
            </div>
          </div>
        </>
      )}

      {/* ENTRANT LOGIN */}
      {currentPage === 'entrantLogin' && (
        <>
          <PublicHeader />
          <div style={styles.content}>
            <div style={{ maxWidth: '400px', margin: '40px auto' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>My Competitions</h2>
              <div style={styles.card}><input style={styles.input} type="tel" placeholder="Phone Number" value={entrantPhone} onChange={(e) => setEntrantPhone(e.target.value)} /><button style={styles.greenButton} onClick={handleEntrantLogin}>View My Competitions</button></div>
            </div>
          </div>
        </>
      )}

      {/* MY COMPETITIONS */}
      {currentPage === 'myCompetitions' && isEntrantLoggedIn && (
        <>
          <PublicHeader />
          <div style={styles.content}>
            <h2 style={{ marginBottom: '24px' }}>🏆 My Competitions</h2>
            {myCompetitions.length === 0 ? (<div style={styles.card}><p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>No registrations yet.</p><button style={{ ...styles.primaryButton, marginTop: '16px' }} onClick={() => setCurrentPage('browseEvents')}>Find Competitions</button></div>) : (
              myCompetitions.map(ev => {
                const st = getEventStatus(ev); const myE = contestants.find(c => c.eventId === ev.id && c.phone === entrantPhone);
                return (<div key={ev.id} style={styles.eventCard} onClick={() => { setCurrentEvent(ev); setSelectedCategory(ev.categories[0]?.name || ''); setCurrentPage('myCompetitionDetail'); }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px 0' }}>{ev.name}<span style={badgeStyle(st)}>{st}</span></h3>
                      <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>📅 {formatDate(ev.date)} • 📍 {ev.city}, {ev.state}</p>
                    </div>
                    {ev.topPrize && <div style={{ textAlign: 'right', color: '#22c55e', fontSize: '0.85rem', fontWeight: '600' }}>🏆 {ev.topPrize}</div>}
                  </div>
                  {myE && <p style={{ margin: '8px 0 0 0', padding: '8px 12px', borderRadius: '8px', background: myE.paid ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', color: myE.paid ? '#22c55e' : '#f59e0b', fontWeight: '600', fontSize: '0.9rem' }}>{myE.paid ? '✅ Registered' : '⏳ Pre-registered - finalise at registration stand on the day'}</p>}
                </div>);
              })
            )}
          </div>
        </>
      )}

      {/* MY COMPETITION DETAIL */}
      {currentPage === 'myCompetitionDetail' && currentEvent && (
        <>
          <PublicHeader />
          <div style={styles.content}>
            <div style={{ ...styles.card, background: 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(217,119,6,0.1) 100%)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '8px' }}>🎣 {currentEvent.name}<span style={badgeStyle(getEventStatus(currentEvent))}>{getEventStatus(currentEvent)}</span></h1>
                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>{formatDateTime(currentEvent.date, currentEvent.startTime, currentEvent.endTime)}</p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>📍 {currentEvent.waterBody} • {currentEvent.city}, {currentEvent.state}</p>
              </div>
              {currentEvent.topPrize && <div style={{ textAlign: 'right', padding: '8px 12px', background: 'rgba(34,197,94,0.2)', borderRadius: '8px' }}><div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>TOP PRIZE</div><div style={{ color: '#22c55e', fontWeight: '700' }}>{currentEvent.topPrize}</div></div>}
            </div>

            <button style={{ ...styles.secondaryButton, marginBottom: '16px' }} onClick={() => setShowEventDetails(true)}>📋 View Full Event Details</button>

            {(() => {
              const myEntry = contestants.find(c => c.eventId === currentEvent.id && c.phone === entrantPhone);
              if (!myEntry) return null;
              if (!myEntry.paid) return <div style={{ ...styles.card, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}><p style={{ textAlign: 'center', color: '#f59e0b', fontWeight: '600' }}>⏳ Pre-registered - finalise at registration stand on the day</p></div>;
              if (isEventLive(currentEvent)) return <button style={{ ...styles.greenButton, marginBottom: '16px' }} onClick={() => setShowCatchModal(true)}>🐟 Submit a Catch</button>;
              return <div style={{ ...styles.card, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}><p style={{ textAlign: 'center', color: '#22c55e', fontWeight: '600' }}>✅ Registered - catch submissions open when event is live</p></div>;
            })()}

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>🏆 Leaderboard</h3>
              {currentEvent.categories.length === 0 ? <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>Categories coming soon</div> : (
                <>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>{currentEvent.divisions.map(d => (<button key={d} style={filterPillStyle(selectedDivision === d)} onClick={() => setSelectedDivision(d)}>{d}</button>))}</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>{currentEvent.categories.map(c => (<button key={c.id} style={filterPillStyle(selectedCategory === c.name)} onClick={() => setSelectedCategory(c.name)}>{c.name}</button>))}</div>
                  {leaderboard.length === 0 ? <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>No catches yet</div> : leaderboard.map((e, i) => (<div key={e.id} style={leaderboardItemStyle(i + 1)}><div style={rankStyle(i + 1)}>{i + 1}</div><div style={{ flex: 1 }}><div style={{ fontWeight: '600' }}>{e.contestantName}</div><div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>{e.species}</div></div><div style={{ textAlign: 'right' }}><div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f59e0b' }}>{e.length}</div><div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>cm</div></div></div>))}
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* BROWSE EVENTS */}
      {currentPage === 'browseEvents' && (
        <>
          <PublicHeader />
          <div style={styles.content}>
            <h2 style={{ marginBottom: '16px' }}>🔍 Find Competitions</h2>
            <select style={{ ...styles.select, marginBottom: '16px' }} value={filterState} onChange={(e) => setFilterState(e.target.value)}><option value="All States">All States</option>{AUSTRALIAN_STATES.map(s => (<option key={s} value={s}>{s}</option>))}</select>
            {Object.entries(groupEventsByMonth(getFilteredEvents())).map(([month, evs]) => (
              <div key={month}>
                <div style={styles.monthHeader}>{month}</div>
                {evs.map(ev => (
                  <div key={ev.id} style={styles.eventCard} onClick={() => { setCurrentEvent(ev); setSelectedCategory(ev.categories[0]?.name || ''); setCurrentPage('eventDetail'); }}>
                    <h3 style={{ margin: '0 0 4px 0' }}>{ev.name}</h3>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>📅 {formatDate(ev.date)} • {ev.startTime}-{ev.endTime}</p>
                    <p style={{ margin: '4px 0 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>📍 {ev.waterBody} • {ev.city}, {ev.state}</p>
                    <p style={{ margin: '4px 0 0 0', color: '#f59e0b', fontSize: '0.85rem', fontWeight: '600' }}>Entry: ${ev.adultFee} / ${ev.juniorFee}</p>
                  </div>
                ))}
              </div>
            ))}
            {getFilteredEvents().length === 0 && <div style={styles.card}><p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>No competitions found</p></div>}
          </div>
        </>
      )}

      {/* EVENT DETAIL (Public) */}
      {currentPage === 'eventDetail' && currentEvent && (
        <>
          <PublicHeader />
          <div style={styles.content}>
            <div style={{ ...styles.card, background: 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(217,119,6,0.1) 100%)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '8px' }}>🎣 {currentEvent.name}</h1>
                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>{formatDateTime(currentEvent.date, currentEvent.startTime, currentEvent.endTime)}</p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '4px' }}>📍 {currentEvent.waterBody} • {currentEvent.city}, {currentEvent.state}</p>
                <p style={{ fontWeight: '600' }}>Entry: ${currentEvent.adultFee} / ${currentEvent.juniorFee}</p>
              </div>
              {currentEvent.topPrize && <div style={{ textAlign: 'right', padding: '8px 12px', background: 'rgba(34,197,94,0.2)', borderRadius: '8px' }}><div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>TOP PRIZE</div><div style={{ color: '#22c55e', fontWeight: '700' }}>{currentEvent.topPrize}</div></div>}
            </div>

            <button style={{ ...styles.secondaryButton, marginBottom: '16px' }} onClick={() => setShowEventDetails(true)}>📋 View Full Event Details</button>

            {!contestants.some(c => c.eventId === currentEvent.id && c.phone === entrantPhone) ? (
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>📝 Pre-Register</h3>
                <input style={styles.input} placeholder="Your Name *" value={regName} onChange={(e) => setRegName(e.target.value)} />
                <input style={styles.input} placeholder="Phone Number *" type="tel" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} />
                <input style={styles.input} placeholder="Age *" type="number" value={regAge} onChange={(e) => setRegAge(e.target.value)} />
                {regAge && <div style={{ padding: '12px', background: 'rgba(245,158,11,0.1)', borderRadius: '8px', marginBottom: '12px' }}>{parseInt(regAge) < 16 ? `👦 Junior - $${currentEvent.juniorFee}` : `👨 Adult - $${currentEvent.adultFee}`}</div>}
                <label style={styles.label}>Hometown Postcode</label>
                <input style={styles.input} placeholder="e.g. 3000" maxLength={4} value={regPostcode} onChange={(e) => handlePostcodeChange(e.target.value, setRegPostcode, setRegCity, setRegState)} />
                {regCity && <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '12px' }}>📍 {regCity}, {regState}</div>}
                <button style={styles.greenButton} onClick={handleRegister}>Pre-Register</button>
              </div>
            ) : (<div style={{ ...styles.card, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}><p style={{ textAlign: 'center', color: '#f59e0b', fontWeight: '600' }}>⏳ Pre-registered - finalise at registration stand on the day</p></div>)}

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>🏆 Leaderboard</h3>
              {currentEvent.categories.length === 0 ? <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>Categories coming soon</div> : (
                <>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>{currentEvent.divisions.map(d => (<button key={d} style={filterPillStyle(selectedDivision === d)} onClick={() => setSelectedDivision(d)}>{d}</button>))}</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>{currentEvent.categories.map(c => (<button key={c.id} style={filterPillStyle(selectedCategory === c.name)} onClick={() => setSelectedCategory(c.name)}>{c.name}</button>))}</div>
                  {leaderboard.length === 0 ? <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>No catches yet</div> : leaderboard.map((e, i) => (<div key={e.id} style={leaderboardItemStyle(i + 1)}><div style={rankStyle(i + 1)}>{i + 1}</div><div style={{ flex: 1 }}><div style={{ fontWeight: '600' }}>{e.contestantName}</div><div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>{e.species}</div></div><div style={{ textAlign: 'right' }}><div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f59e0b' }}>{e.length}</div><div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>cm</div></div></div>))}
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* ORGANISER LOGIN */}
      {currentPage === 'login' && (
        <>
          <header style={styles.header}><div style={styles.logo} onClick={() => setCurrentPage('home')}>🎣 CatchBoard</div></header>
          <div style={styles.content}>
            <div style={{ maxWidth: '400px', margin: '40px auto' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Organiser Login</h2>
              <div style={styles.card}>
                {loginError && <div style={{ background: 'rgba(239,68,68,0.1)', padding: '12px', marginBottom: '16px', borderRadius: '8px', color: '#f87171', textAlign: 'center' }}>{loginError}</div>}
                <input style={styles.input} placeholder="Your Name" value={loginName} onChange={(e) => setLoginName(e.target.value)} />
                <input style={styles.input} type="tel" placeholder="Phone Number" value={loginPhone} onChange={(e) => setLoginPhone(e.target.value)} />
                <button style={styles.primaryButton} onClick={handleLogin}>Login</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MY EVENTS */}
      {currentPage === 'myEvents' && isLoggedIn && (
        <>
          <OrganiserHeader />
          <div style={styles.content}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0 }}>My Events</h2>
              <button style={{ ...styles.primaryButton, width: 'auto', padding: '12px 24px' }} onClick={handleCreateNewEvent}>+ Create</button>
            </div>
            {events.filter(e => e.admins.some(a => a.phone === currentUser?.phone)).length === 0 ? (
              <div style={styles.card}><p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>No events yet</p></div>
            ) : events.filter(e => e.admins.some(a => a.phone === currentUser?.phone)).map(ev => {
              const st = getEventStatus(ev);
              return (<div key={ev.id} style={{ ...styles.card, cursor: 'pointer' }} onClick={() => { setCurrentEvent(ev); setActiveTab('registration'); setSelectedCategory(ev.categories[0]?.name || ''); setCurrentPage('eventDashboard'); }}>
                <h3 style={{ margin: '0 0 4px 0' }}>{ev.name || 'Untitled'}<span style={badgeStyle(st)}>{st}</span></h3>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>📅 {formatDateTime(ev.date, ev.startTime, ev.endTime)}</p>
                <p style={{ margin: '4px 0 0 0', color: 'rgba(255,255,255,0.6)' }}>📍 {ev.waterBody || 'TBD'} • {ev.city || ''}, {ev.state || ''}</p>
              </div>);
            })}
          </div>
        </>
      )}

      {/* EDIT EVENT */}
      {currentPage === 'editEvent' && isLoggedIn && (
        <>
          <OrganiserHeader />
          <div style={styles.content}>
            <h2 style={{ marginBottom: '24px' }}>{isNewEvent ? '➕ Create Event' : '✏️ Edit Event'}</h2>
            
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>📋 Basic Info</h3>
              <label style={styles.label}>Event Name *</label>
              <input style={styles.input} placeholder="e.g. Beulah Open" value={editEventName} onChange={(e) => setEditEventName(e.target.value)} />
              <label style={styles.label}>Description</label>
              <textarea style={styles.textarea} placeholder="Describe your event..." value={editEventDescription} onChange={(e) => setEditEventDescription(e.target.value)} />
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>📅 Date & Time</h3>
              <label style={styles.label}>Date *</label>
              <input style={styles.input} type="date" value={editEventDate} onChange={(e) => setEditEventDate(e.target.value)} />
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}><label style={styles.label}>Start</label><input style={styles.input} type="time" value={editEventStartTime} onChange={(e) => setEditEventStartTime(e.target.value)} /></div>
                <div style={{ flex: 1 }}><label style={styles.label}>End</label><input style={styles.input} type="time" value={editEventEndTime} onChange={(e) => setEditEventEndTime(e.target.value)} /></div>
              </div>
              <label style={styles.label}>Timezone</label>
              <select style={styles.select} value={editEventTimezone} onChange={(e) => setEditEventTimezone(e.target.value)}><option value="AEST">AEST</option><option value="ACST">ACST</option><option value="AWST">AWST</option></select>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>📍 Location</h3>
              <label style={styles.label}>Postcode</label>
              <input style={styles.input} placeholder="e.g. 3395" maxLength={4} value={editEventPostcode} onChange={(e) => handlePostcodeChange(e.target.value, setEditEventPostcode, setEditEventCity, setEditEventState)} />
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 2 }}><label style={styles.label}>City</label><input style={{ ...styles.input, background: 'rgba(255,255,255,0.05)' }} value={editEventCity} readOnly /></div>
                <div style={{ flex: 1 }}><label style={styles.label}>State</label><input style={{ ...styles.input, background: 'rgba(255,255,255,0.05)' }} value={editEventState} readOnly /></div>
              </div>
              <label style={styles.label}>Water Body</label>
              <input style={styles.input} placeholder="e.g. Lake Beulah" value={editEventWaterBody} onChange={(e) => setEditEventWaterBody(e.target.value)} />
              <label style={styles.label}>Launch Site</label>
              <input style={styles.input} placeholder="e.g. Main Boat Ramp" value={editEventLaunchSite} onChange={(e) => setEditEventLaunchSite(e.target.value)} />
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>💰 Registration</h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}><label style={styles.label}>Adult Fee ($)</label><input style={styles.input} type="number" value={editEventAdultFee} onChange={(e) => setEditEventAdultFee(e.target.value)} /></div>
                <div style={{ flex: 1 }}><label style={styles.label}>Junior Fee ($)</label><input style={styles.input} type="number" value={editEventJuniorFee} onChange={(e) => setEditEventJuniorFee(e.target.value)} /></div>
              </div>
              <label style={styles.label}>Registration Stand</label>
              <input style={styles.input} placeholder="e.g. Near the boat ramp" value={editEventRegStand} onChange={(e) => setEditEventRegStand(e.target.value)} />
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>⚙️ Settings</h3>
              <label style={styles.label}>Event Code</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input style={{ ...styles.input, flex: 1, marginBottom: 0, fontFamily: 'monospace' }} value={editEventCode} onChange={(e) => setEditEventCode(e.target.value.toUpperCase())} maxLength={8} />
                <button onClick={() => setEditEventCode(generateEventCode())} style={{ ...styles.secondaryButton, width: 'auto', padding: '14px 16px' }}>🔄</button>
              </div>
              <label style={styles.label}>Photo Required?</label>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <button style={filterPillStyle(editEventPhotoRequired)} onClick={() => setEditEventPhotoRequired(true)}>Yes</button>
                <button style={filterPillStyle(!editEventPhotoRequired)} onClick={() => setEditEventPhotoRequired(false)}>No</button>
              </div>
              <label style={styles.label}>Tie Breaker</label>
              <select style={styles.select} value={editEventTieBreaker} onChange={(e) => setEditEventTieBreaker(e.target.value)}><option value="most_fish">Most Fish</option><option value="earliest">Earliest</option></select>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>🏆 Categories</h3>
              {editCategories.length === 0 && <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>No categories</p>}
              {editCategories.map(cat => (
                <div key={cat.id} style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div><div style={{ fontWeight: '600' }}>{cat.name}</div><div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>{WINNING_CRITERIA.find(c => c.id === cat.criteria)?.name}</div></div>
                    <button onClick={() => handleRemoveCategory(cat.id)} style={{ background: 'rgba(239,68,68,0.2)', border: 'none', color: '#f87171', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Remove</button>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Species: {cat.species.length > 0 ? cat.species.map(id => getSpeciesName(id)).join(', ') : 'All'}</div>
                </div>
              ))}
              {showAddCategory ? (
                <div style={{ padding: '16px', background: 'rgba(59,130,246,0.1)', borderRadius: '12px', border: '1px solid rgba(59,130,246,0.3)' }}>
                  <label style={styles.label}>Name *</label>
                  <input style={styles.input} placeholder="e.g. Native Fish" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
                  <label style={styles.label}>Criteria</label>
                  <select style={styles.select} value={newCategoryCriteria} onChange={(e) => setNewCategoryCriteria(e.target.value)}>{WINNING_CRITERIA.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}</select>
                  <label style={styles.label}>Species</label>
                  <input style={{ ...styles.input, marginBottom: '8px' }} placeholder="🔍 Search..." value={speciesSearchQuery} onChange={(e) => setSpeciesSearchQuery(e.target.value)} />
                  <div style={{ maxHeight: '180px', overflowY: 'auto', marginBottom: '12px' }}>
                    {getFilteredSpecies().map(fish => (
                      <div key={fish.id} onClick={() => toggleCategorySpecies(fish.id)} style={{ display: 'flex', alignItems: 'center', padding: '8px', background: newCategorySpecies.includes(fish.id) ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.03)', borderRadius: '8px', marginBottom: '4px', cursor: 'pointer' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: newCategorySpecies.includes(fish.id) ? '#f59e0b' : 'rgba(255,255,255,0.1)', marginRight: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '0.7rem' }}>{newCategorySpecies.includes(fish.id) ? '✓' : ''}</div>
                        <span style={{ flex: 1, fontSize: '0.9rem' }}>{fish.name}</span>
                        <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '8px', background: fish.native ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', color: fish.native ? '#22c55e' : '#f87171' }}>{fish.native ? 'N' : 'X'}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={handleAddCategory} style={{ ...styles.primaryButton, flex: 1, padding: '12px' }}>Add</button>
                    <button onClick={() => { setShowAddCategory(false); setNewCategoryName(''); setNewCategorySpecies([]); }} style={{ ...styles.secondaryButton, flex: 1, padding: '12px' }}>Cancel</button>
                  </div>
                </div>
              ) : <button onClick={() => setShowAddCategory(true)} style={{ ...styles.secondaryButton, padding: '12px' }}>+ Add Category</button>}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleSaveEvent} style={{ ...styles.greenButton, flex: 1 }}>💾 Save</button>
              <button onClick={handleCancelEdit} style={{ ...styles.secondaryButton, flex: 1 }}>Cancel</button>
            </div>

            {!isNewEvent && (
              <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <button onClick={() => setShowDeleteConfirm(true)} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '2px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#f87171', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>🗑️ Delete Event</button>
              </div>
            )}
          </div>
        </>
      )}

      {/* EVENT DASHBOARD */}
      {currentPage === 'eventDashboard' && isLoggedIn && currentEvent && (
        <>
          <OrganiserHeader />
          <div style={styles.content}>
            <div style={{ ...styles.card, background: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(217,119,6,0.1) 100%)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 8px 0' }}>🎣 {currentEvent.name || 'Untitled'}</h1>
                <p style={{ margin: '0 0 4px 0', color: 'rgba(255,255,255,0.8)' }}>📅 {formatDateTime(currentEvent.date, currentEvent.startTime, currentEvent.endTime)}</p>
                <p style={{ margin: '0', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>📍 {currentEvent.waterBody || 'TBD'} • {currentEvent.city}, {currentEvent.state}</p>
                {currentEvent.eventCode && <p style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Code: <span style={{ fontFamily: 'monospace', color: '#f59e0b' }}>{currentEvent.eventCode}</span></p>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', marginLeft: '16px' }}>
                <button onClick={() => { setIsNewEvent(false); loadEventForEditing(currentEvent); }} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500', width: '110px' }}>✏️ Edit</button>
                {currentEvent.status === 'draft' ? (
                  <button onClick={handleGoLive} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: '#fff', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', width: '110px', whiteSpace: 'nowrap' }}>🚀 Go Live</button>
                ) : <span style={{ ...badgeStyle(getEventStatus(currentEvent)), marginLeft: 0 }}>{getEventStatus(currentEvent)}</span>}
              </div>
            </div>

            <div style={styles.tabs}>
              <button style={tabStyle(activeTab === 'registration')} onClick={() => setActiveTab('registration')}>📋 Registration</button>
              <button style={tabStyle(activeTab === 'verify')} onClick={() => setActiveTab('verify')}>✓ Verify ({pendingCatches.length})</button>
              <button style={tabStyle(activeTab === 'leaderboard')} onClick={() => setActiveTab('leaderboard')}>🏆 Leaderboard</button>
              <button style={tabStyle(activeTab === 'awards')} onClick={() => setActiveTab('awards')}>🏅 Awards</button>
              <button style={tabStyle(activeTab === 'stats')} onClick={() => setActiveTab('stats')}>📊 Stats</button>
            </div>

            {activeTab === 'registration' && (
              <>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <div style={styles.statBox}><div style={{ ...styles.statNumber, color: '#22c55e' }}>{paidContestants.length}</div><div style={styles.statLabel}>Paid</div></div>
                  <div style={styles.statBox}><div style={{ ...styles.statNumber, color: '#f59e0b' }}>{preRegistered.length}</div><div style={styles.statLabel}>Pending</div></div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <input style={{ ...styles.input, flex: 1, marginBottom: 0 }} placeholder="🔍 Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  <button style={{ ...styles.primaryButton, width: 'auto', padding: '14px 16px' }} onClick={() => setShowAddNew(!showAddNew)}>+ Add</button>
                  <button style={{ ...styles.secondaryButton, width: 'auto', padding: '14px 16px' }} onClick={() => setShowQRFlyer(true)}>📱 QR</button>
                </div>
                {showAddNew && (
                  <div style={{ ...styles.card, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)' }}>
                    <h4 style={{ margin: '0 0 16px 0' }}>➕ Walk-up</h4>
                    <input style={styles.input} placeholder="Name *" value={newEntrantName} onChange={(e) => setNewEntrantName(e.target.value)} />
                    <input style={styles.input} placeholder="Phone *" type="tel" value={newEntrantPhone} onChange={(e) => setNewEntrantPhone(e.target.value)} />
                    <input style={styles.input} placeholder="Age *" type="number" value={newEntrantAge} onChange={(e) => setNewEntrantAge(e.target.value)} />
                    {newEntrantAge && <div style={{ padding: '10px', background: 'rgba(245,158,11,0.2)', borderRadius: '8px', marginBottom: '12px' }}>{parseInt(newEntrantAge) < 16 ? `Junior $${currentEvent.juniorFee}` : `Adult $${currentEvent.adultFee}`}</div>}
                    <label style={styles.label}>Postcode</label>
                    <input style={styles.input} placeholder="e.g. 3000" maxLength={4} value={newEntrantPostcode} onChange={(e) => handlePostcodeChange(e.target.value, setNewEntrantPostcode, setNewEntrantCity, setNewEntrantState)} />
                    {newEntrantCity && <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '12px' }}>{newEntrantCity}, {newEntrantState}</div>}
                    <button style={{ ...styles.greenButton, marginBottom: '8px' }} onClick={() => handleAddWalkUp(true)}>Add & Paid</button>
                    <div style={{ display: 'flex', gap: '8px' }}><button style={{ ...styles.secondaryButton, flex: 1 }} onClick={() => handleAddWalkUp(false)}>Add Unpaid</button><button style={{ ...styles.secondaryButton, flex: 1 }} onClick={() => setShowAddNew(false)}>Cancel</button></div>
                  </div>
                )}
                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>⏳ Yet to Pay</h3>
                  {filteredPreRegistered.length === 0 ? <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>None</p> : filteredPreRegistered.map(p => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', padding: '12px', background: 'rgba(245,158,11,0.1)', borderRadius: '12px', marginBottom: '8px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', fontWeight: '700' }}>{p.name.charAt(0)}</div>
                      <div style={{ flex: 1 }}><div style={{ fontWeight: '600' }}>{p.name}</div><div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>{p.division}</div></div>
                      <button onClick={() => handleMarkPaid(p.id)} style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: '#dc2626', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>${p.division === 'Adult' ? currentEvent.adultFee : currentEvent.juniorFee}</button>
                    </div>
                  ))}
                </div>
                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>✅ Paid ({paidContestants.length})</h3>
                  {filteredPaid.length === 0 ? <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>None</p> : filteredPaid.map(p => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', color: '#22c55e' }}>✓</div>
                      <div style={{ flex: 1 }}><div style={{ fontWeight: '500' }}>{p.name}</div><div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{p.division}</div></div>
                      <span style={{ color: '#22c55e', fontWeight: '600' }}>${p.amountPaid}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'verify' && (
              <>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <button style={filterPillStyle(verifyView === 'pending')} onClick={() => setVerifyView('pending')}>⏳ Pending ({pendingCatches.length})</button>
                  <button style={filterPillStyle(verifyView === 'categories')} onClick={() => setVerifyView('categories')}>📁 Categories</button>
                </div>
                {verifyView === 'pending' && (
                  <div style={styles.card}>
                    {pendingCatches.length === 0 ? <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '30px' }}>All verified ✅</p> : pendingCatches.map(e => (
                      <div key={e.id} style={{ display: 'flex', alignItems: 'center', padding: '14px', background: 'rgba(245,158,11,0.1)', borderRadius: '12px', marginBottom: '8px' }}>
                        <div style={{ fontSize: '1.5rem', marginRight: '12px' }}>🐟</div>
                        <div style={{ flex: 1 }}><div style={{ fontWeight: '600' }}>{e.contestantName}</div><div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>{e.species} • {e.length}cm</div></div>
                        <button onClick={() => handleVerifyCatch(e.id)} style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: '#22c55e', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>✓</button>
                      </div>
                    ))}
                  </div>
                )}
                {verifyView === 'categories' && (
                  <div style={styles.card}>
                    <h3 style={styles.cardTitle}>📁 Categories & Species</h3>
                    {currentEvent.categories.length === 0 ? <p style={{ color: 'rgba(255,255,255,0.5)' }}>No categories</p> : currentEvent.categories.map(cat => (
                      <div key={cat.id} style={{ padding: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '10px' }}>
                        <div style={{ fontWeight: '600', color: '#f59e0b', marginBottom: '4px' }}>{cat.name}</div>
                        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>{WINNING_CRITERIA.find(c => c.id === cat.criteria)?.name}</div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {cat.species.length > 0 ? cat.species.map(id => (<span key={id} style={{ padding: '4px 8px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', fontSize: '0.8rem' }}>{getSpeciesName(id)}</span>)) : <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>All species</span>}
                        </div>
                      </div>
                    ))}
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '16px' }}>💡 Edit in ✏️ Edit</p>
                  </div>
                )}
              </>
            )}

            {activeTab === 'leaderboard' && (
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>🏆 Leaderboard</h3>
                {currentEvent.categories.length === 0 ? <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '30px' }}>Add categories first</p> : (
                  <>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>{currentEvent.divisions.map(d => (<button key={d} style={filterPillStyle(selectedDivision === d)} onClick={() => setSelectedDivision(d)}>{d}</button>))}</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>{currentEvent.categories.map(c => (<button key={c.id} style={filterPillStyle(selectedCategory === c.name)} onClick={() => setSelectedCategory(c.name)}>{c.name}</button>))}</div>
                    {leaderboard.length === 0 ? <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '30px' }}>No catches yet</p> : leaderboard.map((e, i) => (<div key={e.id} style={leaderboardItemStyle(i + 1)}><div style={rankStyle(i + 1)}>{i + 1}</div><div style={{ flex: 1 }}><div style={{ fontWeight: '600' }}>{e.contestantName}</div><div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>{e.species}</div></div><div style={{ textAlign: 'right' }}><div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f59e0b' }}>{e.length}</div><div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>cm</div></div></div>))}
                  </>
                )}
              </div>
            )}

            {activeTab === 'awards' && (
              <>{currentEvent.categories.length === 0 ? <div style={styles.card}><p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>Add categories first</p></div> : currentEvent.categories.map(cat => (<div key={cat.id} style={styles.card}><h3 style={styles.cardTitle}>🏅 {cat.name}</h3>{currentEvent.divisions.map(div => {const aw = currentEvent.awards.filter(a => a.category === cat.name && a.division === div).sort((a,b)=>a.place-b.place); return (<div key={div} style={{ marginBottom: '12px' }}><div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>{div}</div>{aw.length===0?<p style={{color:'rgba(255,255,255,0.4)',fontSize:'0.85rem'}}>No awards</p>:aw.map(a=>(<div key={a.place} style={{display:'flex',alignItems:'center',padding:'8px',background:a.place===1?'rgba(245,158,11,0.15)':'rgba(255,255,255,0.03)',borderRadius:'8px',marginBottom:'4px'}}><div style={{width:'24px',height:'24px',borderRadius:'50%',background:a.place===1?'#f59e0b':a.place===2?'#94a3b8':'#cd7f32',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'700',marginRight:'10px',color:'#000',fontSize:'0.8rem'}}>{a.place}</div>{a.prize}</div>))}</div>);})}</div>))}{currentEvent.categories.length > 0 && <button style={styles.secondaryButton} onClick={() => { setEditingAwardCategory(currentEvent.categories[0]?.name || ''); setEditingAwardDivision('Adult'); setShowAwardsModal(true); }}>+ Edit Awards</button>}</>
            )}

            {activeTab === 'stats' && (
              <>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <div style={styles.statBox}><div style={styles.statNumber}>{eventContestants.length}</div><div style={styles.statLabel}>Entries</div></div>
                  <div style={styles.statBox}><div style={{ ...styles.statNumber, color: '#22c55e' }}>${totalCollected}</div><div style={styles.statLabel}>Collected</div></div>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <div style={styles.statBox}><div style={styles.statNumber}>{verifiedCatches.length}</div><div style={styles.statLabel}>Catches</div></div>
                  <div style={styles.statBox}><div style={{ ...styles.statNumber, color: pendingCatches.length > 0 ? '#f59e0b' : '#22c55e' }}>{pendingCatches.length}</div><div style={styles.statLabel}>Pending</div></div>
                </div>
                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>📊 Breakdown</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}><span>Adults Paid</span><span>{paidContestants.filter(c => c.division === 'Adult').length}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}><span>Juniors Paid</span><span>{paidContestants.filter(c => c.division === 'Junior (Under 16)').length}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}><span>Pre-registered</span><span>{eventContestants.filter(c => c.source === 'preregistered').length}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}><span>Walk-ups</span><span>{eventContestants.filter(c => c.source === 'walkup').length}</span></div>
                </div>
                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>🐟 Catches by Species</h3>
                  {verifiedCatches.length === 0 ? <p style={{ color: 'rgba(255,255,255,0.5)' }}>No verified catches yet</p> : Object.entries(verifiedCatches.reduce((acc, c) => { acc[c.species] = (acc[c.species] || 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1]).map(([species, count]) => (<div key={species} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}><span>{species}</span><span style={{ fontWeight: '600' }}>{count}</span></div>))}
                </div>
                <button onClick={exportToCSV} style={styles.primaryButton}>📥 Export Event Data</button>
              </>
            )}
          </div>
        </>
      )}
  </div>
  );
}

