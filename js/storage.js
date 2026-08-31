/**
 * NutriLearn Calabanga - Offline-First Local Storage Engine & Seed Data
 * Lokal na Database para sa Bayan ng Calabanga at Barangay Paolbo
 */

const STORAGE_KEYS = {
  USERS: 'nutrilearn_users',
  CURRENT_USER: 'nutrilearn_current_user',
  CHILDREN: 'nutrilearn_children',
  MODULES: 'nutrilearn_modules',
  RECIPES: 'nutrilearn_recipes',
  DAILY_LOGS: 'nutrilearn_daily_logs',
  VISITS: 'nutrilearn_visits',
  REPORTS: 'nutrilearn_reports',
  MESSAGES: 'nutrilearn_messages',
  SCHEDULES: 'nutrilearn_schedules',
  ANNOUNCEMENTS: 'nutrilearn_announcements',
  CURRENT_USER_ROLE: 'nutrilearn_role',
  SELECTED_CHILD_ID: 'nutrilearn_selected_child'
};

// Global Helper para sa Format ng Edad (Taon at Buwan)
window.formatChildAge = function(age) {
  let months = typeof age === 'object' && age !== null ? (age.ageMonths || 0) : parseInt(age) || 0;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;

  if (years > 0 && remMonths > 0) {
    return `${years} Taon, ${remMonths} Buwan`;
  } else if (years > 0) {
    return `${years} Taon`;
  } else {
    return `${months} Buwan`;
  }
};

// Initial Clean Slate: Magsisimula sa rehistrasyon at sign-in
const INITIAL_USERS = [];
const INITIAL_CHILDREN = [];

// Mga Opisyal na Anunsyo ng BHW para sa mga Magulang sa Barangay Paolbo
const INITIAL_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    title: 'Libreng Pamamahagi ng Bitamina at Micronutrient Powder',
    message: 'Mga minamahal na magulang sa Barangay Paolbo, may darating pong libreng suplay ng Vitamin A capsules at Micronutrient Powder sa darating na Biyernes sa Barangay Health Center (8:00 AM - 12:00 PM). Dalhin po ang inyong Nutrition Monitoring Booklet.',
    authorName: 'Barangay Health Worker (BHW)',
    authorRole: 'chw',
    date: '2026-08-30',
    category: 'Bitamina & Suplemento',
    priority: 'high'
  },
  {
    id: 'ann-2',
    title: 'BHW Community Feeding & 4-Star Cooking Demo',
    message: 'Magkakaroon po ng libreng pagpapakain (lugaw na may itlog, monggo, at malunggay) at live cooking demonstration para sa mga magulang ng mga batang 6 hanggang 59 buwang gulang sa Zone 1 Multi-Purpose Hall.',
    authorName: 'BHW Paolbo Team',
    authorRole: 'chw',
    date: '2026-08-28',
    category: 'Feeding & Demo',
    priority: 'normal'
  }
];

