import * as React from 'react';
import { shallow } from 'zustand/shallow';

import { Box, Button, Checkbox, Grid, IconButton, Input, Stack, Textarea, Typography, useTheme } from '@mui/joy';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';

import { SystemPurposeId, SystemPurposes } from '../../../data';
import { useChatStore } from '@/common/state/store-chats';
import { usePurposeStore } from '@/common/state/store-purposes';
import { useSettingsStore } from '@/common/state/store-settings';

//import CharacterBuilder from './CharacterBuilder';

// Constants for tile sizes / grid width - breakpoints need to be computed here to work around
// the "flex box cannot shrink over wrapped content" issue
//
// Absolutely dislike this workaround, but it's the only way I found to make it work


const alignments = ["Lawful Good", "Neutral Good", "Chaotic Good", "Lawful Neutral", "True Neutral", "Chaotic Neutral", "Lawful Evil", "Neutral Evil", "Chaotic Evil"];
const races = ["Human", "Elf", "Dwarf", "Halfling", "Dragonborn", "Gnome", "Half-Elf", "Half-Orc", "Tiefling"];
const genders = ["Male", "Female", "Non-Binary"];
const classes = ["Fighter", "Wizard", "Rogue", "Paladin", "Cleric", "Ranger", "Barbarian", "Druid", "Monk", "Sorcerer", "Warlock", "Bard"];

type CharacterClass = 'Barbarian' | 'Bard' | 'Cleric' | 'Druid' | 'Fighter' | 'Monk' | 'Paladin' | 'Ranger' | 'Rogue' | 'Sorcerer' | 'Warlock' | 'Wizard';



const bpTileSize = { xs: 116, md: 125, xl: 130 };
const tileCols = [3, 4, 6];
const tileSpacing = 1;
const bpMaxWidth = Object.entries(bpTileSize).reduce((acc, [key, value], index) => {
  acc[key] = tileCols[index] * (value + 8 * tileSpacing) - 8 * tileSpacing;
  return acc;
}, {} as Record<string, number>);
const bpTileGap = { xs: 2, md: 3 };


// Add this utility function to get a random array element
const getRandomElement = <T extends any>(array: T[]): T | undefined =>
  array.length > 0 ? array[Math.floor(Math.random() * array.length)] : undefined;


/**
 * Purpose selector for the current chat. Clicking on any item activates it for the current chat.
 */
