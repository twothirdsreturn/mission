import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { SELECT_CHARACTER } from '../reducers/characterReducer';
import { SET_GAME_STATE } from '../reducers/gameReducer';
import '../styles/character-select.css';

const CharacterSelect = ({ characters, selectCharacter, setGameState }) => {
  const history = useHistory();

  const handleCharacterSelect = (characterId) => {
    selectCharacter(characterId);
    setGameState('GALACTIC_MAP');
    setTimeout(() => {
      history.push('/galactic-map');
    }, 500);
  };

  return (
    <div className="character-select">
      <h1 className="select-title">SELECT YOUR DEAL HUNTER</h1>
      
      <div className="character-options">
        {characters.map(character => (
          <div 
            key={character.id} 
            className="character-option"
            onClick={() => handleCharacterSelect(character.id)}
          >
            <div className="character-portrait">
              {/* Character sprite will be added here */}
              <div className="character-placeholder"></div>
            </div>
            <h2 className="character-name">{character.name}</h2>
            <p className="character-location">{character.homeBase}</p>
            <p className="character-base">{character.startingLocation}</p>
          </div>
        ))}
      </div>
      
      <button 
        className="back-button"
        onClick={() => {
          setGameState('MAIN_MENU');
          history.push('/');
        }}
      >
        BACK
      </button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  characters: state.character.characters
});

const mapDispatchToProps = (dispatch) => ({
  selectCharacter: (characterId) => dispatch({ type: SELECT_CHARACTER, payload: characterId }),
  setGameState: (state) => dispatch({ type: SET_GAME_STATE, payload: state })
});

export default connect(mapStateToProps, mapDispatchToProps)(CharacterSelect);
