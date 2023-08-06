import session from "@local/shared/session";
import Character from "./gameobject/character";

class GameSession extends session {

    // ingame character
    character: Character;


}

export default GameSession;