export function PurposeSelector(props: { conversationId: string, runExample: (example: string) => void }) {
  // state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredIDs, setFilteredIDs] = React.useState<SystemPurposeId[] | null>(null);
  const [editMode, setEditMode] = React.useState(false);
  const [alignment, setAlignment] = React.useState("");
  const [race, setRace] = React.useState("");
  const [raceTraits, setRaceTraits] = React.useState({});
  const [gender, setGender] = React.useState("");
  const [charClass, setCharClass] = React.useState<CharacterClass>('Fighter');
  const [str, setStr] = React.useState(10);
  const [dex, setDex] = React.useState(10);
  const [con, setCon] = React.useState(10);
  const [int, setInt] = React.useState(10);
  const [wis, setWis] = React.useState(10);
  const [cha, setCha] = React.useState(10);
  const [rolls, setRolls] = React.useState(0);
  //const [hitDie, setHitDie] = React.useState(0);
  //const initialClass = "Fighter";
  //const [hitPoints, setHitPoints] = React.useState(0);
  //const [hitDie, setHitDie] = React.useState(getHitDieForClass(initialClass));
  //const [hitPoints, setHitPoints] = React.useState(calculateHitPoints(initialClass, con));

  // external state
  const theme = useTheme();
  const showPurposeFinder = useSettingsStore(state => state.showPurposeFinder);
  const { systemPurposeId, setSystemPurposeId } = useChatStore(state => {
    const conversation = state.conversations.find(conversation => conversation.id === props.conversationId);
    return {
      systemPurposeId: conversation ? conversation.systemPurposeId : null,
      setSystemPurposeId: conversation ? state.setSystemPurposeId : null,
    };
  }, shallow);
  const { hiddenPurposeIDs, toggleHiddenPurposeId } = usePurposeStore(state => ({ hiddenPurposeIDs: state.hiddenPurposeIDs, toggleHiddenPurposeId: state.toggleHiddenPurposeId }), shallow);

  // safety check - shouldn't happen
  if (!systemPurposeId || !setSystemPurposeId)
    return null;


  const handleSearchClear = () => {
    setSearchQuery('');
    setFilteredIDs(null);
  };


  const handleAlignmentChange = (event: { target: { value: React.SetStateAction<string>; }; }) => setAlignment(event.target.value);
  const handleRaceChange = (event: { target: { value: React.SetStateAction<string>; }; }) => setRace(event.target.value);
  const handleGenderChange = (event: { target: { value: React.SetStateAction<string>; }; }) => setGender(event.target.value);
  const handleClassChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCharClass(event.target.value as CharacterClass);
  };
  

  React.useEffect(() => {
    setHitDie(getHitDieForClass(charClass));
    }, [charClass]);

  React.useEffect(() => {
    setHitPoints(calculateHitPoints(charClass, con));
    }, [charClass, con]);

    

  const handleSearchOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    if (!query)
      return handleSearchClear();
    setSearchQuery(query);

    // Filter results based on search term
    const ids = Object.keys(SystemPurposes)
      .filter(key => SystemPurposes.hasOwnProperty(key))
      .filter(key => {
        const purpose = SystemPurposes[key as SystemPurposeId];
        return purpose.title.toLowerCase().includes(query.toLowerCase())
          || (typeof purpose.description === 'string' && purpose.description.toLowerCase().includes(query.toLowerCase()));
      });
    setFilteredIDs(ids as SystemPurposeId[]);

    // If there's a search term, activate the first item
    if (ids.length && !ids.includes(systemPurposeId))
      handlePurposeChanged(ids[0] as SystemPurposeId);
  };

  const handleSearchOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key == 'Escape')
      handleSearchClear();
  };


  const toggleEditMode = () => setEditMode(!editMode);


  const handlePurposeChanged = (purposeId: SystemPurposeId | null) => {
    if (purposeId)
      setSystemPurposeId(props.conversationId, purposeId);
  };

  const handleCustomSystemMessageChange = (v: React.ChangeEvent<HTMLTextAreaElement>): void => {
    // TODO: persist this change? Right now it's reset every time.
    //       maybe we shall have a "save" button just save on a state to persist between sessions
   // SystemPurposes['Custom'].systemMessage = v.target.value;
  };


  // we show them all if the filter is clear (null)
  const unfilteredPurposeIDs = (filteredIDs && showPurposeFinder) ? filteredIDs : Object.keys(SystemPurposes);
  const purposeIDs = editMode ? unfilteredPurposeIDs : unfilteredPurposeIDs.filter(id => !hiddenPurposeIDs.includes(id));

  const selectedPurpose = purposeIDs.length ? (SystemPurposes[systemPurposeId] ?? null) : null;
  //const selectedExample = selectedPurpose?.examples && getRandomElement(selectedPurpose.examples) || null;

  
  // The rollStat function
const rollStat = () => {
  const rolls = Array.from({ length: 4 }, () => Math.ceil(Math.random() * 6));
  rolls.sort((a, b) => b - a);
  rolls.pop();
  return rolls.reduce((a, b) => a + b, 0);
};

// Handler for the button click
const handleButtonClick = () => {
  if (rolls < 3) {
    setStr(rollStat());
    setDex(rollStat());
    setCon(rollStat());
    setInt(rollStat());
    setWis(rollStat());
    setCha(rollStat());
    setRolls(rolls + 1);
  }
};

const getConstitutionModifier = (con: number) => {
  if (con >= 2 && con <= 3) return -4;
  if (con >= 4 && con <= 5) return -3;
  if (con >= 6 && con <= 7) return -2;
  if (con >= 8 && con <= 9) return -1;
  if (con >= 10 && con <= 11) return 0;
  if (con >= 12 && con <= 13) return 1;
  if (con >= 14 && con <= 15) return 2;
  if (con >= 16 && con <= 17) return 3;
  if (con >= 18 && con <= 19) return 4;
  if (con === 20) return 5;
  return 0;
};