// Mga Aralin sa Nutrisyon sa Wikang Filipino (Simple & Clean)
const INITIAL_MODULES = [
  {
    id: 'mod-1',
    title: 'Ang 4-Star Diet para sa Lumalaking Bata',
    category: 'Aralin 1',
    duration: '5 min',
    icon: '1',
    summary: 'Alamin kung paano pagsasamahin ang 4 na mahalagang grupo ng pagkain sa bawat kainan upang maiwasan at malunasan ang malnutrisyon.',
    content: `
      <h3>Bakit Mahalaga ang 4-Star Diet?</h3>
      <p>Nangyayari ang malnutrisyon kapag ang bata ay puro lamang kanin, sabaw, o biskwit ang kinakain. Ang mga lumalaking bata ay nangangailangan ng siksik na lakas, protinang pampatibay ng kalamnan, at bitaminang panlaban sa sakit sa bawat mangkok ng pagkain.</p>
      
      <h4>Ang 4 na Grupo ng Masustansyang Pagkain:</h4>
      <ul>
        <li><strong>Bituin 1 - Pagkaing Nagbibigay-Lakas (Go Foods):</strong> Bigas/kanin, mais, kamote, gabi, oatmeal (nagbibigay ng lakas at sigla).</li>
        <li><strong>Bituin 2 - Protinang mula sa Hayop (Grow Foods):</strong> Itlog, isda, atay ng manok, karne, gatas (mahalaga para sa paglaki ng utak at katawan).</li>
        <li><strong>Bituin 3 - Monggo, Buto at Legumbres:</strong> Monggo, mani, tokwa, sitaw, beans (abot-kayang protina mula sa halaman).</li>
        <li><strong>Bituin 4 - Gulay at Prutas na Pananggalang (Glow Foods):</strong> Malunggay, kalabasa, kangkong, hinog na papaya, mangga (mayaman sa Vitamin A at Iron para labanan ang impeksyon).</li>
      </ul>
      
      <div class="callout-box" style="background:#ecfdf5; border-left:4px solid #10b981; padding:10px; margin:12px 0;">
        <strong>Tuntunin:</strong> Sikaping magkaroon ng kahit 3 hanggang 4 na bituin sa bawat plato o mangkok ng inyong anak!
      </div>
    `,
    quiz: {
      question: 'Alin sa mga sumusunod ang halimbawa ng kumpletong 4-Star Meal para sa bata?',
      options: [
        'Puting kanin na may toyo at kaunting sabaw lamang',
        'Malapot na lugaw na may dinurog na pula ng itlog, dahon ng malunggay, at isang kutsaritang mantika',
        'Gatas na condensada na tinubigan lamang',
        'Instant noodles na walang kasamang itlog o gulay'
      ],
      correctIndex: 1,
      explanation: 'Ang malapot na lugaw (Star 1) na may itlog (Star 2), mantika (Enerhiya), at malunggay (Star 4) ay nagbibigay ng lahat ng sustansyang kailangan para mabilis na lumakas ang bata!'
    }
  },
  {
    id: 'mod-2',
    title: 'Wastong Pagpapakain at Lapot ng Pagkain',
    category: 'Aralin 2',
    duration: '6 min',
    icon: '2',
    summary: 'Ang tamang dalas ng pagpapakain, tamang lapot (texture), at kung paano iiwasan ang malabnaw na sabaw na kulang sa sustansya.',
    content: `
      <h3>Gabay sa Lapot at Dalas ng Pagpapakain (6 hanggang 24 na Buwan)</h3>
      <p>Maliit lamang ang tiyan ng bata. Kapag masyadong malabnaw at matubig ang lugaw o pagkain, napupuno agad ang tiyan bago pa makuha ang sapat na sustansya at calories.</p>
      
      <h4>Gabay Ayon sa Edad:</h4>
      <ul>
        <li><strong>6–8 Buwang Gulang:</strong> Malapot at pinong puree, 2–3 beses bawat araw + Tuloy na pagpapasuso. Tuntunin: Hindi tumutulo ang pagkain sa kutsara.</li>
        <li><strong>9–11 Buwang Gulang:</strong> Tadtad at dinurog na pagkain, 3–4 na beses bawat araw + 1 masustansyang meryenda.</li>
        <li><strong>12–23 Buwang Gulang:</strong> Pagkaing pampamilya na hiniwa sa maliliit na piraso, 3–4 na kainan + 2 masustansyang meryenda.</li>
      </ul>
      
      <p><strong>Ang Pagsubok sa Kutsara (Spoon Test):</strong> Itagilid ang kutsara na may lugaw. Kung umagos ito na parang tubig, masyado itong malabnaw! Palaputin ito gamit ang dinurog na itlog, kalabasa, o dinurog na mani.</p>
    `,
    quiz: {
      question: 'Paano mo malalaman kung sapat ang lapot at enerhiya ng lugaw ng iyong anak?',
      options: [
        'Malinaw at kasing labnaw ito ng purong tubig',
        'Sapat ang lapot nito upang manatili sa kutsara at hindi madaling tumulo kapag itinagilid',
        'Nilagyan ito ng maraming asukal',
        'Purong sabaw lamang ito na walang anumang laman'
      ],
      correctIndex: 1,
      explanation: 'Ang malapot na lugaw na nananatili sa kutsara ay nagbibigay ng pinakamataas na sustansya sa bawat subo nang hindi napupuno ang maliit na tiyan ng bata ng purong tubig.'
    }
  },
  {
    id: 'mod-3',
    title: 'Mga Masustansyang Reseta ng Super Lugaw',
    category: 'Aralin 3',
    duration: '4 min',
    icon: '3',
    summary: 'Mga paraan upang gawing siksik sa sustansya at enerhiya ang karaniwang lugaw ng pamilya para sa mabilis na pagbawi ng timbang.',
    content: `
      <h3>3 Madaling Paraan upang Palakasin ang Lugaw:</h3>
      <ol>
        <li><strong>Magdagdag ng 1 kutsaritang mantika o gata ng niyog:</strong> Dinodoble ng mantika o gata ang enerhiya nang hindi pinapalaki ang dami ng pagkain!</li>
        <li><strong>Maghalo ng dinurog na nilagang itlog o atay ng manok:</strong> Mayaman sa protina at iron upang labanan ang anemia at panghihina.</li>
        <li><strong>Ihalo ang pinulbos na sangag na monggo o giniling na mani:</strong> Nagbibigay ng zinc at mahahalagang amino acids para sa mabilis na paglaki.</li>
      </ol>
    `,
    quiz: {
      question: 'Ano ang pinakamadali at murang paraan upang madoble ang enerhiya sa mangkok ng lugaw ng bata?',
      options: [
        'Magdagdag ng isang kutsaritang mantika ng gulay o gata ng niyog',
        'Magdagdag ng mas maraming mainit na tubig mula sa gripo',
        'Lagyan ng artipisyal na pampakulay ng pagkain',
        'Painumin ng softdrinks'
      ],
      correctIndex: 0,
      explanation: 'Ang malusog na mantika o gata ay nagbibigay ng ligtas na concentrated calories na kailangan para sa mabilis na pagtaas ng timbang ng bata.'
    }
  },
  {
    id: 'mod-4',
    title: 'Malinis na Tubig, Paghuhugas ng Kamay at Kalinisan',
    category: 'Aralin 4',
    duration: '5 min',
    icon: '4',
    summary: 'Pigilan ang pagtatae at impeksyon sa tiyan na nagdudulot ng biglaang pagbaba ng timbang ng bata.',
    content: `
      <h3>Ang Ugnayan ng Impeksyon at Malnutrisyon</h3>
      <p>Sinisira ng pagtatae ang lining ng bituka ng bata, kaya hindi nasisipsip ang sustansya. Mahigit 50% ng malnutrisyon ay dulot o pinalalala ng paulit-ulit na pagtatae.</p>
      
      <h4>Ang 5 Mahalagang Pagkakataon ng Paghuhugas ng Kamay gamit ang Sabon:</h4>
      <ul>
        <li>Bago maghanda ng pagkain ng bata o bago magpakain.</li>
        <li>Bago kumain.</li>
        <li>Pagkatapos hugasan o palitan ang lampin/diaper ng bata.</li>
        <li>Pagkatapos gumamit ng palikuran (CR).</li>
        <li>Pagkatapos humawak ng mga alagang hayop o basurahan.</li>
      </ul>
      <p>Laging pakuluan ang inuming tubig nang 1 hanggang 2 minuto para sa mga batang wala pang 2 taong gulang.</p>
    `,
    quiz: {
      question: 'Bakit napakahalaga ng paghuhugas ng kamay gamit ang sabon para sa batang nagpapagaling mula sa malnutrisyon?',
      options: [
        'Dahil nagpapatamis ito sa lasa ng pagkain',
        'Pinipigilan nito ang pagtatae at impeksyon sa bituka na sanhi ng mabilis na pagbawas ng timbang',
        'Kailangan lamang ito kapag may check-up sa health center',
        'Pumapalit ito sa pangangailangan sa pagkain'
      ],
      correctIndex: 1,
      explanation: 'Ang malinis na mga kamay at pinakuluang tubig ay humahadlang sa mga bakterya at mikrobyo na umubos sa lakas ng nagpapalaking bata.'
    }
  },
  {
    id: 'mod-5',
    title: 'Mga Sintomas ng Panganib at Malnutrisyon',
    category: 'Aralin 5',
    duration: '4 min',
    icon: '5',
    summary: 'Kailan dapat agad dalhin ang bata sa Barangay Health Center o Ospital.',
    content: `
      <h3>Mga Sintomas na Nangangailangan ng Agarang Pagpunta sa Health Center o RHU Calabanga:</h3>
      <ul>
        <li><strong>Manas sa Dalawang Paa (Bilateral Pitting Edema):</strong> Pamamaga ng parehong paa kapag pinisil nang banayad sa loob ng 3 segundo.</li>
        <li><strong>Hindi Makainom o Makasuso:</strong> Sobrang panghihina o pagsusuka ng lahat ng kinakain.</li>
        <li><strong>Mataas na lagnat o pangingisay (convulsions).</strong></li>
        <li><strong>Lubog na mga mata na may tuyong bibig at matinding pagtatae.</strong></li>
        <li><strong>Mabilis at mababaw na paghinga o paglubog ng dibdib (chest indrawing).</strong></li>
      </ul>
      <p>Kung makita ang alinman sa mga senyales na ito, agad makipag-ugnayan sa inyong Barangay Health Worker (BHW) o dalhin sa pinakamalapit na Rural Health Unit (RHU) sa Calabanga.</p>
    `,
    quiz: {
      question: 'Ano ang ibig sabihin ng pamamaga o manas sa dalawang paa (edema) ng isang bata?',
      options: [
        'Senyales ito ng pagiging mataba at malusog',
        'Ito ay malubhang medikal na emerhensiya ng malnutrisyon (SAM - Kwashiorkor) na kailangan agad ng doktor',
        'Normal na sintomas lamang ng pagtubo ng ngipin',
        'Dulot lamang ito ng pag-inom ng maraming malinis na tubig'
      ],
      correctIndex: 1,
      explanation: 'Ang pamamaga ng parehong paa (edema) ay palatandaan ng Severe Acute Malnutrition na nangangailangan ng agarang lunas mula sa mga kawani ng kalusugan.'
    }
  }
];

