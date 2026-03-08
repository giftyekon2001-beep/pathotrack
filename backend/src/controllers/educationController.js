export const getEducationContent = async (req, res) => {
  try {
    const educationContent = [
      {
        id: 1,
        category: 'Hygiene Practices',
        title: 'Hand Hygiene',
        description: 'Proper handwashing is one of the most effective ways to prevent infection',
        content: 'Wash your hands frequently with soap and clean water for at least 20 seconds, especially before eating, after using the toilet, and after being in public places. Use hand sanitizer if soap and water are not available.',
        image: '/images/hand-hygiene.jpg'
      },
      {
        id: 2,
        category: 'Hygiene Practices',
        title: 'Respiratory Hygiene',
        description: 'Prevent spread of respiratory diseases',
        content: 'Cover your mouth and nose with a tissue when you cough or sneeze. If a tissue is not available, cough or sneeze into your elbow. Dispose of tissues properly and wash hands afterward.',
        image: '/images/respiratory-hygiene.jpg'
      },
      {
        id: 3,
        category: 'Food Safety',
        title: 'Safe Food Handling',
        description: 'Prevent foodborne illnesses through proper food handling',
        content: 'Cook food to safe internal temperatures, keep raw and cooked foods separate, refrigerate food promptly, and wash fruits and vegetables before eating. Avoid eating food left at room temperature for more than 2 hours.',
        image: '/images/food-safety.jpg'
      },
      {
        id: 4,
        category: 'Food Safety',
        title: 'Water Safety',
        description: 'Ensure clean drinking water',
        content: 'Drink safe, clean water. Boil water if you are unsure about its safety. Use water purification methods when needed. Avoid drinking water from untreated sources.',
        image: '/images/water-safety.jpg'
      },
      {
        id: 5,
        category: 'Infection Prevention',
        title: 'Vaccination',
        description: 'Protect yourself and others through vaccination',
        content: 'Keep up with recommended vaccinations. Vaccinations protect you and those around you from serious diseases. Consult your healthcare provider for the vaccinations you need.',
        image: '/images/vaccination.jpg'
      },
      {
        id: 6,
        category: 'Infection Prevention',
        title: 'Social Distancing',
        description: 'Reduce disease transmission',
        content: 'Maintain physical distance from people who are sick. During disease outbreaks, follow local health guidelines on social distancing and quarantine measures.',
        image: '/images/social-distancing.jpg'
      },
      {
        id: 7,
        category: 'Medication',
        title: 'Proper Antibiotic Use',
        description: 'Use antibiotics responsibly to prevent resistance',
        content: 'Take antibiotics only as prescribed by a healthcare provider. Complete the full course even if you feel better. Never share antibiotics with others. Do not use antibiotics for viral infections.',
        image: '/images/antibiotic-use.jpg'
      },
      {
        id: 8,
        category: 'Medication',
        title: 'Fever Management',
        description: 'How to manage fever at home',
        content: 'Rest, drink plenty of fluids, and use fever-reducing medications as directed. Monitor your temperature. Seek medical attention if fever persists beyond 3 days or reaches 39°C (102.2°F).',
        image: '/images/fever-management.jpg'
      },
      {
        id: 9,
        category: 'Environmental Health',
        title: 'Environmental Sanitation',
        description: 'Maintain clean surroundings',
        content: 'Keep your living spaces clean and well-ventilated. Dispose of waste properly. Maintain proper sanitation facilities. Prevent mosquito breeding by eliminating stagnant water.',
        image: '/images/environmental-health.jpg'
      },
      {
        id: 10,
        category: 'Nutrition',
        title: 'Healthy Nutrition',
        description: 'Support your immune system with proper nutrition',
        content: 'Eat a balanced diet rich in fruits, vegetables, whole grains, and proteins. Stay hydrated. Get adequate sleep. Regular exercise boosts immunity and overall health.',
        image: '/images/nutrition.jpg'
      }
    ];

    res.json(educationContent);
  } catch (error) {
    console.error('Get education content error:', error);
    res.status(500).json({ error: 'Failed to fetch education content' });
  }
};

export const getEducationByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const allContent = await getEducationContent({ json: () => {} }, res);
    // Since we're returning data, we need to handle this differently
    
    res.json({
      message: 'Get education by category implementation'
    });
  } catch (error) {
    console.error('Get education by category error:', error);
    res.status(500).json({ error: 'Failed to fetch education content' });
  }
};