const getHitDieForClass = (cls: string) => {
  switch (cls) {
    case "Barbarian":
      return 12;
    case "Bard":
    case "Cleric":
    case "Druid":
    case "Monk":
    case "Rogue":
    case "Warlock":
      return 8;
    case "Fighter":
    case "Paladin":
    case "Ranger":
      return 10;
    case "Sorcerer":
    case "Wizard":
      return 6;
    default:
      return 0;
  }
};

const calculateHitPoints = (charClass: CharacterClass, con: number) => {
  const hitDieMap: Record<CharacterClass, number> = {
    Barbarian: 12,
    Bard: 8,
    Cleric: 8,
    Druid: 8,
    Fighter: 10,
    Monk: 8,
    Paladin: 10,
    Ranger: 10,
    Rogue: 8,
    Sorcerer: 6,
    Warlock: 8,
    Wizard: 6,
  };
  const hitDie = hitDieMap[charClass];
  const constitutionModifier = getConstitutionModifier(con);

  return hitDie + constitutionModifier;
};
const initialClass = "Fighter";
const [hitPoints, setHitPoints] = React.useState(calculateHitPoints(initialClass, con));
const [hitDie, setHitDie] = React.useState(getHitDieForClass(initialClass));


  return <>

    {showPurposeFinder && <Box sx={{ p: 2 * tileSpacing }}>
      <Input
        fullWidth
        variant='outlined' color='neutral'
        value={searchQuery} onChange={handleSearchOnChange}
        onKeyDown={handleSearchOnKeyDown}
        placeholder='Search for purpose…'
        startDecorator={<SearchIcon />}
        endDecorator={searchQuery && (
          <IconButton variant='plain' color='neutral' onClick={handleSearchClear}>
            <ClearIcon />
          </IconButton>
        )}
        sx={{
          boxShadow: theme.vars.shadow.sm,
        }}
      />
    </Box>}

    <Stack direction='column' sx={{ minHeight: '60vh', justifyContent: 'center', alignItems: 'center' }}>

      <Box sx={{ maxWidth: bpMaxWidth }}>

        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 2, mb: 1 }}>
          <Typography level='body2' color='neutral'>
            Select a Dungeon Master
          </Typography>
          <Button variant='plain' color='neutral' size='sm' onClick={toggleEditMode}>
            {editMode ? 'Done' : 'Edit'}
          </Button>
        </Box>

        <Grid container spacing={tileSpacing} sx={{ justifyContent: 'flex-start' }}>
          {purposeIDs.map((spId) => (
            <Grid key={spId}>
              <Button
                variant={(!editMode && systemPurposeId === spId) ? 'solid' : 'soft'}
                color={(!editMode && systemPurposeId === spId) ? 'primary' : SystemPurposes[spId as SystemPurposeId]?.highlighted ? 'warning' : 'neutral'}
                onClick={() => !editMode && handlePurposeChanged(spId as SystemPurposeId)}
                sx={{
                  flexDirection: 'column',
                  fontWeight: 500,
                  gap: bpTileGap,
                  height: bpTileSize,
                  width: bpTileSize,
                  ...((editMode || systemPurposeId !== spId) ? {
                    boxShadow: theme.vars.shadow.md,
                    ...(SystemPurposes[spId as SystemPurposeId]?.highlighted ? {} : { background: theme.vars.palette.background.level1 }),
                  } : {}),
                }}
              >
                {editMode && (
                  <Checkbox
                    label={<Typography level='body2'>show</Typography>}
                    checked={!hiddenPurposeIDs.includes(spId)} onChange={() => toggleHiddenPurposeId(spId)}
                    sx={{ alignSelf: 'flex-start' }}
                  />
                )}
                <div style={{ fontSize: '2rem' }}>
                  {SystemPurposes[spId as SystemPurposeId]?.symbol}
                </div>
                <div>
                  {SystemPurposes[spId as SystemPurposeId]?.title}
                </div>
              </Button>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
    <Typography level='body2' color='neutral' sx={{ textAlign: 'center' }}>
        Build Your Character
    </Typography>
</Box>
<Box>
  
</Box>
{/* Add this section for Character Name field */}

<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 2, mb: 1, width: '100%' }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography level='body2' color='neutral' sx={{ textAlign: 'center' }}>
                Name
            </Typography>
            <Input
                fullWidth
                variant='outlined' color='neutral'
                placeholder='Enter character name…'
                sx={{
                    boxShadow: theme.vars.shadow.sm,
                }}
            />
        </Box>
    </Box>


<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 2, mb: 1 }}>
  <Box sx={{ flex: 1 }}>
    <Typography level='body2' color='neutral'>
        Alignment
    </Typography>
    <select value={alignment} onChange={handleAlignmentChange}>
        {alignments.map((alignment) => (
            <option key={alignment} value={alignment}>{alignment}</option>
        ))}
    </select>
  </Box>
  <Box sx={{ flex: 1 }}>
    <Typography level='body2' color='neutral'>
        Race
    </Typography>
    <select value={race} onChange={handleRaceChange}>
        {races.map((race) => (
            <option key={race} value={race}>{race}</option>
        ))}
    </select>
  </Box>
