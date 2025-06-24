/**
 * Ethics scenarios database for EthicsPing challenges
 * Extracted from challenge-content.ts for better maintainability
 */

import type { EthicsScenario } from '../types/challenge-content';

export const ETHICS_SCENARIOS: EthicsScenario[] = [
  // Privacy & Surveillance
  {
    id: 'autonomous_vehicle_dilemma',
    scenario: 'An autonomous vehicle\'s AI must choose between hitting one person or swerving to hit five people. The car has milliseconds to decide.',
    choices: [
      {
        id: 'stay_course',
        title: 'Stay the course',
        description: 'Continue straight, minimizing harm to the greater number',
        feedback: 'This follows utilitarian ethics - maximizing overall welfare.',
        ethicalFramework: ['utilitarianism'],
        consequences: ['One person injured/killed', 'Five people avoid harm'],
        stakeholders: ['Individual pedestrian', 'Group of pedestrians', 'Car occupants', 'Society']
      },
      {
        id: 'swerve_away',
        title: 'Swerve to avoid',
        description: 'Actively swerve, even if it means potentially greater harm',
        feedback: 'This reflects the principle of not actively causing harm versus allowing it.',
        ethicalFramework: ['deontological'],
        consequences: ['Active decision to harm many', 'Avoids being cause of single death'],
        stakeholders: ['Individual pedestrian', 'Group of pedestrians', 'Car occupants']
      },
      {
        id: 'random_choice',
        title: 'Random decision',
        description: 'Let chance decide to avoid moral responsibility',
        feedback: 'This avoids making a moral judgment but may not minimize harm.',
        ethicalFramework: ['moral_luck'],
        consequences: ['Unpredictable outcome', 'No active moral choice'],
        stakeholders: ['All potential victims', 'Programmers', 'Society']
      }
    ],
    category: 'autonomy',
    difficulty: 'hard',
    ethicalFrameworks: ['utilitarianism', 'deontological', 'virtue_ethics'],
    realWorldContext: 'This dilemma is actively being debated as autonomous vehicles become more common.'
  },
  
  {
    id: 'privacy_vs_security',
    scenario: 'A tech company can prevent a terrorist attack by scanning all user messages, but this would violate privacy promises made to millions of users.',
    choices: [
      {
        id: 'scan_messages',
        title: 'Scan the messages',
        description: 'Prevent the attack by violating privacy temporarily',
        feedback: 'Prioritizing immediate safety over privacy rights.',
        ethicalFramework: ['consequentialism'],
        consequences: ['Attack prevented', 'Mass privacy violation', 'Trust in company damaged'],
        stakeholders: ['General public', 'Potential victims', 'Company users', 'Government']
      },
      {
        id: 'respect_privacy',
        title: 'Respect privacy',
        description: 'Honor the privacy commitment regardless of consequences',
        feedback: 'Upholding rights and promises even when difficult.',
        ethicalFramework: ['deontological', 'rights-based'],
        consequences: ['Privacy maintained', 'Potential attack occurs', 'Company integrity preserved'],
        stakeholders: ['Company users', 'Potential victims', 'Privacy advocates']
      },
      {
        id: 'seek_warrant',
        title: 'Seek legal authorization',
        description: 'Work through legal channels even if it takes time',
        feedback: 'Balancing security needs with legal and ethical processes.',
        ethicalFramework: ['rule_of_law'],
        consequences: ['Legal process followed', 'Potential delay in prevention', 'Democratic oversight'],
        stakeholders: ['Legal system', 'General public', 'Company', 'Government']
      }
    ],
    category: 'privacy',
    difficulty: 'medium',
    ethicalFrameworks: ['consequentialism', 'deontological', 'legal_positivism'],
    realWorldContext: 'Tech companies regularly face requests for user data in security investigations.'
  },
  
  // AI and Fairness
  {
    id: 'ai_hiring_bias',
    scenario: 'Your AI hiring system is more accurate than humans but shows bias against certain demographic groups. It helps qualified candidates overall but disadvantages some groups.',
    choices: [
      {
        id: 'keep_system',
        title: 'Keep the AI system',
        description: 'Focus on overall accuracy and meritocracy',
        feedback: 'Prioritizing efficiency but potentially perpetuating systemic bias.',
        ethicalFramework: ['meritocracy'],
        consequences: ['Higher overall hiring accuracy', 'Systemic bias continues', 'Some groups disadvantaged'],
        stakeholders: ['Job applicants', 'Employers', 'Disadvantaged groups', 'Society']
      },
      {
        id: 'remove_system',
        title: 'Remove the system',
        description: 'Return to human hiring to avoid algorithmic bias',
        feedback: 'Avoiding algorithmic bias but potentially accepting human bias.',
        ethicalFramework: ['justice', 'equality'],
        consequences: ['Lower overall accuracy', 'Different bias patterns', 'Human subjectivity returns'],
        stakeholders: ['Job applicants', 'HR departments', 'Company performance']
      },
      {
        id: 'adjust_algorithm',
        title: 'Adjust for fairness',
        description: 'Modify the AI to be more equitable across groups',
        feedback: 'Balancing accuracy with fairness considerations.',
        ethicalFramework: ['distributive_justice'],
        consequences: ['Reduced bias', 'Potentially lower accuracy', 'Fairer representation'],
        stakeholders: ['All job applicants', 'Employers', 'AI developers', 'Society']
      }
    ],
    category: 'fairness',
    difficulty: 'medium',
    ethicalFrameworks: ['distributive_justice', 'equality', 'meritocracy'],
    realWorldContext: 'Many companies use AI in hiring, raising questions about algorithmic fairness.'
  },
  
  // Medical Ethics
  {
    id: 'medical_resource_allocation',
    scenario: 'During a pandemic, there\'s only one ventilator left. Two patients need it equally: a 30-year-old with a good prognosis and a 70-year-old with a fair prognosis.',
    choices: [
      {
        id: 'younger_patient',
        title: 'Give to younger patient',
        description: 'Prioritize based on life years saved',
        feedback: 'Maximizing total life years - a common medical ethics approach.',
        ethicalFramework: ['utilitarianism', 'quality_adjusted_life_years'],
        consequences: ['More life years saved', 'Age-based discrimination concern', 'Efficient resource use'],
        stakeholders: ['Both patients', 'Families', 'Medical staff', 'Healthcare system']
      },
      {
        id: 'first_come',
        title: 'First come, first served',
        description: 'Give to whoever arrived first',
        feedback: 'Equal treatment regardless of outcomes - procedural fairness.',
        ethicalFramework: ['procedural_justice'],
        consequences: ['Fair process', 'Potentially fewer life years saved', 'Equal dignity respected'],
        stakeholders: ['Both patients', 'Medical staff', 'Healthcare system']
      },
      {
        id: 'lottery_system',
        title: 'Random lottery',
        description: 'Use chance to decide fairly',
        feedback: 'Equal dignity and worth of all lives - avoiding discrimination.',
        ethicalFramework: ['equal_dignity'],
        consequences: ['No discrimination', 'Random outcome', 'Equal treatment'],
        stakeholders: ['Both patients', 'Families', 'Medical ethics committees']
      }
    ],
    category: 'welfare',
    difficulty: 'hard',
    ethicalFrameworks: ['medical_ethics', 'utilitarianism', 'equality'],
    realWorldContext: 'Healthcare rationing decisions became critical during the COVID-19 pandemic.'
  },
  
  // Environmental Ethics
  {
    id: 'climate_vs_economy',
    scenario: 'A government can implement strict environmental policies that will significantly reduce carbon emissions but cause widespread job losses in traditional industries.',
    choices: [
      {
        id: 'environment_first',
        title: 'Prioritize environment',
        description: 'Implement strict policies despite economic impact',
        feedback: 'Prioritizing long-term planetary health over short-term economic stability.',
        ethicalFramework: ['environmental_ethics', 'intergenerational_justice'],
        consequences: ['Reduced emissions', 'Job losses', 'Long-term sustainability'],
        stakeholders: ['Future generations', 'Current workers', 'Global environment', 'Economy']
      },
      {
        id: 'gradual_transition',
        title: 'Gradual transition',
        description: 'Slower change with job retraining programs',
        feedback: 'Balancing environmental needs with social responsibility.',
        ethicalFramework: ['balanced_approach'],
        consequences: ['Slower environmental progress', 'Job security maintained', 'Compromise solution'],
        stakeholders: ['Workers', 'Environment', 'Future generations', 'Government']
      },
      {
        id: 'economy_first',
        title: 'Protect jobs first',
        description: 'Delay environmental policies to preserve employment',
        feedback: 'Prioritizing immediate human welfare over environmental concerns.',
        ethicalFramework: ['social_responsibility'],
        consequences: ['Continued emissions', 'Job security', 'Environmental degradation'],
        stakeholders: ['Current workers', 'Local communities', 'Future generations']
      }
    ],
    category: 'welfare',
    difficulty: 'medium',
    ethicalFrameworks: ['environmental_ethics', 'social_responsibility', 'intergenerational_justice'],
    realWorldContext: 'Governments worldwide struggle with balancing climate action and economic concerns.'
  }
];