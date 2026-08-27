/**
 * NutriLearn - Offline-First Local Storage Engine & Seed Data
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
  CURRENT_USER_ROLE: 'nutrilearn_role',
  SELECTED_CHILD_ID: 'nutrilearn_selected_child'
};

// Initial Seed Users with Passwords
const INITIAL_USERS = [
  {
    id: 'user-parent-1',
    name: 'Elena Reyes',
    username: 'elena',
    password: 'password123',
    role: 'parent',
    phone: '0917-555-0192',
    community: 'Barangay San Isidro',
    childIds: ['child-001'],
    avatar: '👩',
    bio: 'Mother of Baby Maya (14 mos)'
  },
  {
    id: 'user-parent-2',
    name: 'Rosa Navarro',
    username: 'rosa',
    password: 'password123',
    role: 'parent',
    phone: '0928-555-4819',
    community: 'Barangay Poblacion West',
    childIds: ['child-002'],
    avatar: '👩‍🦰',
    bio: 'Mother of Leo (20 mos)'
  },
  {
    id: 'user-parent-3',
    name: 'Grace Alcantara',
    username: 'grace',
    password: 'password123',
    role: 'parent',
    phone: '0919-555-8321',
    community: 'Barangay San Isidro',
    childIds: ['child-003'],
    avatar: '👱‍♀️',
    bio: 'Mother of Sofia (18 mos)'
  },
  {
    id: 'user-parent-4',
    name: 'Clarissa Gabriel',
    username: 'clarissa',
    password: 'password123',
    role: 'parent',
    phone: '0945-555-9011',
    community: 'Barangay Malaya',
    childIds: ['child-004'],
    avatar: '👩‍🦳',
    bio: 'Mother of Ethan (10 mos)'
  },
  {
    id: 'user-chw-1',
    name: 'Maria Santos',
    username: 'maria.chw',
    password: 'chwpassword123',
    role: 'chw',
    title: 'Community Health Worker #12',
    phone: '0918-123-4567',
    community: 'San Isidro & Poblacion West',
    avatar: '🩺',
    bio: 'Assigned CHW for 14 active households'
  },
  {
    id: 'user-chw-2',
    name: 'Danilo Cruz',
    username: 'danilo.chw',
    password: 'chwpassword123',
    role: 'chw',
    title: 'Community Health Worker #08',
    phone: '0920-765-4321',
    community: 'Barangay Malaya',
    avatar: '🩺',
    bio: 'Assigned CHW for 10 active households'
  },
  {
    id: 'user-chw-3',
    name: 'Dr. Evelyn Morales',
    username: 'evelyn.mho',
    password: 'supervisor123',
    role: 'supervisor',
    title: 'Nutrition Officer & Supervisor',
    phone: '0999-888-7766',
    community: 'District Health Office',
    avatar: '📊',
    bio: 'Public Health Malnutrition Surveillance Officer'
  }
];

// Initial Seed Data
const INITIAL_CHILDREN = [
  {
    id: 'child-001',
    parentId: 'user-parent-1',
    name: 'Baby Maya Reyes',
    ageMonths: 14,
    gender: 'Female',
    parentName: 'Elena Reyes',
    parentContact: '0917-555-0192',
    community: 'Barangay San Isidro',
    chwAssigned: 'Maria Santos (CHW #12)',
    status: 'MAM', // SAM, MAM, IMPROVING, RECOVERED
    initialMuac: 118, // mm (Yellow MAM)
    currentMuac: 122,
    initialWeight: 6.8, // kg
    currentWeight: 7.4,
    height: 72.0, // cm
    edema: false,
    admissionDate: '2026-07-15',
    lastVisitDate: '2026-08-20',
    targetWeight: 8.5,
    growthHistory: [
      { date: '2026-07-15', weight: 6.8, muac: 118, status: 'MAM' },
      { date: '2026-07-28', weight: 7.0, muac: 120, status: 'MAM' },
      { date: '2026-08-10', weight: 7.2, muac: 121, status: 'IMPROVING' },
      { date: '2026-08-20', weight: 7.4, muac: 122, status: 'IMPROVING' }
    ],
    completedModules: ['mod-1', 'mod-3'],
    prescribedDiet: 'High-energy 4-Star porridge + Egg daily + Micronutrient Powder (MNP)',
    notes: 'Mother receptive to counseling. Child gaining weight steadily; appetite improved.'
  },
  {
    id: 'child-002',
    parentId: 'user-parent-2',
    name: 'Leo Navarro',
    ageMonths: 20,
    gender: 'Male',
    parentName: 'Rosa Navarro',
    parentContact: '0928-555-4819',
    community: 'Barangay Poblacion West',
    chwAssigned: 'Maria Santos (CHW #12)',
    status: 'SAM', // Red SAM
    initialMuac: 112,
    currentMuac: 114,
    initialWeight: 7.9,
    currentWeight: 8.2,
    height: 80.5,
    edema: false,
    admissionDate: '2026-08-01',
    lastVisitDate: '2026-08-22',
    targetWeight: 10.2,
    growthHistory: [
      { date: '2026-08-01', weight: 7.9, muac: 112, status: 'SAM' },
      { date: '2026-08-12', weight: 8.0, muac: 113, status: 'SAM' },
      { date: '2026-08-22', weight: 8.2, muac: 114, status: 'SAM' }
    ],
    completedModules: ['mod-1'],
    prescribedDiet: 'RUTF (Ready-to-Use Therapeutic Food) 2 sachets/day + Safe Boiled Water',
    notes: 'Monitored weekly for SAM outpatient care. Checked for appetite and absence of complications.'
  },
  {
    id: 'child-003',
    parentId: 'user-parent-3',
    name: 'Sofia Alcantara',
    ageMonths: 18,
    gender: 'Female',
    parentName: 'Grace Alcantara',
    parentContact: '0919-555-8321',
    community: 'Barangay San Isidro',
    chwAssigned: 'Danilo Cruz (CHW #08)',
    status: 'RECOVERED',
    initialMuac: 119,
    currentMuac: 130, // Green Normal
    initialWeight: 7.5,
    currentWeight: 9.6,
    height: 78.0,
    edema: false,
    admissionDate: '2026-05-10',
    lastVisitDate: '2026-08-18',
    targetWeight: 9.2,
    growthHistory: [
      { date: '2026-05-10', weight: 7.5, muac: 119, status: 'MAM' },
      { date: '2026-06-15', weight: 8.3, muac: 123, status: 'IMPROVING' },
      { date: '2026-07-20', weight: 9.0, muac: 127, status: 'RECOVERED' },
      { date: '2026-08-18', weight: 9.6, muac: 130, status: 'RECOVERED' }
    ],
    completedModules: ['mod-1', 'mod-2', 'mod-3', 'mod-4', 'mod-5'],
    prescribedDiet: 'Diversified family meals + Continued breastfeeding + Fruit snacks',
    notes: 'Successfully graduated from supplementary feeding program. Health fully restored.'
  },
  {
    id: 'child-004',
    parentId: 'user-parent-4',
    name: 'Ethan Gabriel',
    ageMonths: 10,
    gender: 'Male',
    parentName: 'Clarissa Gabriel',
    parentContact: '0945-555-9011',
    community: 'Barangay Malaya',
    chwAssigned: 'Danilo Cruz (CHW #08)',
    status: 'MAM',
    initialMuac: 120,
    currentMuac: 123,
    initialWeight: 6.2,
    currentWeight: 6.9,
    height: 68.5,
    edema: false,
    admissionDate: '2026-08-05',
    lastVisitDate: '2026-08-25',
    targetWeight: 7.8,
    growthHistory: [
      { date: '2026-08-05', weight: 6.2, muac: 120, status: 'MAM' },
      { date: '2026-08-25', weight: 6.9, muac: 123, status: 'IMPROVING' }
    ],
    completedModules: ['mod-1', 'mod-2'],
    prescribedDiet: 'Thick enriched porridge (lugaw) with mashed liver/egg yolk + breastmilk on demand',
    notes: 'Mother introduced complementary feeding early with watery broths. Advised on high-density purees.'
  }
];

const INITIAL_MODULES = [
  {
    id: 'mod-1',
    title: 'The 4-Star Diet for Growing Children',
    category: 'Core Nutrition',
    duration: '5 min read',
    icon: '⭐',
    summary: 'Learn how to combine 4 essential food groups in every meal to prevent and reverse malnutrition.',
    content: `
      <h3>Why the 4-Star Diet Matters</h3>
      <p>Malnutrition happens when a child only eats plain rice, corn, or thin broth. Children need concentrated energy, muscle-building proteins, and protective vitamins in every single bowl.</p>
      
      <h4>The 4 Essential Food Stars:</h4>
      <ul>
        <li><strong>Star 1 - Energy Staples:</strong> Rice, oats, corn, sweet potato, cassava (gives active energy).</li>
        <li><strong>Star 2 - Animal-Source Protein:</strong> Eggs, fish, chicken liver, milk, ground meat (vital for brain & muscle growth).</li>
        <li><strong>Star 3 - Legumes & Seeds:</strong> Mung beans (monggo), beans, lentils, peanuts, tofu (affordable plant protein).</li>
        <li><strong>Star 4 - Protective Fruits & Vegetables:</strong> Malunggay (moringa), spinach, pumpkin, papaya, mango (rich in Vitamin A & Iron to fight infections).</li>
      </ul>
      
      <div class="callout-box" style="background:#ecfdf5; border-left:4px solid #10b981; padding:10px; margin:12px 0;">
        <strong>Golden Rule:</strong> Aim for at least 3 to 4 stars in every meal bowl!
      </div>
    `,
    quiz: {
      question: 'Which of the following is an example of a complete 4-Star Meal?',
      options: [
        'Plain white rice with soy sauce and water',
        'Thick rice porridge with mashed egg yolk, malunggay leaves, and a spoonful of oil',
        'Sugar-sweetened condensed milk drink only',
        'Instant noodles soup without egg or vegetables'
      ],
      correctIndex: 1,
      explanation: 'Thick porridge (Star 1) with egg (Star 2), oil (Energy), and malunggay leaves (Star 4) provides all key growth nutrients!'
    }
  },
  {
    id: 'mod-2',
    title: 'Complementary Feeding & Food Texture',
    category: 'Infant Feeding',
    duration: '6 min read',
    icon: '🥣',
    summary: 'Age-appropriate feeding frequency, consistency, and how to avoid watery, low-nutrient broths.',
    content: `
      <h3>Texture & Frequency Guide (6 to 24 Months)</h3>
      <p>Children have small stomachs. If their porridge is too thin and watery, their stomach gets full before they get enough calories.</p>
      
      <h4>Age Guidelines:</h4>
      <ul>
        <li><strong>6–8 Months:</strong> Thick smooth purees, 2–3 meals/day + Breastfeeding. Consistency: Food stays on the spoon without dripping.</li>
        <li><strong>9–11 Months:</strong> Finely chopped and mashed foods, 3–4 meals/day + 1 healthy snack.</li>
        <li><strong>12–23 Months:</strong> Family foods chopped into bite-sized pieces, 3–4 meals/day + 2 nutritious snacks.</li>
      </ul>
      
      <p><strong>The Spoon Test:</strong> Tilt the spoon. If the porridge runs off like water, it is too thin! Thicken it with mashed egg, squash, or peanut paste.</p>
    `,
    quiz: {
      question: 'How do you know if your baby porridge is energy-dense enough?',
      options: [
        'It is as clear and thin as plain water',
        'It is thick enough to stay on the spoon without sliding off quickly',
        'It has extra refined sugar added',
        'It contains only broth without any solids'
      ],
      correctIndex: 1,
      explanation: 'Dense porridge that clings to the spoon gives the child maximum calories per bite without filling their small stomach with plain water.'
    }
  },
  {
    id: 'mod-3',
    title: 'Super-Enriched Porridge (Lugaw) Recipes',
    category: 'Practical Cooking',
    duration: '4 min read',
    icon: '🍲',
    summary: 'Step-by-step methods to boost ordinary family porridge into a high-calorie recovery meal.',
    content: `
      <h3>3 Ways to Supercharge Any Porridge:</h3>
      <ol>
        <li><strong>Add 1 teaspoon of vegetable oil or coconut milk:</strong> Oil doubles the calorie density without making the volume larger!</li>
        <li><strong>Add a mashed boiled egg yolk or liver:</strong> High in bioavailable iron and protein to fight anemia.</li>
        <li><strong>Stir in powdered toasted mung beans or peanut paste:</strong> Supercharges zinc and essential amino acids.</li>
      </ol>
    `,
    quiz: {
      question: 'What is the easiest low-cost way to double the calories in a child porridge bowl?',
      options: [
        'Add a teaspoon of cooking oil or coconut oil',
        'Add more hot tap water',
        'Add artificial food coloring',
        'Give soda instead'
      ],
      correctIndex: 0,
      explanation: 'Healthy oil or coconut milk provides concentrated healthy fats essential for rapid catch-up growth.'
    }
  },
  {
    id: 'mod-4',
    title: 'Safe Water, Handwashing & Hygiene',
    category: 'Disease Prevention',
    duration: '5 min read',
    icon: '🧼',
    summary: 'Prevent diarrhea and gut infections that cause sudden weight loss in recovering children.',
    content: `
      <h3>The Infection-Malnutrition Cycle</h3>
      <p>Diarrhea damages the child intestine, preventing nutrient absorption. 50% of malnutrition is caused or worsened by repeated diarrhea episodes.</p>
      
      <h4>The 5 Critical Handwashing Moments:</h4>
      <ul>
        <li>Before preparing child food or feeding.</li>
        <li>Before eating.</li>
        <li>After cleaning the child or changing diapers.</li>
        <li>After using the toilet.</li>
        <li>After handling animals or raw poultry.</li>
      </ul>
      <p>Always boil drinking water for at least 1-2 minutes for children under 2 years old.</p>
    `,
    quiz: {
      question: 'Why is handwashing with soap critical for a malnourished child?',
      options: [
        'It makes the food taste sweet',
        'It prevents diarrhea and gut infections that cause severe weight loss',
        'It is only needed on clinic days',
        'It replaces the need for food'
      ],
      correctIndex: 1,
      explanation: 'Clean hands and boiled water stop intestinal parasites and bacteria from draining the child energy.'
    }
  },
  {
    id: 'mod-5',
    title: 'Recognizing Danger Signs & Red Flags',
    category: 'Emergency Triage',
    duration: '4 min read',
    icon: '🚨',
    summary: 'When to immediately bring your child to the health center or hospital.',
    content: `
      <h3>Emergency Symptoms Requiring Immediate Health Center Visit:</h3>
      <ul>
        <li><strong>Bilateral Pitting Edema:</strong> Swelling of both feet when pressed gently for 3 seconds.</li>
        <li><strong>Inability to drink or breastfeed:</strong> Extreme weakness or vomiting everything.</li>
        <li><strong>High fever or convulsions.</strong></li>
        <li><strong>Sunken eyes with dry mouth and severe diarrhea.</strong></li>
        <li><strong>Rapid shallow breathing or chest indrawing.</strong></li>
      </ul>
      <p>If you see any of these signs, contact your Community Health Worker or go to the nearest Rural Health Unit immediately.</p>
    `,
    quiz: {
      question: 'What is bilateral pitting edema in a malnourished child?',
      options: [
        'A sign of good chubby health',
        'A severe medical emergency with fluid swelling in both feet (SAM)',
        'A normal teething symptom',
        'Caused by drinking too much clean water'
      ],
      correctIndex: 1,
      explanation: 'Swelling of both feet (edema) is a sign of Severe Acute Malnutrition (Kwashiorkor) requiring urgent clinical care.'
    }
  }
];

const INITIAL_RECIPES = [
  {
    id: 'rec-1',
    title: 'Fortified Golden Porridge (Super Lugaw)',
    prepTime: '15 mins',
    cost: 'Low Cost (Under $0.50 / ₱25)',
    ageGroup: '6–24 Months',
    stars: 4,
    tags: ['High Energy', 'Protein Rich', 'Iron Boost'],
    ingredients: [
      '1/2 cup cooked rice or oats',
      '1 hard-boiled egg (mashed)',
      '1 tablespoon finely chopped malunggay (moringa) or spinach',
      '1 teaspoon vegetable oil or coconut oil',
      '1/2 cup clean boiled water or chicken broth'
    ],
    instructions: [
      'Simmer cooked rice with broth/water until thick and creamy.',
      'Stir in the 1 teaspoon of vegetable oil to boost energy density.',
      'Add the finely chopped malunggay leaves during the last 2 minutes.',
      'Mash the boiled egg yolk and white with a fork into the porridge.',
      'Serve warm at a thick consistency (not watery).'
    ]
  },
  {
    id: 'rec-2',
    title: 'Mung Bean (Monggo) & Squash Puree',
    prepTime: '20 mins',
    cost: 'Very Affordable',
    ageGroup: '8–24 Months',
    stars: 4,
    tags: ['Plant Protein', 'Vitamin A', 'Immunity'],
    ingredients: [
      '1/4 cup boiled mung beans (well-mashed)',
      '1/4 cup boiled yellow squash / pumpkin (kalabasa)',
      '1 tablespoon cooked flaked fish or shredded chicken',
      '1 teaspoon oil or coconut milk'
    ],
    instructions: [
      'Boil mung beans and pumpkin until soft.',
      'Mash together using a clean fork until thick and smooth.',
      'Stir in cooked fish flakes (ensure no bones) and 1 teaspoon of oil.',
      'Feed with a clean spoon.'
    ]
  },
  {
    id: 'rec-3',
    title: 'Banana-Peanut Power Recovery Mash',
    prepTime: '5 mins',
    cost: 'Low Cost',
    ageGroup: '9–24 Months',
    stars: 3,
    tags: ['Quick Snack', 'Calorie Dense', 'Potassium & Fats'],
    ingredients: [
      '1 ripe sweet banana (latundan or cavendish)',
      '1 tablespoon smooth unsalted peanut paste or sesame paste',
      '1 tablespoon warm clean boiled water or breastmilk'
    ],
    instructions: [
      'Peel and thoroughly mash the ripe banana in a clean bowl.',
      'Blend in 1 tablespoon of smooth peanut paste.',
      'Thin slightly with clean warm water or breastmilk to desired consistency.',
      'Serve immediately as a high-calorie mid-morning snack.'
    ]
  }
];

// Initialize Storage Engine
class StorageService {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    } else {
      // Ensure seed users have passwords and usernames if loaded from old storage
      const users = this.getUsers();
      let updated = false;
      users.forEach(u => {
        if (!u.password) {
          u.password = u.role === 'parent' ? 'password123' : 'chwpassword123';
          updated = true;
        }
        if (!u.username) {
          u.username = u.name.toLowerCase().replace(/\s+/g, '.');
          updated = true;
        }
      });
      if (updated) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      }
    }

    if (!localStorage.getItem(STORAGE_KEYS.CHILDREN)) {
      localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(INITIAL_CHILDREN));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MODULES)) {
      localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(INITIAL_MODULES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.RECIPES)) {
      localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(INITIAL_RECIPES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SELECTED_CHILD_ID)) {
      localStorage.setItem(STORAGE_KEYS.SELECTED_CHILD_ID, 'child-001');
    }
  }

  // User & Authentication Management
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

  // Password Authentication
  authenticate(identifier, password, expectedRole = null) {
    if (!identifier || !password) {
      return { success: false, message: 'Please enter your username/phone and password.' };
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

    if (!user) {
      return { success: false, message: 'No account found with this username or phone number.' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    if (expectedRole && expectedRole !== 'all') {
      if (expectedRole === 'chw' && (user.role !== 'chw' && user.role !== 'supervisor')) {
        return { success: false, message: 'This account is registered as a Parent. Please log in through the Parent portal.' };
      }
      if (expectedRole === 'parent' && user.role !== 'parent') {
        return { success: false, message: 'This account is registered as a Health Worker. Please log in through the Health Worker portal.' };
      }
    }

    // Set session
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

  registerParent(parentData, childData) {
    const users = this.getUsers();
    const children = this.getChildren();

    const parentId = 'user-parent-' + Date.now().toString().slice(-4);
    const childId = 'child-' + Date.now().toString().slice(-4);
    const username = (parentData.username || parentData.name.toLowerCase().replace(/\s+/g, '')).trim();
    const password = parentData.password || 'password123';

    const newChild = {
      id: childId,
      parentId: parentId,
      name: childData.name || 'Baby ' + parentData.name.split(' ')[0],
      ageMonths: parseInt(childData.ageMonths) || 12,
      gender: childData.gender || 'Female',
      parentName: parentData.name,
      parentContact: parentData.phone || '0900-000-0000',
      community: parentData.community || 'Barangay San Isidro',
      chwAssigned: 'Maria Santos (CHW #12)',
      status: childData.status || (childData.muac && childData.muac < 115 ? 'SAM' : (childData.muac < 125 ? 'MAM' : 'MAM')),
      initialMuac: parseFloat(childData.muac) || 120,
      currentMuac: parseFloat(childData.muac) || 120,
      initialWeight: parseFloat(childData.weight) || 7.0,
      currentWeight: parseFloat(childData.weight) || 7.0,
      height: parseFloat(childData.height) || (70 + ((parseInt(childData.ageMonths) || 12) * 0.5)),
      edema: false,
      admissionDate: new Date().toISOString().split('T')[0],
      lastVisitDate: new Date().toISOString().split('T')[0],
      targetWeight: (parseFloat(childData.weight || 7.0) * 1.25).toFixed(1),
      growthHistory: [
        {
          date: new Date().toISOString().split('T')[0],
          weight: parseFloat(childData.weight) || 7.0,
          muac: parseFloat(childData.muac) || 120,
          status: 'MAM'
        }
      ],
      completedModules: [],
      prescribedDiet: 'High-energy 4-Star porridge with egg and mashed vegetables',
      notes: 'Parent self-registered with baby.'
    };

    const newParent = {
      id: parentId,
      name: parentData.name,
      username: username,
      password: password,
      role: 'parent',
      phone: parentData.phone,
      community: parentData.community,
      childIds: [childId],
      avatar: '👩',
      bio: `Mother of ${newChild.name}`
    };

    children.unshift(newChild);
    users.unshift(newParent);

    localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(children));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    this.setCurrentUser(newParent);
    this.setSelectedChildId(childId);
    return { parent: newParent, child: newChild };
  }

  registerCHW(chwData) {
    const users = this.getUsers();
    const chwId = 'user-chw-' + Date.now().toString().slice(-4);
    const username = (chwData.username || chwData.name.toLowerCase().replace(/\s+/g, '')).trim();
    const password = chwData.password || 'chwpassword123';

    const newCHW = {
      id: chwId,
      name: chwData.name,
      username: username,
      password: password,
      role: 'chw',
      title: chwData.title || 'Community Health Worker',
      phone: chwData.phone || '0900-000-0000',
      community: chwData.community || 'District Health Center',
      avatar: '🩺',
      bio: chwData.bio || 'Active Community Nutrition Responder'
    };

    users.unshift(newCHW);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.setCurrentUser(newCHW);
    return newCHW;
  }

  // Children Management
  getChildren() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CHILDREN)) || [];
    } catch(e) {
      return INITIAL_CHILDREN;
    }
  }

  // Children scoped to the active user
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

    // Health worker or supervisor sees all registered children
    return allChildren;
  }

  getSelectedChildId() {
    const myChildren = this.getChildrenForCurrentUser();
    const currentId = localStorage.getItem(STORAGE_KEYS.SELECTED_CHILD_ID);
    
    // If parent and selected child is not their own, default to first of their own children
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.role === 'parent') {
      const existsInMine = myChildren.find(c => c.id === currentId);
      if (existsInMine) return currentId;
      return myChildren.length > 0 ? myChildren[0].id : 'child-001';
    }

    return currentId || (myChildren.length > 0 ? myChildren[0].id : 'child-001');
  }

  setSelectedChildId(id) {
    localStorage.setItem(STORAGE_KEYS.SELECTED_CHILD_ID, id);
  }

  getChildById(id) {
    const children = this.getChildren();
    return children.find(c => c.id === id) || children[0];
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

  // Record Follow-up Visit & Update Growth
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

    // Add to growth history
    if (!child.growthHistory) child.growthHistory = [];
    child.growthHistory.push({
      date: child.lastVisitDate,
      weight: child.currentWeight,
      muac: child.currentMuac,
      status: child.status,
      notes: visitData.notes || ''
    });

    localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(children));
    return child;
  }

  // Modules
  getModules() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.MODULES)) || [];
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

  // Recipes
  getRecipes() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.RECIPES)) || [];
    } catch(e) {
      return INITIAL_RECIPES;
    }
  }

  // Daily Meal Tracker
  getDailyLogs(childId, dateStr) {
    const allLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_LOGS) || '{}');
    const key = `${childId}_${dateStr}`;
    return allLogs[key] || {
      breakfast: false,
      morningSnack: false,
      lunch: false,
      afternoonSnack: false,
      dinner: false,
      vitamins: false,
      safeWater: true
    };
  }

  saveDailyLog(childId, dateStr, logs) {
    const allLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_LOGS) || '{}');
    const key = `${childId}_${dateStr}`;
    allLogs[key] = logs;
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(allLogs));
  }

  // Reset to Demo Defaults
  resetDemoData() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(INITIAL_CHILDREN));
    localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(INITIAL_MODULES));
    localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(INITIAL_RECIPES));
    localStorage.removeItem(STORAGE_KEYS.DAILY_LOGS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.setItem(STORAGE_KEYS.SELECTED_CHILD_ID, 'child-001');
  }
}

// Global instance
window.storageService = new StorageService();