</Box>

<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 2, mb: 1 }}>
  <Box sx={{ flex: 1 }}>
    <Typography level='body2' color='neutral'>
        Gender
    </Typography>
    <select value={gender} onChange={handleGenderChange}>
        {genders.map((gender) => (
            <option key={gender} value={gender}>{gender}</option>
        ))}
    </select>
  </Box>
  <Box sx={{ flex: 1 }}>
    <Typography level='body2' color='neutral'>
        Class
    </Typography>
    <select value={charClass} onChange={handleClassChange}>
        {classes.map((charClass) => (
            <option key={charClass} value={charClass}>{charClass}</option>
        ))}
    </select>
  </Box>
</Box>

<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 2, mb: 1 }}>
  <Box sx={{ flex: 1 }}>
    <Typography>Hit Die: {hitDie}</Typography>
  </Box>
  <Box sx={{ flex: 1 }}>
    <Typography>Hit Points: {hitPoints}</Typography>
  </Box>
</Box>


<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
  <Typography>Str: {str}</Typography>
  <Typography>Dex: {dex}</Typography>
  <Typography>Con: {con}</Typography>
  <Typography>Int: {int}</Typography>
  <Typography>Wis: {wis}</Typography>
  <Typography>Cha: {cha}</Typography>
  <Button onClick={handleButtonClick} disabled={rolls >= 3}>Roll Stats 🎲 </Button>
  <Typography>Attempts remaining: {3 - rolls}</Typography>
</Box>

       {/*  <Typography
          level='body2'
          sx={{
            mt: selectedExample ? 1 : 3,
            display: 'flex', alignItems: 'center', gap: 1,
           
            '&:hover > button': { opacity: 1 },
          }}>
          {!selectedPurpose
            ? 'Oops! No AI purposes found for your search.'
            : (selectedExample
                ? <>
                  <i>{selectedExample}</i>
                  <IconButton
                    variant='plain' color='neutral' size='md'
                    onClick={() => props.runExample(selectedExample)}
                    sx={{ opacity: 0, transition: 'opacity 0.3s' }}
                  >
                    💬
                  </IconButton>
                </>
                : selectedPurpose.description
            )}
        </Typography>

        {systemPurposeId === 'Custom' && (
          <Textarea
            variant='outlined' autoFocus placeholder={'Craft your custom system message here…'}
            minRows={3}
            defaultValue={SystemPurposes['Custom']?.systemMessage} onChange={handleCustomSystemMessageChange}
            sx={{
              background: theme.vars.palette.background.level1,
              lineHeight: 1.75,
              mt: 1,
            }} />
        )} */}

      </Box>

    </Stack>

  </>;
}