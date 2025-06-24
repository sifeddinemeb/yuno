/**
 * Comprehensive meme database for MemeTimeWarp challenges
 * Extracted from challenge-content.ts for better maintainability
 */

import type { MemeData } from '../types/challenge-content';

export const MEME_DATABASE: MemeData[] = [
  // Early Internet Era (1990s)
  {
    id: 'dancing_baby',
    name: 'Dancing Baby',
    year: 1996,
    description: 'One of the first viral internet memes',
    popularityPeak: '1996-1998',
    culturalImpact: 'Introduced the concept of viral content',
    platform: 'Email chains'
  },
  {
    id: 'hampster_dance',
    name: 'Hampster Dance',
    year: 1998,
    description: 'Early web animation meme with catchy music',
    popularityPeak: '1998-1999',
    culturalImpact: 'Demonstrated power of simple, catchy web content',
    platform: 'GeoCities'
  },
  
  // Early 2000s
  {
    id: 'all_your_base',
    name: 'All Your Base Are Belong To Us',
    year: 2001,
    description: 'Classic gaming translation meme',
    popularityPeak: '2001-2002',
    culturalImpact: 'First major gaming culture crossover meme',
    platform: 'Forums'
  },
  {
    id: 'badger_badger',
    name: 'Badger Badger Badger',
    year: 2003,
    description: 'Hypnotic flash animation',
    popularityPeak: '2003-2004',
    culturalImpact: 'Showed the appeal of repetitive, absurd content',
    platform: 'Newgrounds'
  },
  
  // YouTube Era (Mid 2000s)
  {
    id: 'numa_numa',
    name: 'Numa Numa',
    year: 2004,
    description: 'Webcam lip-sync performance',
    popularityPeak: '2004-2005',
    culturalImpact: 'Early example of user-generated viral video',
    platform: 'Newgrounds/YouTube'
  },
  {
    id: 'leeroy_jenkins',
    name: 'Leeroy Jenkins',
    year: 2005,
    description: 'World of Warcraft gaming meme',
    popularityPeak: '2005-2006',
    culturalImpact: 'Brought gaming culture into mainstream awareness',
    platform: 'Warcraft Forums'
  },
  {
    id: 'snakes_on_plane',
    name: 'Snakes on a Plane',
    year: 2006,
    description: 'Movie title became internet phenomenon',
    popularityPeak: '2006',
    culturalImpact: 'Showed how internet culture could influence Hollywood',
    platform: 'Various forums'
  },
  {
    id: 'rickroll',
    name: 'Rickroll',
    year: 2007,
    description: 'Never gonna give you up prank',
    popularityPeak: '2007-2008',
    culturalImpact: 'Defined modern internet pranking culture',
    platform: '4chan/YouTube'
  },
  
  // Late 2000s Social Media
  {
    id: 'keyboard_cat',
    name: 'Keyboard Cat',
    year: 2009,
    description: 'Cat playing electronic keyboard',
    popularityPeak: '2009-2010',
    culturalImpact: 'Established cats as internet royalty',
    platform: 'YouTube'
  },
  {
    id: 'double_rainbow',
    name: 'Double Rainbow',
    year: 2010,
    description: 'Enthusiastic reaction to rainbow',
    popularityPeak: '2010-2011',
    culturalImpact: 'Showed power of authentic emotional reactions',
    platform: 'YouTube'
  },
  
  // Early 2010s
  {
    id: 'nyan_cat',
    name: 'Nyan Cat',
    year: 2011,
    description: 'Pop-tart cat flying through space',
    popularityPeak: '2011-2012',
    culturalImpact: 'Merged animation, music, and internet culture',
    platform: 'YouTube'
  },
  {
    id: 'gangnam_style',
    name: 'Gangnam Style',
    year: 2012,
    description: 'Psy\'s viral K-pop dance',
    popularityPeak: '2012-2013',
    culturalImpact: 'First YouTube video to reach 1 billion views',
    platform: 'YouTube'
  },
  {
    id: 'harlem_shake',
    name: 'Harlem Shake',
    year: 2013,
    description: 'Dance meme with costume reveals',
    popularityPeak: '2013',
    culturalImpact: 'Demonstrated coordinated viral participation',
    platform: 'YouTube'
  },
  {
    id: 'doge',
    name: 'Doge',
    year: 2013,
    description: 'Shiba Inu with Comic Sans text',
    popularityPeak: '2013-2014',
    culturalImpact: 'Influenced internet language and eventually cryptocurrency',
    platform: 'Reddit'
  },
  {
    id: 'ice_bucket',
    name: 'Ice Bucket Challenge',
    year: 2014,
    description: 'ALS awareness challenge',
    popularityPeak: '2014',
    culturalImpact: 'Showed how memes could drive real-world charitable action',
    platform: 'Facebook/Instagram'
  },
  
  // Mid 2010s Meme Templates
  {
    id: 'drake_pointing',
    name: 'Drake Pointing',
    year: 2015,
    description: 'Drake rejecting vs approving meme template',
    popularityPeak: '2015-2016',
    culturalImpact: 'Established the modern meme template format',
    platform: 'Instagram'
  },
  {
    id: 'mannequin_challenge',
    name: 'Mannequin Challenge',
    year: 2016,
    description: 'Freezing in place video trend',
    popularityPeak: '2016',
    culturalImpact: 'Cross-platform viral phenomenon',
    platform: 'Twitter/Instagram'
  },
  {
    id: 'distracted_boyfriend',
    name: 'Distracted Boyfriend',
    year: 2017,
    description: 'Stock photo meme template',
    popularityPeak: '2017-2018',
    culturalImpact: 'Peak of template meme culture',
    platform: 'Twitter'
  },
  {
    id: 'this_is_fine',
    name: 'This is Fine',
    year: 2018,
    description: 'Dog in burning room comic',
    popularityPeak: '2018-2019',
    culturalImpact: 'Captured collective anxiety of the era',
    platform: 'Twitter/Reddit'
  },
  {
    id: 'area_51',
    name: 'Storm Area 51',
    year: 2019,
    description: 'Let\'s see them aliens Facebook event',
    popularityPeak: '2019',
    culturalImpact: 'Showed how internet jokes could approach real-world consequences',
    platform: 'Facebook'
  },
  {
    id: 'woman_yelling_cat',
    name: 'Woman Yelling at Cat',
    year: 2019,
    description: 'Dinner table argument meme',
    popularityPeak: '2019-2020',
    culturalImpact: 'Perfect template for expressing disagreement',
    platform: 'Twitter'
  },
  
  // 2020s Era
  {
    id: 'bernie_mittens',
    name: 'Bernie Sanders Mittens',
    year: 2021,
    description: 'Inauguration sitting pose meme',
    popularityPeak: '2021',
    culturalImpact: 'Brought political imagery into wholesome meme culture',
    platform: 'Twitter/Instagram'
  },
  {
    id: 'nft_bros',
    name: 'NFT Profile Pictures',
    year: 2021,
    description: 'Hexagonal profile picture trend',
    popularityPeak: '2021-2022',
    culturalImpact: 'Represented intersection of memes and digital ownership',
    platform: 'Twitter'
  },
  {
    id: 'amongus_sus',
    name: 'Among Us Sus',
    year: 2020,
    description: 'Gaming meme about suspicious behavior',
    popularityPeak: '2020-2021',
    culturalImpact: 'Gaming terminology entered mainstream vocabulary',
    platform: 'TikTok/Discord'
  }
];