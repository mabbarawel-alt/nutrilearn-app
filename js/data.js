// ==========================================================================
// NUTRILEARN - DATA REPOSITORY & NUTRITION CURRICULUM
// Evidence-based WHO, PIDS & Philippine Nutrition Standards
// ==========================================================================

const NUTRI_DATA = {
  // Learning Modules for Parents
  modules: [
    {
      id: 'mod-1',
      number: 'Module 1',
      title: 'Understanding Child Malnutrition & Stunting',
      duration: '10 mins',
      difficulty: 'Essential',
      summary: 'Learn the critical differences between stunting, wasting, and underweight, and why early nutrition transforms a child’s future.',
      objectives: [
        'Differentiate stunting (low height-for-age) from wasting (low weight-for-height).',
        'Understand how reducing stunting by 10% prevents irreversible cognitive delays.',
        'Identify common signs of micronutrient deficiency in young children.'
      ],
      content: `
        <h3>What is Malnutrition?</h3>
        <p>Malnutrition refers to deficiencies, excesses, or imbalances in a child's intake of energy and nutrients. In our community, the most urgent challenge is <strong>Child Stunting</strong>.</p>
        
        <div class="calculator-result-box" style="margin: 1rem 0;">
          <h4 style="color: #0E3D26; margin-bottom: 0.5rem;">The Three Forms of Undernutrition:</h4>
          <ul style="margin-left: 1.25rem; line-height: 1.6;">
            <li><strong>Stunting (Maliit para sa edad):</strong> Chronic undernutrition leading to low height for age. It affects brain development and is largely irreversible after age 2.</li>
            <li><strong>Wasting (Payat para sa tangkad):</strong> Acute undernutrition resulting from severe weight loss or illness. Requires immediate nutritional feeding.</li>
            <li><strong>Underweight (Mababang timbang para sa edad):</strong> A composite marker reflecting both stunting and wasting.</li>
          </ul>
        </div>

        <h3>Why the 10% Stunting Reduction Goal Matters</h3>
        <p>Evidence from the Philippine Institute for Development Studies (PIDS) and the World Health Organization (WHO) proves that consistent caregiver education combined with affordable, locally sourced complementary feeding can reduce stunting by <strong>10% annually</strong>. This simple improvement prevents chronic school absenteeism, enhances intelligence, and breaks the cycle of generational poverty.</p>
      `,
      quiz: [
        {
          id: 'q1-1',
          question: 'What is child stunting and what does it measure?',
          options: [
            'A temporary low weight caused by a minor flu',
            'Chronic undernutrition resulting in low height-for-age with lifelong cognitive impacts',
            'Normal genetically determined height that needs no dietary change',
            'Overweight resulting from eating too much rice'
          ],
          answerIndex: 1,
          explanation: 'Stunting is chronic undernutrition indicated by low height-for-age (Height-for-Age z-score < -2 SD). It stunts both physical stature and brain development.'
        },
        {
          id: 'q1-2',
          question: 'According to WHO & Philippine health evidence, by how much can community education and better complementary feeding reduce stunting each year?',
          options: [
            '1% to 2%',
            'Around 10%',
            'No reduction is possible without expensive imported medicine',
            '50% in one month'
          ],
          answerIndex: 1,
          explanation: 'Targeted parent education and localized complementary food interventions have been shown to reduce community stunting prevalence by 10% annually.'
        },
        {
          id: 'q1-3',
          question: 'Why is it critical to prevent stunting before a child reaches their second birthday?',
          options: [
            'Because stunting damage to cognitive and physical growth is largely irreversible after age 2',
            'Because children no longer eat vegetables after age 2',
            'Because health clinics stop monitoring children at age 2',
            'Because height cannot be measured after infancy'
          ],
          answerIndex: 0,
          explanation: 'The first 1,000 days (from conception up to 2 years) is the critical window where brain and body growth happens fastest. Nutritional deficits during this period become permanent.'
        }
      ]
    },

    {
      id: 'mod-2',
      number: 'Module 2',
      title: 'The First 1,000 Days Golden Window',
      duration: '12 mins',
      difficulty: 'Crucial',
      summary: 'Master the feeding timeline from pregnancy to 24 months, focusing on exclusive breastfeeding and timely complementary feeding.',
      objectives: [
        'Understand the timeline of the First 1,000 Days (conception to age 2).',
        'Practice exclusive breastfeeding for the first 6 months without water or formula.',
        'Know when and how to start introducing soft solid foods at exactly 6 months.'
      ],
      content: `
        <h3>The Golden Window: Conception to 2 Years</h3>
        <p>80% of a child’s brain develops in the first 1,000 days. This period is the single best opportunity to build a child’s lifelong health, immunity, and learning capacity.</p>

        <div style="background: #F0FDF4; border-left: 4px solid #16A34A; padding: 1rem; margin: 1rem 0; border-radius: 4px;">
          <h4 style="color: #14532D; margin-bottom: 0.35rem;">Key Feeding Stages:</h4>
          <p><strong>0 to 6 Months:</strong> Exclusive Breastfeeding only. Breast milk provides all necessary water, fats, antibodies, and vitamins. Giving plain water, tea, or rice broth dilutes nutrient intake and introduces infections.</p>
          <p style="margin-top: 0.5rem;"><strong>At 6 Months:</strong> Introduce safe, nutrient-dense complementary foods while continuing breastfeeding up to 2 years or beyond.</p>
        </div>
      `,
      quiz: [
        {
          id: 'q2-1',
          question: 'What should a baby be fed during the first 6 months of life?',
          options: [
            'Rice water (am), formula, and tea',
            'Exclusively breast milk (no water, formula, or solids)',
            'Mashed bananas and cow milk',
            'Lugaw with sugar'
          ],
          answerIndex: 1,
          explanation: 'WHO and DOH recommend exclusive breastfeeding for the first 6 months. Breast milk satisfies all thirst and hunger while protecting against diarrhea and respiratory infections.'
        },
        {
          id: 'q2-2',
          question: 'At what age should soft complementary foods be introduced alongside breast milk?',
          options: [
            'At 2 months',
            'At 4 months',
            'At exactly 6 months',
            'At 12 months'
          ],
          answerIndex: 2,
          explanation: 'At 6 months, a baby’s energy and micronutrient requirements begin to exceed what breast milk alone can provide, making complementary feeding essential.'
        }
      ]
    },

    {
      id: 'mod-3',
      number: 'Module 3',
      title: 'Pinggang Pinoy: Local & Affordable Foods',
      duration: '15 mins',
      difficulty: 'Practical Skills',
      summary: 'Cook balanced, nutrient-dense meals for your family using accessible Filipino staples: Malunggay, Monggo, Camote, Dilis, and Eggs.',
      objectives: [
        'Balance every meal with Go (Energy), Grow (Protein), and Glow (Vitamins) foods.',
        'Use backyard vegetables like Malunggay to fortify baby food affordably.',
        'Replace expensive processed snacks with highly nutritious, low-cost local foods.'
      ],
      content: `
        <h3>Pinggang Pinoy: The Balanced Community Plate</h3>
        <p>You do not need expensive groceries to feed your child well. The best superfoods grow right in our backyards and local markets:</p>

        <div class="grid-3" style="margin: 1.25rem 0;">
          <div style="background:#FFFBEB; border:1px solid #FDE68A; padding:1rem; border-radius:8px;">
            <h4 style="color:#92400E;">🟡 GO Foods (Energy)</h4>
            <p style="font-size:0.85rem; color:#78350F; margin-top:0.35rem;">Rice, Sweet Potato (Camote), Corn, Saba banana, Gabi. Provides stamina for active toddlers.</p>
          </div>
          <div style="background:#FEF2F2; border:1px solid #FECACA; padding:1rem; border-radius:8px;">
            <h4 style="color:#991B1B;">🔴 GROW Foods (Protein)</h4>
            <p style="font-size:0.85rem; color:#7F1D1D; margin-top:0.35rem;">Eggs, Monggo beans, Dilis (dried anchovies), Tilapia, Tofu. Builds strong muscles and bones.</p>
          </div>
          <div style="background:#F0FDF4; border:1px solid #BBF7D0; padding:1rem; border-radius:8px;">
            <h4 style="color:#166534;">🟢 GLOW Foods (Vitamins)</h4>
            <p style="font-size:0.85rem; color:#14532D; margin-top:0.35rem;">Malunggay leaves, Kalabasa (squash), Papaya, Kangkong. Shields the immune system from illness.</p>
          </div>
        </div>

        <div style="background:#EBF8FF; border:1px solid #BEE3F8; padding:1rem; border-radius:8px;">
          <h4 style="color:#2B6CB0;">💡 Community Nutrition Tip: The Power of Dilis & Malunggay</h4>
          <p style="font-size:0.88rem; color:#2D3748; margin-top:0.25rem;">Pounding dried dilis into a fine powder and stirring it into baby lugaw adds massive amounts of calcium, zinc, and protein for less than ₱5 per meal!</p>
        </div>
      `,
      quiz: [
        {
          id: 'q3-1',
          question: 'Which local vegetable is considered a nutrition powerhouse for preventing micronutrient stunting?',
          options: [
            'Cabbage',
            'Malunggay (Moringa leaves)',
            'Cucumber',
            'Pickled radish'
          ],
          answerIndex: 1,
          explanation: 'Malunggay is packed with vitamin A, iron, calcium, and plant protein, making it one of the most cost-effective foods to prevent child stunting.'
        },
        {
          id: 'q3-2',
          question: 'What is an affordable and practical way to enrich plain rice porridge (lugaw) for a 9-month-old?',
          options: [
            'Adding white sugar and sweetened condensed milk',
            'Adding powdered dilis (dried fish), mashed egg yolk, and finely chopped malunggay',
            'Adding artificial seasoning cubes with high sodium',
            'Using canned soda for sweetness'
          ],
          answerIndex: 1,
          explanation: 'Plain lugaw is mostly water and simple carbs. Enriching it with egg yolk, pounded dilis, and malunggay turns it into a complete Go-Grow-Glow meal.'
        }
      ]
    },

    {
      id: 'mod-4',
      number: 'Module 4',
      title: 'Age-Appropriate Feeding (6 to 23 Months)',
      duration: '10 mins',
      difficulty: 'Practical Skills',
      summary: 'Learn the correct textures, portion sizes, and daily meal frequencies for infants and toddlers to ensure steady weight gain.',
      objectives: [
        'Progress texture from thick puree (6–8 mos) to finely chopped (9–11 mos) to family meals (12–23 mos).',
        'Learn appropriate portion sizes per meal to prevent infant undernutrition.',
        'Understand why responsive feeding encourages toddlers to finish nutritious meals.'
      ],
      content: `
        <h3>Feeding Frequency & Texture Progression</h3>
        <p>Infant stomachs are small (about the size of their fist). Each spoonful must be calorie-dense and nutrient-rich.</p>

        <div class="table-responsive" style="margin: 1rem 0;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Age Group</th>
                <th>Texture & Consistency</th>
                <th>Daily Frequency</th>
                <th>Portion Per Meal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>6 to 8 Months</strong></td>
                <td>Thick porridge (does not run off spoon), smooth purees</td>
                <td>2 to 3 meals/day + breast milk</td>
                <td>Start 2–3 tablespoons; build to 1/2 cup</td>
              </tr>
              <tr>
                <td><strong>9 to 11 Months</strong></td>
                <td>Finely chopped or mashed foods, finger foods</td>
                <td>3 to 4 meals/day + 1 snack</td>
                <td>1/2 cup to 3/4 cup</td>
              </tr>
              <tr>
                <td><strong>12 to 23 Months</strong></td>
                <td>Family foods, bite-sized cuts</td>
                <td>3 to 4 meals/day + 2 healthy snacks</td>
                <td>3/4 cup to 1 full cup</td>
              </tr>
            </tbody>
          </table>
        </div>
      `,
      quiz: [
        {
          id: 'q4-1',
          question: 'How should the consistency of complementary porridge (lugaw) be for a 7-month-old infant?',
          options: [
            'Very watery so it drips immediately from the spoon like soup',
            'Thick enough that it stays on the spoon and does not easily slide off',
            'Hard and dry like regular uncooked rice',
            'Mixed with carbonated drinks'
          ],
          answerIndex: 1,
          explanation: 'Watery lugaw fills the baby’s stomach with water rather than nutrients. Thick porridge provides concentrated energy and nutrients.'
        }
      ]
    },

    {
      id: 'mod-5',
      number: 'Module 5',
      title: 'Hygiene, Water & Safe Food Preparation',
      duration: '8 mins',
      difficulty: 'Essential',
      summary: 'Prevent diarrhea and intestinal infections (environmental enteropathy) that block nutrient absorption and cause stunting.',
      objectives: [
        'Identify proper handwashing times before preparing food and feeding children.',
        'Ensure clean, safe drinking water using boiling or chlorination.',
        'Prevent cross-contamination during food storage at home.'
      ],
      content: `
        <h3>Clean Food = Healthy Absorption</h3>
        <p>Even the most nutritious food will not help a child grow if frequent bouts of diarrhea wash nutrients out of their body. Recurrent intestinal infections cause gut inflammation, preventing nutrient absorption.</p>

        <div class="calculator-result-box">
          <h4 style="color:#0E3D26;">5 Critical Times for Handwashing with Soap:</h4>
          <ol style="margin-left: 1.25rem; line-height: 1.7; margin-top: 0.5rem;">
            <li>Before preparing food or cooking.</li>
            <li>Before feeding a baby or eating.</li>
            <li>After cleaning a baby's bottom or changing diapers.</li>
            <li>After using the toilet or latrine.</li>
            <li>After handling poultry, livestock, or garbage.</li>
          </ol>
        </div>
      `,
      quiz: [
        {
          id: 'q5-1',
          question: 'How does repeated diarrhea directly contribute to child stunting?',
          options: [
            'It makes children sleep longer',
            'It damages the gut lining and prevents the body from absorbing essential nutrients',
            'It has no effect on child growth',
            'It only causes temporary hair loss'
          ],
          answerIndex: 1,
          explanation: 'Repeated bouts of diarrhea and gut inflammation (environmental enteropathy) prevent children from absorbing proteins and minerals, directly triggering stunting.'
        }
      ]
    }
  ],

  // Affordable Local Philippine Recipes (Budget-Friendly Go-Grow-Glow Meals)
  recipes: [
    {
      id: 'rec-1',
      title: 'Enriched Ginataang Monggo with Malunggay & Dilis',
      costPerServing: '₱28 / serving',
      targetAge: '8+ months & Family',
      prepTime: '25 mins',
      foodGroups: {
        go: 'Rice / Sweet Potato',
        grow: 'Mung beans (Monggo) & Dried Anchovies (Dilis)',
        glow: 'Malunggay leaves & Fresh Tomatoes'
      },
      ingredients: [
        '1/2 cup cooked monggo beans (mashed for toddlers)',
        '2 tbsp powdered or pounded dilis (calcium-rich)',
        '1 cup fresh malunggay leaves',
        '1/4 cup coconut milk (healthy fats for brain development)',
        '1 small clove garlic & 1/2 tomato'
      ],
      steps: [
        'Boil monggo until tender and mash for infant consistency.',
        'Lightly saute garlic and tomato in a teaspoon of oil.',
        'Add coconut milk and pounded dilis, simmering for 5 minutes.',
        'Stir in fresh malunggay leaves during the last 2 minutes.',
        'Serve warm with soft rice or mashed camote.'
      ],
      keyNutrients: 'High Iron, Zinc, Calcium, Plant & Fish Protein, Healthy Fats'
    },
    {
      id: 'rec-2',
      title: 'Camote-Egg Mash with Steamed Kalabasa',
      costPerServing: '₱22 / serving',
      targetAge: '6 to 11 months',
      prepTime: '15 mins',
      foodGroups: {
        go: 'Yellow Camote (Sweet Potato)',
        grow: 'Boiled Egg Yolk',
        glow: 'Steamed Kalabasa (Squash)'
      },
      ingredients: [
        '1/2 medium yellow sweet potato (camote)',
        '1/4 cup sliced kalabasa',
        '1 hardboiled egg yolk',
        '1 tsp breast milk or clean warm water',
        '1/2 tsp coconut or vegetable oil (for vitamin A absorption)'
      ],
      steps: [
        'Steam camote and kalabasa until fork-tender.',
        'Mash together thoroughly with a fork.',
        'Blend in the cooked egg yolk and a drop of healthy cooking oil.',
        'Thin with breast milk or warm water to desired consistency.'
      ],
      keyNutrients: 'Beta-Carotene (Vitamin A), Choline for Brain Growth, Healthy Calories'
    },
    {
      id: 'rec-3',
      title: 'NutriLugaw with Tilapia Flakes & Malunggay',
      costPerServing: '₱32 / serving',
      targetAge: '9+ months & Toddlers',
      prepTime: '20 mins',
      foodGroups: {
        go: 'Thick Rice Porridge',
        grow: 'Fresh Tilapia / Bangus flakes',
        glow: 'Finely minced Malunggay & Ginger'
      },
      ingredients: [
        '1/2 cup thick cooked rice porridge',
        '2 tbsp flaked steamed tilapia (carefully deboned)',
        '1 tbsp finely chopped malunggay leaves',
        'A tiny slice of ginger (remove before feeding)',
        '1/2 tsp oil'
      ],
      steps: [
        'Steam the tilapia fish and meticulously inspect for bones.',
        'Flake the fish finely.',
        'Stir fish flakes and chopped malunggay into hot simmering lugaw.',
        'Cook for 3 minutes until leaves soften.',
        'Cool to body temperature before feeding the toddler.'
      ],
      keyNutrients: 'Lean Fish Protein, Omega-3 Fatty Acids, Vitamin C, Iron'
    },
    {
      id: 'rec-4',
      title: 'Saba Banana & Peanut Butter Mash',
      costPerServing: '₱18 / serving',
      targetAge: '8 to 23 months (Snack)',
      prepTime: '5 mins',
      foodGroups: {
        go: 'Ripe Saba Banana',
        grow: 'Natural Peanut Butter / Crushed Peanuts',
        glow: 'Ripe Papaya cubes'
      },
      ingredients: [
        '1 ripe boiled or baked saba banana',
        '1 tsp plain creamy peanut butter (no added sugar)',
        '2 tbsp mashed ripe papaya'
      ],
      steps: [
        'Boil saba banana until soft, then mash smoothly with a fork.',
        'Mix in creamy peanut butter for concentrated healthy fats and protein.',
        'Top with mashed papaya for sweetness and digestion support.'
      ],
      keyNutrients: 'Potassium, Dietary Fiber, Energy-Dense Healthy Fats'
    }
  ],

  // Initial Sample Children Malnutrition Registry (for Community Health Workers & MHO)
  initialChildren: [
    {
      id: 'ch-101',
      name: 'Ethan Kyle Ramos',
      ageMonths: 18,
      sex: 'Male',
      parentName: 'Maria Ramos',
      parentPhone: '0917-234-8891',
      barangay: 'Barangay San Jose',
      heightCm: 74.2,
      weightKg: 8.4,
      muacMm: 118,
      status: 'Stunted',
      hfaStatus: 'Stunted',
      wfhStatus: 'Normal',
      wfaStatus: 'Underweight',
      muacStatus: 'Moderate',
      improved: false,
      lastAssessed: '2026-08-15',
      assignedModules: ['mod-1', 'mod-3', 'mod-4'],
      completedModules: ['mod-1', 'mod-3'],
      quizScore: 92,
      notes: 'Parent Maria completed Module 1 & 3. Has started adding malunggay and monggo to daily meals.'
    },
    {
      id: 'ch-102',
      name: 'Sophia Nicole Bautista',
      ageMonths: 14,
      sex: 'Female',
      parentName: 'Elena Bautista',
      parentPhone: '0928-765-4321',
      barangay: 'Barangay Santa Maria',
      heightCm: 71.0,
      weightKg: 6.9,
      muacMm: 112,
      status: 'Wasted',
      hfaStatus: 'Normal',
      wfhStatus: 'Wasted',
      wfaStatus: 'Underweight',
      muacStatus: 'Severe',
      improved: false,
      lastAssessed: '2026-08-20',
      assignedModules: ['mod-1', 'mod-2', 'mod-4', 'mod-5'],
      completedModules: ['mod-1'],
      quizScore: 78,
      notes: 'Severe wasting noted. Mother advised on immediate frequency increase and WASH hygiene.'
    },
    {
      id: 'ch-103',
      name: 'Gabriel Santos',
      ageMonths: 22,
      sex: 'Male',
      parentName: 'Rosa Santos',
      parentPhone: '0919-445-1234',
      barangay: 'Barangay San Isidro',
      heightCm: 79.5,
      weightKg: 10.5,
      muacMm: 132,
      status: 'Improved',
      hfaStatus: 'Normal',
      wfhStatus: 'Normal',
      wfaStatus: 'Normal',
      muacStatus: 'Normal',
      improved: true,
      lastAssessed: '2026-09-02',
      assignedModules: ['mod-1', 'mod-2', 'mod-3', 'mod-4', 'mod-5'],
      completedModules: ['mod-1', 'mod-2', 'mod-3', 'mod-4', 'mod-5'],
      quizScore: 100,
      notes: 'Child graduated from Stunted to Normal height-for-age trajectory following 6 months of daily enriched NutriLugaw!'
    },
    {
      id: 'ch-104',
      name: 'Althea Mae Dela Cruz',
      ageMonths: 11,
      sex: 'Female',
      parentName: 'Lourdes Dela Cruz',
      parentPhone: '0905-112-9876',
      barangay: 'Barangay Poblacion',
      heightCm: 68.2,
      weightKg: 7.2,
      muacMm: 120,
      status: 'Stunted',
      hfaStatus: 'Stunted',
      wfhStatus: 'Normal',
      wfaStatus: 'Underweight',
      muacStatus: 'Moderate',
      improved: false,
      lastAssessed: '2026-08-28',
      assignedModules: ['mod-1', 'mod-3'],
      completedModules: ['mod-1'],
      quizScore: 85,
      notes: 'Mother Lourdes active in community class. Requested extra meal planning templates for Camote-Egg mash.'
    },
    {
      id: 'ch-105',
      name: 'Lucas Nathaniel Reyes',
      ageMonths: 9,
      sex: 'Male',
      parentName: 'Catherine Reyes',
      parentPhone: '0918-999-3321',
      barangay: 'Barangay San Jose',
      heightCm: 70.8,
      weightKg: 8.6,
      muacMm: 130,
      status: 'Normal',
      hfaStatus: 'Normal',
      wfhStatus: 'Normal',
      wfaStatus: 'Normal',
      muacStatus: 'Normal',
      improved: false,
      lastAssessed: '2026-09-01',
      assignedModules: ['mod-1', 'mod-2', 'mod-3'],
      completedModules: ['mod-1', 'mod-2', 'mod-3'],
      quizScore: 95,
      notes: 'Healthy baseline monitoring. Mother practices exclusive breastfeeding and appropriate complementary feeding.'
    },
    {
      id: 'ch-106',
      name: 'Princess Joy Mendoza',
      ageMonths: 20,
      sex: 'Female',
      parentName: 'Janice Mendoza',
      parentPhone: '0915-443-8877',
      barangay: 'Barangay Santa Maria',
      heightCm: 76.8,
      weightKg: 9.8,
      muacMm: 127,
      status: 'Improved',
      hfaStatus: 'Normal',
      wfhStatus: 'Normal',
      wfaStatus: 'Normal',
      muacStatus: 'Normal',
      improved: true,
      lastAssessed: '2026-09-05',
      assignedModules: ['mod-1', 'mod-3', 'mod-4'],
      completedModules: ['mod-1', 'mod-3', 'mod-4'],
      quizScore: 94,
      notes: 'Weight and height increased steadily. Mother Janice successfully replaced junk snacks with Saba banana and monggo.'
    }
  ],

  // Initial Submitted Community Reports for Municipal Health Office
  initialReports: [
    {
      reportId: 'REP-2026-0901',
      barangay: 'Barangay San Jose',
      chwName: 'Sister Teresa Lim, BNS',
      submittedDate: '2026-09-01',
      totalChildren: 48,
      stuntedCount: 6,
      wastedCount: 2,
      underweightCount: 5,
      improvedCount: 7,
      stuntingRate: '12.5%',
      stuntingReductionAchieved: '-2.1%',
      status: 'Verified & Approved',
      notes: 'Significant improvement in complimentary feeding adoption after distributing NutriLearn meal templates.'
    },
    {
      reportId: 'REP-2026-0904',
      barangay: 'Barangay Santa Maria',
      chwName: 'Corazon Rivera, BHW Lead',
      submittedDate: '2026-09-04',
      totalChildren: 55,
      stuntedCount: 8,
      wastedCount: 3,
      underweightCount: 7,
      improvedCount: 6,
      stuntingRate: '14.5%',
      stuntingReductionAchieved: '-1.8%',
      status: 'Verified & Approved',
      notes: 'Water sanitation campaign integrated with Module 5 to curb recurrent diarrheal incidence.'
    },
    {
      reportId: 'REP-2026-0908',
      barangay: 'Barangay San Isidro',
      chwName: 'Marilou Dizon, BNS',
      submittedDate: '2026-09-08',
      totalChildren: 42,
      stuntedCount: 4,
      wastedCount: 1,
      underweightCount: 3,
      improvedCount: 9,
      stuntingRate: '9.5%',
      stuntingReductionAchieved: '-3.2%',
      status: 'Pending Review',
      notes: 'High compliance rate: 88% of registered parents scored above 85% on knowledge assessments.'
    }
  ],

  // Initial Community & Municipal Announcements
  initialAnnouncements: [
    {
      id: 'ann-1',
      title: 'Municipal Supplementary Food Pack & MNP Distribution',
      content: 'All parents of enrolled malnourished and stunted infants (6-23 months) are advised to claim their bi-weekly rations at their designated Barangay Health Centers this Thursday and Friday from 8:00 AM to 3:00 PM. BHWs will assist with height and weight verifications.',
      category: 'Ration Distribution',
      priority: 'high',
      authorName: 'Dr. Elena Cruz, MHO',
      authorRole: 'mho',
      authorDesignation: 'Municipal Health Officer',
      targetAudience: 'both', // Admin option: Both PARENT & BHW
      targetBarangays: ['Barangay San Jose', 'Barangay Santa Maria', 'Barangay San Isidro', 'Barangay Poblacion'],
      barangay: 'All Barangays',
      createdAt: '2026-09-08T09:00:00.000Z',
      pinned: true
    },
    {
      id: 'ann-2',
      title: 'MHO Internal Directive: Submission of September OPT Plus & WHO Recalibration Data',
      content: 'Notice to all BHWs and BNS in Barangays San Jose, Santa Maria, San Isidro, and Poblacion: Please finalize and submit your consolidated monthly malnutrition census via NutriLearn by September 15. Ensure all MUAC tape measurements are cross-checked before submitting electronic reports.',
      category: 'Health Worker Directive',
      priority: 'urgent',
      authorName: 'Dr. Elena Cruz, MHO',
      authorRole: 'mho',
      authorDesignation: 'Municipal Health Officer',
      targetAudience: 'bhw', // Admin option: BHW only
      targetBarangays: ['Barangay San Jose', 'Barangay Santa Maria', 'Barangay San Isidro', 'Barangay Poblacion'],
      barangay: 'All Barangays',
      createdAt: '2026-09-07T14:30:00.000Z',
      pinned: true
    },
    {
      id: 'ann-3',
      title: 'Barangay San Jose: Community Catch-up Weighing & Deworming Day',
      content: 'San Jose Health Center will conduct community-wide growth monitoring, Height-for-Age re-assessments, and Deworming for toddlers aged 12-59 months this Saturday, Sept 12 starting 8:30 AM. Municipal Health team will be present for spot validation.',
      category: 'Growth Weigh-in',
      priority: 'normal',
      authorName: 'Sister Teresa Lim, BNS',
      authorRole: 'chw',
      authorDesignation: 'Barangay Nutrition Scholar',
      targetAudience: 'admin_parent', // BHW option: Both ADMIN and PARENT
      targetBarangays: ['Barangay San Jose'],
      barangay: 'Barangay San Jose',
      createdAt: '2026-09-06T10:15:00.000Z',
      pinned: false
    },
    {
      id: 'ann-4',
      title: 'Free Fresh Vegetables & Fortified Monggo Packets for Active Pinggang Pinoy Learners',
      content: 'Caregivers who complete Learning Module 2 and Module 3 this week can pick up fresh malunggay bundles, squash, and fortified monggo packets at the San Jose Barangay Hall. Show your completed quiz score on your phone!',
      category: 'Parent Incentive',
      priority: 'normal',
      authorName: 'Sister Teresa Lim, BNS',
      authorRole: 'chw',
      authorDesignation: 'Barangay Nutrition Scholar',
      targetAudience: 'parent', // BHW option: PARENT only
      targetBarangays: ['Barangay San Jose'],
      barangay: 'Barangay San Jose',
      createdAt: '2026-09-05T16:00:00.000Z',
      pinned: false
    },
    {
      id: 'ann-5',
      title: 'Targeted Supplementary Nutrition Rations for Barangay Santa Maria',
      content: 'Due to elevated stunting burden (38.1%), additional fortified rice and ready-to-use therapeutic food packs have been dispatched specifically to the Santa Maria Health Center. Claiming opens this coming Monday for verified priority beneficiaries.',
      category: 'Ration Distribution',
      priority: 'high',
      authorName: 'Dr. Elena Cruz, MHO',
      authorRole: 'mho',
      authorDesignation: 'Municipal Health Officer',
      targetAudience: 'both', // Admin option: Both PARENT & BHW
      targetBarangays: ['Barangay Santa Maria'],
      barangay: 'Barangay Santa Maria',
      createdAt: '2026-09-09T08:00:00.000Z',
      pinned: false
    }
  ]
};

