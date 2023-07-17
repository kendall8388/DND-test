/**
 * Application Identity (Brand)
 *
 * Also note that the 'Brand' is used in the following places:
 *  - README.md             all over
 *  - package.json          app-slug and version
 *  - public/manifest.json  name, short_name, description, theme_color, background_color
 */
export const Brand = {
 
  Title: {
    Common: (process.env.NODE_ENV === 'development' ? '[MonsterBucket] ' : '') + 'theQuest.ai',
  },
  Meta: {
    SiteName: 'theQuest.ai',
    Title: 'theQuest.ai: theQuest.ai App',
    Description: 'theQuest.ai is a DND dungeon master simulation game application.',
    Keywords: 'artificial general intelligence, theQuest, openai, gpt-4, ai personas, ai chat, artificial intelligence',
    ThemeColor: '#434356',
    TwitterSite: '-',
  },
  URIs: {
   
    Home: 'https://theQuest.ai',
    CardImage: '-',
    OpenRepo: '-',
    SupportInvite: '-',
  },
};