// Initial state
const initialState = {
  selectedCharacter: null, // Mike, Reif, Mark
  characters: [
    {
      id: 'mike',
      name: 'Mike',
      homeBase: 'Orem, Utah',
      startingLocation: 'Mountain Tech Base',
      position: { x: 100, y: 300 }
    },
    {
      id: 'reif',
      name: 'Reif',
      homeBase: 'Ozark, Missouri',
      startingLocation: 'Rural Command Center',
      position: { x: 300, y: 400 }
    },
    {
      id: 'mark',
      name: 'Mark',
      homeBase: 'New York, NY',
      startingLocation: 'Cyber HQ',
      position: { x: 500, y: 200 }
    }
  ]
};

// Action types
export const SELECT_CHARACTER = 'SELECT_CHARACTER';
export const UPDATE_CHARACTER_POSITION = 'UPDATE_CHARACTER_POSITION';

// Reducer
const characterReducer = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_CHARACTER:
      return {
        ...state,
        selectedCharacter: action.payload
      };
    case UPDATE_CHARACTER_POSITION:
      return {
        ...state,
        characters: state.characters.map(character => 
          character.id === action.payload.id 
            ? { ...character, position: action.payload.position } 
            : character
        )
      };
    default:
      return state;
  }
};

export default characterReducer;