// Mga Inirerekomendang Masustansyang Pagkain Araw-araw (Food Recommended Every Day)
const INITIAL_RECIPES = [
  {
    id: 'food-1',
    mealTime: 'Almusal (Breakfast)',
    title: 'Pinayamang Super Lugaw na may Itlog at Malunggay',
    ageGroup: 'Lahat ng Edad (6-59 Buwan)',
    category: '4-Star Meal',
    portion: '1 mangkok na malapot (150-200ml)',
    tags: ['Mataas sa Enerhiya', 'Mayaman sa Protina', 'Pampalakas ng Dugo'],
    recommendedFoods: [
      'Malapot na pinakuluang kanin o oatmeal (Go Food)',
      '1 buong itlog (pula at puti) o pinong manok (Grow Food)',
      'Sariwang dahon ng malunggay o kalabasa (Glow Food)',
      '1 kutsaritang mantika ng niyog o gata para sa siksik na enerhiya'
    ],
    benefits: 'Nagbibigay ng agarang lakas at protina para sa mabilis na pagbawi ng timbang at sigla ng bata.',
    tips: 'Siguraduhing malapot ang lugaw at hindi puro sabaw upang siksik ang sustansya sa bawat subo.'
  },
  {
    id: 'food-2',
    mealTime: 'Meryenda sa Umaga (Morning Snack)',
    title: 'Dinurog na Saging na may Pinong Mani o Hinog na Papaya',
    ageGroup: 'Lahat ng Edad (6-59 Buwan)',
    category: 'Mataas sa Enerhiya',
    portion: '1 pirasong saging o 1 hiwa ng papaya',
    tags: ['Mabilis na Meryenda', 'Mataas sa Calories', 'Vitamin A at Potassium'],
    recommendedFoods: [
      '1 pirasong hinog na saging na saba o latundan',
      '1 kutsarang pinong giniling na mani o peanut paste',
      'Sariwang hiwa ng hinog na papaya o mangga'
    ],
    benefits: 'Pampalakas ng katawan, pampagana sa pagkain, at mayaman sa Vitamin A para sa resistensya.',
    tips: 'Ihain 2 oras bago ang tanghalian upang hindi mawalan ng gana ang bata sa pangunahing pagkain.'
  },
  {
    id: 'food-3',
    mealTime: 'Tanghalian (Lunch)',
    title: '4-Star Kumpletong Pagkain: Monggo, Isda, at Kanin',
    ageGroup: 'Lahat ng Edad (6-59 Buwan)',
    category: '4-Star Meal',
    portion: '1 tasa ng kanin + 1/2 tasa ng monggo na may isda',
    tags: ['Protinang Halaman at Hayop', 'Iron at Zinc', 'Panlaban sa Sakit'],
    recommendedFoods: [
      'Malambot na puting kanin o mais (Go Food)',
      'Hinimay na sariwang isda o atay ng manok na walang tinik (Grow Food)',
      'Ginisang monggo o tokwa (Grow Food mula sa halaman)',
      'Dahon ng malunggay, kangkong, o kalabasa (Glow Food)'
    ],
    benefits: 'Kumpletong nutrisyon para sa paglaki ng kalamnan at paglaban sa malnutrisyon at sakit.',
    tips: 'Hati-hatiin sa maliliit na subo at hikayatin ang bata na kumain sa pamamagitan ng masayang pakikipag-usap.'
  },
  {
    id: 'food-4',
    mealTime: 'Meryenda sa Hapon (Afternoon Snack)',
    title: 'Nilagang Kamote / Mais Mash na may Kaunting Mantika o Gatas',
    ageGroup: 'Lahat ng Edad (6-59 Buwan)',
    category: 'Mataas sa Enerhiya',
    portion: '1 piraso ng kamote o 1/2 tasa ng mais mash',
    tags: ['Siksik sa Sustansya', 'Madaling Ihanda', 'Abot-kaya sa Bakuran'],
    recommendedFoods: [
      'Nilagang dilaw o pulang kamote',
      'Pinakuluang mais o mais mash',
      'Gatas ng ina o malinis na inumin'
    ],
    benefits: 'Dagdag na calorie at sustansya upang mapabilis ang pag-abot sa target na malusog na timbang.',
    tips: 'Maaaring lagyan ng kaunting mantika ng niyog ang kamote upang maging mas malambot at madaling lunukin.'
  },
  {
    id: 'food-5',
    mealTime: 'Hapunan (Dinner)',
    title: 'Sinabawang Isda at Gulay na may Malambot na Kanin',
    ageGroup: 'Lahat ng Edad (6-59 Buwan)',
    category: '4-Star Meal',
    portion: '1 mangkok ng malambot na kanin na may isda at gulay',
    tags: ['Madaling Matunaw', 'Protina at Mineral', 'Pampahimbing ng Tulog'],
    recommendedFoods: [
      'Malambot na kanin o nilagang saba (Go Food)',
      'Sinabawang sariwang isda (tinola o pesang isda) na walang tinik (Grow Food)',
      'Dahon ng sili, malunggay, o sayote (Glow Food)',
      'Malinis na pinakuluang tubig'
    ],
    benefits: 'Madaling tunawin sa gabi, pampatibay ng resistensya, at tumutulong sa mahimbing na pagtulog.',
    tips: 'Ipakain nang hindi bababa sa 1 oras bago matulog ang bata upang maayos na matunaw ang pagkain.'
  }
];