// WHO Simplified Anthropometric Standards for Community Health Workers
const WHO_STANDARDS = {
  // Height-for-Age median & -2 SD thresholds (approximate reference points for 6-24 months)
  heightForAge: {
    6:  { maleCutoff: 63.3, femaleCutoff: 61.2 },
    9:  { maleCutoff: 67.5, femaleCutoff: 65.3 },
    12: { maleCutoff: 71.0, femaleCutoff: 68.9 },
    15: { maleCutoff: 74.1, femaleCutoff: 72.0 },
    18: { maleCutoff: 76.9, femaleCutoff: 74.9 },
    21: { maleCutoff: 79.4, femaleCutoff: 77.5 },
    24: { maleCutoff: 81.7, femaleCutoff: 80.0 }
  },
  // Weight-for-Age median & -2 SD thresholds
  weightForAge: {
    6:  { maleCutoff: 6.4, femaleCutoff: 5.7 },
    9:  { maleCutoff: 7.2, femaleCutoff: 6.5 },
    12: { maleCutoff: 7.7, femaleCutoff: 7.0 },
    15: { maleCutoff: 8.3, femaleCutoff: 7.6 },
    18: { maleCutoff: 8.8, femaleCutoff: 8.1 },
    21: { maleCutoff: 9.2, femaleCutoff: 8.6 },
    24: { maleCutoff: 9.7, femaleCutoff: 9.0 }
  },
  // MUAC thresholds (Mid-Upper Arm Circumference in mm) for ages 6 to 59 months
  muac: {
    severe: 115,  // < 115 mm (Red: SAM - Severe Acute Malnutrition)
    moderate: 125 // 115 - 124 mm (Yellow: MAM - Moderate Acute Malnutrition)
                  // >= 125 mm (Green: Normal)
  }
};