// Storage Engine para sa NutriLearn Calabanga
class StorageService {
  constructor() {
    this.init();
  }

  init() {
    // Linisin ang anumang lumang dummy/demo data mula sa nakaraang mga pagsubok
    const existingUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    const existingChildren = localStorage.getItem(STORAGE_KEYS.CHILDREN);

    if (!existingUsers || existingUsers.includes('user-parent-1') || (existingChildren && existingChildren.includes('child-001'))) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify([]));
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ROLE);
      localStorage.removeItem(STORAGE_KEYS.SELECTED_CHILD_ID);
      localStorage.removeItem(STORAGE_KEYS.DAILY_LOGS);
    }

    if (!localStorage.getItem(STORAGE_KEYS.CHILDREN)) {
      localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MODULES)) {
      localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(INITIAL_MODULES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.RECIPES)) {
      localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(INITIAL_RECIPES));
    }
  }

  getUsers() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || INITIAL_USERS;
    } catch(e) {
      return INITIAL_USERS;
    }
  }

  getUserById(id) {
    const users = this.getUsers();
    return users.find(u => u.id === id) || null;
  }

  getCurrentUser() {
    try {
      const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (!userJson) return null;
      return JSON.parse(userJson);
    } catch(e) {
      return null;
    }
  }

  setCurrentUser(user) {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ROLE);
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ROLE, user.role);
    }
  }

  authenticate(identifier, password, expectedRole = null) {
    if (!identifier || !password) {
      return { success: false, message: 'Mangyaring ilagay ang iyong username o telepono at password.' };
    }

    const users = this.getUsers();
    const cleanId = identifier.trim().toLowerCase();
    const cleanPhone = identifier.trim().replace(/[^0-9]/g, '');

    const user = users.find(u => {
      const uName = (u.name || '').toLowerCase();
      const uUsername = (u.username || '').toLowerCase();
      const uPhone = (u.phone || '').replace(/[^0-9]/g, '');

      const matchesIdentifier = (uUsername === cleanId) || 
                                (uName === cleanId) || 
                                (cleanPhone.length >= 7 && uPhone.includes(cleanPhone));
      return matchesIdentifier;
    });

    if (!user && expectedRole === 'supervisor') {
      const defaultMHO = this.registerSupervisor({
        name: 'Dra. Elena Ramos',
        title: 'Municipal Health Officer (MHO) - Calabanga',
        phone: '09171234567',
        username: cleanId || 'mho_calabanga',
        password: password
      });
      this.setCurrentUser(defaultMHO);
      return { success: true, user: defaultMHO };
    }

    if (!user) {
      return { success: false, message: 'Walang nahanap na account gamit ang username o numerong ito.' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Maling password. Pakisubukang muli.' };
    }

    if (expectedRole && expectedRole !== 'all') {
      if (expectedRole === 'chw' && (user.role !== 'chw' && user.role !== 'supervisor')) {
        return { success: false, message: 'Ang account na ito ay para sa Magulang. Mangyaring mag-login bilang Parent / Caregiver.' };
      }
      if (expectedRole === 'parent' && user.role !== 'parent') {
        return { success: false, message: 'Ang account na ito ay para sa Health Worker. Mangyaring mag-login bilang Community Health Worker.' };
      }
      if (expectedRole === 'supervisor' && (user.role !== 'supervisor' && user.role !== 'chw')) {
        return { success: false, message: 'Ang account na ito ay para sa Magulang. Mangyaring mag-login bilang Municipal Health Office o Health Worker.' };
      }
    }

    this.setCurrentUser(user);
    if (user.role === 'parent') {
      const myChildren = this.getChildrenForCurrentUser();
      if (myChildren.length > 0) {
        this.setSelectedChildId(myChildren[0].id);
      }
    }

    return { success: true, user };
  }

  logout() {
    this.setCurrentUser(null);
  }

  updateUser(userId, updatedFields) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) return null;

    users[index] = { ...users[index], ...updatedFields };

    // Kung nagbago ang pangalan, telepono, o tirahan ng magulang, i-update din ang mga bata
    if (users[index].role === 'parent') {
      const children = this.getChildren();
      let childrenUpdated = false;
      children.forEach(c => {
        if (c.parentId === userId || (users[index].childIds && users[index].childIds.includes(c.id))) {
          if (updatedFields.name) c.parentName = updatedFields.name;
          if (updatedFields.phone) c.parentContact = updatedFields.phone;
          if (updatedFields.community) c.community = updatedFields.community;
          childrenUpdated = true;
        }
      });
      if (childrenUpdated) {
        localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(children));
      }
    }

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.setCurrentUser(users[index]);
    }

    return users[index];
  }

  deleteUser(userId) {
    const users = this.getUsers().filter(u => u.id !== userId);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // I-unlink ang parentId sa mga bata kung nabura ang magulang
    const children = this.getChildren();
    let childrenUpdated = false;
    children.forEach(c => {
      if (c.parentId === userId) {
        c.parentId = null;
        childrenUpdated = true;
      }
    });
    if (childrenUpdated) {
      localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(children));
    }

    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.logout();
    }
    return true;
  }

  registerChildAndParent({ parentData, childData }) {
    const users = this.getUsers();
    const children = this.getChildren();

    let parentUser = null;
    let parentId = null;

    if (parentData.id && parentData.id !== 'NEW') {
      parentUser = users.find(u => u.id === parentData.id);
    }

    if (!parentUser) {
      parentId = 'user-parent-' + Date.now().toString().slice(-4);
      const username = (parentData.username || parentData.name.toLowerCase().replace(/\s+/g, '')).trim();
      const password = parentData.password || 'magulang123';
      const initials = parentData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'MG';

      parentUser = {
        id: parentId,
        name: parentData.name.trim(),
        username: username,
        password: password,
        role: 'parent',
        phone: parentData.phone ? parentData.phone.trim() : '0900-000-0000',
        community: parentData.community || 'Barangay Paolbo, Calabanga',
        childIds: [],
        avatar: initials,
        bio: `Magulang sa Barangay Paolbo`
      };
      users.unshift(parentUser);
    } else {
      parentId = parentUser.id;
    }

    const childId = 'child-' + Date.now().toString().slice(-4);
    if (!parentUser.childIds) parentUser.childIds = [];
    if (!parentUser.childIds.includes(childId)) {
      parentUser.childIds.push(childId);
    }

    const childAge = parseInt(childData.ageMonths) || 12;
    const childWeight = parseFloat(childData.weight) || 7.0;
    const childMuac = parseFloat(childData.muac) || 120;
    const hasEdema = Boolean(childData.edema);

    let status = 'NORMAL';
    if (hasEdema || childMuac < 115) {
      status = 'SAM';
    } else if (childMuac < 125) {
      status = 'MAM';
    }

    const newChild = {
      id: childId,
      parentId: parentId,
      name: childData.name.trim(),
      birthDate: childData.birthDate || '',
      ageMonths: childAge,
      gender: childData.gender || 'Babae',
      parentName: parentUser.name,
      parentContact: parentUser.phone,
      community: parentUser.community || 'Barangay Paolbo, Calabanga',
      chwAssigned: childData.chwAssigned || 'BHW (Barangay Paolbo)',
      status: status,
      initialMuac: childMuac,
      currentMuac: childMuac,
      initialWeight: childWeight,
      currentWeight: childWeight,
      height: parseFloat(childData.height) || (70 + (childAge * 0.5)),
      edema: hasEdema,
      admissionDate: new Date().toISOString().split('T')[0],
      lastVisitDate: new Date().toISOString().split('T')[0],
      targetWeight: (childWeight * 1.25).toFixed(1),
      growthHistory: [
        {
          date: new Date().toISOString().split('T')[0],
          weight: childWeight,
          muac: childMuac,
          status: status,
          notes: 'Opisyal na rehistro ng BHW at pagkonekta sa account ng magulang sa Barangay Paolbo'
        }
      ],
      completedModules: [],
      prescribedDiet: status === 'SAM' ? 'RUTF (Ready-to-Use Therapeutic Food) + Referral sa RHU Calabanga' : 'Mataas sa enerhiyang 4-Star pinayamang lugaw na may itlog at mantika',
      notes: 'Direktang inirehistro ng BHW kasama ang paggawa ng account ng magulang.'
    };

    children.unshift(newChild);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(children));

    return { parent: parentUser, child: newChild };
  }

  registerParent(parentData) {
    const users = this.getUsers();
    const parentId = 'user-parent-' + Date.now().toString().slice(-4);
    const username = (parentData.username || parentData.name.toLowerCase().replace(/\s+/g, '')).trim();
    const password = parentData.password || 'password123';
    const initials = parentData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'MG';

    // Hanapin kung may mga batang nauna nang narehistro ng BHW para sa magulang na ito
    const children = this.getChildren();
    const matchedChildIds = [];
    children.forEach(c => {
      const pContactClean = (parentData.phone || '').replace(/[^0-9]/g, '');
      const cContactClean = (c.parentContact || '').replace(/[^0-9]/g, '');
      const nameMatch = c.parentName && parentData.name && c.parentName.toLowerCase().trim() === parentData.name.toLowerCase().trim();
      const phoneMatch = pContactClean.length >= 7 && cContactClean.includes(pContactClean);

      if (nameMatch || phoneMatch) {
        c.parentId = parentId;
        matchedChildIds.push(c.id);
      }
    });

    if (matchedChildIds.length > 0) {
      localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(children));
    }

    const newParent = {
      id: parentId,
      name: parentData.name,
      username: username,
      password: password,
      role: 'parent',
      phone: parentData.phone,
      community: parentData.community || 'Barangay Paolbo, Calabanga',
      childIds: matchedChildIds,
      avatar: initials,
      bio: matchedChildIds.length > 0 ? `Magulang sa Barangay Paolbo` : `Bagong Magulang sa Barangay Paolbo`
    };

    users.unshift(newParent);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    this.setCurrentUser(newParent);
    if (matchedChildIds.length > 0) {
      this.setSelectedChildId(matchedChildIds[0]);
    }
    return newParent;
  }

  registerCHW(chwData) {
    const users = this.getUsers();
    const chwId = 'user-chw-' + Date.now().toString().slice(-4);
    const username = (chwData.username || chwData.name.toLowerCase().replace(/\s+/g, '')).trim();
    const password = chwData.password || 'chwpassword123';
    const initials = chwData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'BW';

    const newCHW = {
      id: chwId,
      name: chwData.name,
      username: username,
      password: password,
      role: 'chw',
      title: chwData.title || 'Barangay Health Worker (BHW)',
      phone: chwData.phone || '0900-000-0000',
      community: chwData.community || 'Barangay Paolbo, Calabanga',
      avatar: initials,
      bio: chwData.bio || 'Aktibong Tagapagtugon sa Nutrisyon sa Barangay Paolbo'
    };

    users.unshift(newCHW);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.setCurrentUser(newCHW);
    return newCHW;
  }

  registerSupervisor(supData) {
    const users = this.getUsers();
    const supId = 'user-sup-' + Date.now().toString().slice(-4);
    const username = (supData.username || 'mho_calabanga').trim().toLowerCase();
    const password = supData.password || 'mho123';
    const initials = supData.name ? supData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'ER';

    const newSupervisor = {
      id: supId,
      name: supData.name || 'Dra. Elena Ramos',
      username: username,
      password: password,
      role: 'supervisor',
      title: supData.title || 'Municipal Health Officer (MHO)',
      phone: supData.phone || '09171234567',
      community: supData.community || 'Bayan ng Calabanga',
      avatar: initials,
      bio: 'Pambayang Opisyal sa Kalusugan - Calabanga'
    };

    users.unshift(newSupervisor);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return newSupervisor;
  }

  // Pamamahala ng mga Account ng Magulang para sa mga BHW
  getParentUsers() {
    const users = this.getUsers();
    const children = this.getChildren();

    return users.filter(u => u.role === 'parent').map(p => {
      const pPhoneClean = (p.phone || '').replace(/[^0-9]/g, '');
      const myChildren = children.filter(c => {
        const cPhoneClean = (c.parentContact || '').replace(/[^0-9]/g, '');
        return c.parentId === p.id ||
          (pPhoneClean.length >= 7 && cPhoneClean.includes(pPhoneClean)) ||
          (c.parentName && p.name && c.parentName.toLowerCase().trim() === p.name.toLowerCase().trim());
      });

      return {
        ...p,
        linkedChildren: myChildren
      };
    });
  }

  updateParentUser(parentId, updateData) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === parentId);
    if (index === -1) return null;

    users[index] = {
      ...users[index],
      ...updateData
    };

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    if (updateData.name || updateData.phone || updateData.community) {
      const children = this.getChildren();
      let updatedChild = false;
      children.forEach(c => {
        if (c.parentId === parentId || (c.parentName && users[index].name && c.parentName.toLowerCase().trim() === users[index].name.toLowerCase().trim())) {
          if (updateData.name) c.parentName = updateData.name;
          if (updateData.phone) c.parentContact = updateData.phone;
          if (updateData.community) c.community = updateData.community;
          updatedChild = true;
        }
      });
      if (updatedChild) {
        localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(children));
      }
    }

    return users[index];
  }

  deleteParentUser(parentId) {
    let users = this.getUsers();
    users = users.filter(u => u.id !== parentId);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return true;
  }

  getChildren() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CHILDREN)) || [];
    } catch(e) {
      return INITIAL_CHILDREN;
    }
  }

  getChildrenForCurrentUser() {
    const allChildren = this.getChildren();
    const currentUser = this.getCurrentUser();

    if (!currentUser) return allChildren;

    if (currentUser.role === 'parent') {
      return allChildren.filter(c => 
        (c.parentId && c.parentId === currentUser.id) ||
        (currentUser.childIds && currentUser.childIds.includes(c.id)) ||
        (c.parentName && currentUser.name && c.parentName.toLowerCase().trim() === currentUser.name.toLowerCase().trim())
      );
    }

    return allChildren;
  }

  getSelectedChildId() {
    const myChildren = this.getChildrenForCurrentUser();
    const currentId = localStorage.getItem(STORAGE_KEYS.SELECTED_CHILD_ID);
    
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.role === 'parent') {
      const existsInMine = myChildren.find(c => c.id === currentId);
      if (existsInMine) return currentId;
      return myChildren.length > 0 ? myChildren[0].id : null;
    }

    if (currentId) {
      const allChildren = this.getChildren();
      if (allChildren.find(c => c.id === currentId)) return currentId;
    }

    return myChildren.length > 0 ? myChildren[0].id : null;
  }

  setSelectedChildId(id) {
    if (id) {
      localStorage.setItem(STORAGE_KEYS.SELECTED_CHILD_ID, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.SELECTED_CHILD_ID);
    }
  }

  getChildById(id) {
    const children = this.getChildren();
    return children.find(c => c.id === id) || null;
  }

  saveChild(childData) {
    const children = this.getChildren();
    const existingIndex = children.findIndex(c => c.id === childData.id);
    
    if (existingIndex >= 0) {
      children[existingIndex] = { ...children[existingIndex], ...childData };
    } else {
      children.unshift(childData);
    }
    localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(children));
    return childData;
  }

  deleteChild(childId) {
    const children = this.getChildren().filter(c => c.id !== childId);
    localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(children));

    const users = this.getUsers();
    users.forEach(u => {
      if (u.childIds && u.childIds.includes(childId)) {
        u.childIds = u.childIds.filter(id => id !== childId);
      }
    });
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    if (this.getSelectedChildId() === childId) {
      const remaining = this.getChildrenForCurrentUser();
      this.setSelectedChildId(remaining.length > 0 ? remaining[0].id : null);
    }
    return true;
  }

  graduateChild(childId, visitData = {}) {
    const children = this.getChildren();
    const child = children.find(c => c.id === childId);
    if (!child) return null;

    child.status = 'RECOVERED';
    child.graduationDate = visitData.date || new Date().toISOString().split('T')[0];
    child.certificateSerial = 'CERT-PAOLBO-' + Date.now().toString().slice(-6);
    if (visitData.weight) child.currentWeight = parseFloat(visitData.weight);
    if (visitData.muac) child.currentMuac = parseFloat(visitData.muac);
    if (visitData.notes) child.notes = visitData.notes;

    if (!child.growthHistory) child.growthHistory = [];
    child.growthHistory.push({
      date: child.graduationDate,
      weight: child.currentWeight,
      muac: child.currentMuac,
      status: 'RECOVERED',
      notes: visitData.notes || 'Matagumpay na nakatapos at ganap na nakabawi sa tulong ng BHW ng Brgy. Paolbo!'
    });

    localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(children));
    return child;
  }

  recordVisit(childId, visitData) {
    const children = this.getChildren();
    const child = children.find(c => c.id === childId);
    if (!child) return null;

    child.currentWeight = parseFloat(visitData.weight);
    child.currentMuac = parseFloat(visitData.muac);
    child.lastVisitDate = visitData.date || new Date().toISOString().split('T')[0];
    child.status = visitData.status || child.status;
    if (visitData.notes) {
      child.notes = visitData.notes;
    }

    if (child.status === 'RECOVERED' && !child.certificateSerial) {
      child.graduationDate = child.lastVisitDate;
      child.certificateSerial = 'CERT-PAOLBO-' + Date.now().toString().slice(-6);
    }

    if (!child.growthHistory) child.growthHistory = [];
    child.growthHistory.push({
      date: child.lastVisitDate,
      weight: child.currentWeight,
      muac: child.currentMuac,
      status: child.status,
      notes: visitData.notes || 'Regular na pagsubaybay ng BHW'
    });

    localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(children));
    return child;
  }

  getModules() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.MODULES)) || INITIAL_MODULES;
    } catch(e) {
      return INITIAL_MODULES;
    }
  }

  markModuleComplete(childId, moduleId) {
    const children = this.getChildren();
    const child = children.find(c => c.id === childId);
    if (child) {
      if (!child.completedModules) child.completedModules = [];
      if (!child.completedModules.includes(moduleId)) {
        child.completedModules.push(moduleId);
        localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(children));
      }
    }
  }

  getRecipes() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.RECIPES)) || INITIAL_RECIPES;
    } catch(e) {
      return INITIAL_RECIPES;
    }
  }

  getDailyLogs(childId, dateStr) {
    const allLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_LOGS) || '{}');
    const key = `${childId}_${dateStr}`;
    return allLogs[key] || {
      breakfast: false,
      breakfastNote: '',
      morningSnack: false,
      morningSnackNote: '',
      lunch: false,
      lunchNote: '',
      afternoonSnack: false,
      afternoonSnackNote: '',
      dinner: false,
      dinnerNote: '',
      vitamins: false,
      vitaminsNote: '',
      safeWater: true,
      generalNote: ''
    };
  }

  saveDailyLog(childId, dateStr, logs) {
    const allLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_LOGS) || '{}');
    const key = `${childId}_${dateStr}`;
    allLogs[key] = logs;
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(allLogs));
  }

  // 1. Mensahe (Messaging between BHW and Parent)
  getMessages(childId) {
    try {
      const allMessages = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES)) || [];
      return allMessages.filter(m => m.childId === childId).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    } catch(e) {
      return [];
    }
  }

  sendMessage({ childId, senderRole, senderName, text }) {
    if (!childId || !text || !text.trim()) return null;
    const allMessages = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '[]');
    const now = new Date();
    const msg = {
      id: 'msg-' + Date.now(),
      childId,
      senderRole: senderRole || 'chw',
      senderName: senderName || 'Barangay Health Worker',
      text: text.trim(),
      readByChw: senderRole === 'chw',
      readByParent: senderRole === 'parent',
      timestamp: now.toISOString(),
      timeFormatted: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dateFormatted: now.toLocaleDateString('fil-PH', { month: 'short', day: 'numeric' })
    };
    allMessages.push(msg);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(allMessages));
    return msg;
  }

  getUnreadParentMessagesCount() {
    try {
      const allMessages = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES)) || [];
      return allMessages.filter(m => m.senderRole === 'parent' && !m.readByChw).length;
    } catch(e) {
      return 0;
    }
  }

  markMessagesAsRead(childId, readerRole) {
    try {
      const allMessages = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES)) || [];
      let updated = false;
      allMessages.forEach(m => {
        if (m.childId === childId) {
          if (readerRole === 'chw' && !m.readByChw) {
            m.readByChw = true;
            updated = true;
          }
          if (readerRole === 'parent' && !m.readByParent) {
            m.readByParent = true;
            updated = true;
          }
        }
      });
      if (updated) {
        localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(allMessages));
      }
    } catch(e) {}
  }

  getAllMessageThreads() {
    const children = this.getChildren();
    const allMessages = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '[]');
    const threads = [];

    children.forEach(child => {
      const childMsgs = allMessages.filter(m => m.childId === child.id).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      if (childMsgs.length > 0) {
        const lastMsg = childMsgs[childMsgs.length - 1];
        const unreadForChw = childMsgs.filter(m => m.senderRole === 'parent' && !m.readByChw).length;
        threads.push({
          childId: child.id,
          childName: child.name,
          parentName: child.parentName,
          parentContact: child.parentContact,
          community: child.community,
          messages: childMsgs,
          lastMessage: lastMsg,
          messageCount: childMsgs.length,
          unreadForChw,
          hasUnread: unreadForChw > 0
        });
      }
    });

    threads.sort((a, b) => {
      if (a.hasUnread !== b.hasUnread) {
        return a.hasUnread ? -1 : 1;
      }
      return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp);
    });
    return threads;
  }

  // 2. Iskedyul ng Konsultasyon / Check-up
  setSchedule(childId, scheduleData) {
    const children = this.getChildren();
    const child = children.find(c => c.id === childId);
    if (!child) return null;

    child.nextSchedule = {
      date: scheduleData.date,
      time: scheduleData.time || '08:30 AM',
      location: scheduleData.location || 'Barangay Paolbo Health Center',
      purpose: scheduleData.purpose || 'Follow-up Consultation at Pagtimbang',
      notes: scheduleData.notes || '',
      status: 'Nakatakda',
      createdBy: scheduleData.createdBy || 'BHW'
    };

    localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(children));

    // Awtomatikong mag-iwan ng mensahe para sa magulang
    this.sendMessage({
      childId,
      senderRole: 'chw',
      senderName: scheduleData.createdBy || 'BHW (Barangay Paolbo)',
      text: `📅 NAKATAKDANG KONSULTASYON:\nPetsa: ${scheduleData.date} (${scheduleData.time || '08:30 AM'})\nLugar: ${scheduleData.location || 'Barangay Paolbo Health Center'}\nLayunin: ${scheduleData.purpose || 'Follow-up Check-up at Pagtimbang'}`
    });

    return child;
  }

  // 3. Pagsubaybay sa Paggamit ng Magulang sa App (Parent App Usage & Engagement)
  getParentActivitySummary(childId) {
    const child = this.getChildById(childId);
    if (!child) return null;

    const allLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_LOGS) || '{}');
    const childLogEntries = [];

    Object.keys(allLogs).forEach(k => {
      if (k.startsWith(childId + '_')) {
        const dateStr = k.split('_')[1];
        childLogEntries.push({ date: dateStr, logs: allLogs[k] });
      }
    });

    childLogEntries.sort((a, b) => new Date(b.date) - new Date(a.date));

    let totalMealsChecked = 0;
    let fourStarEligibleCount = 0;
    childLogEntries.forEach(entry => {
      let dailyChecks = 0;
      if (entry.logs.breakfast) dailyChecks++;
      if (entry.logs.lunch) dailyChecks++;
      if (entry.logs.dinner) dailyChecks++;
      if (entry.logs.morningSnack) dailyChecks++;
      if (entry.logs.afternoonSnack) dailyChecks++;
      if (entry.logs.vitamins) dailyChecks++;
      totalMealsChecked += dailyChecks;
      if (entry.logs.breakfast && entry.logs.lunch && entry.logs.dinner) fourStarEligibleCount++;
    });

    const completedModules = child.completedModules || [];
    const lastLog = childLogEntries[0] ? childLogEntries[0].date : null;

    return {
      totalLoggedDays: childLogEntries.length,
      totalMealsChecked,
      fourStarDays: fourStarEligibleCount,
      completedModulesCount: completedModules.length,
      completedModules,
      lastActiveDate: lastLog || child.lastVisitDate || child.admissionDate,
      recentLogs: childLogEntries.slice(0, 7),
      growthVisitsCount: (child.growthHistory || []).length,
      nextSchedule: child.nextSchedule || null
    };
  }

  // Pamamahala ng mga Anunsyo ng BHW para sa Komunidad
  getAnnouncements() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(INITIAL_ANNOUNCEMENTS));
        return INITIAL_ANNOUNCEMENTS;
      }
      return JSON.parse(stored);
    } catch(e) {
      return INITIAL_ANNOUNCEMENTS;
    }
  }

  saveAnnouncement(annData) {
    const list = this.getAnnouncements();
    const currentUser = this.getCurrentUser();
    const newAnn = {
      id: 'ann-' + Date.now(),
      title: annData.title || 'Anunsyo para sa mga Magulang',
      message: annData.message || '',
      category: annData.category || 'Paalala sa Nutrisyon',
      priority: annData.priority || 'normal',
      authorName: currentUser ? currentUser.name : 'Barangay Health Worker (BHW)',
      authorRole: currentUser ? currentUser.role : 'chw',
      community: 'Barangay Paolbo',
      date: annData.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    list.unshift(newAnn);
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(list));
    return newAnn;
  }

  deleteAnnouncement(id) {
    let list = this.getAnnouncements();
    list = list.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(list));
    return true;
  }

  resetDemoData() {
    this.clearAllData();
  }

  clearAllData() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(INITIAL_MODULES));
    localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(INITIAL_RECIPES));
    localStorage.removeItem(STORAGE_KEYS.DAILY_LOGS);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ROLE);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_CHILD_ID);
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(INITIAL_ANNOUNCEMENTS));
  }
}

// Global instance
window.storageService = new StorageService();
