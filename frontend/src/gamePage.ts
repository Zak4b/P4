// Game page functionality
import { initializeGame } from './game.js';

export function showGame() {
    const appContainer = document.getElementById('app');
    if (appContainer) {
        appContainer.innerHTML = `
            <div class="row">
                <div class="col-lg-7 col-12">
                    <canvas id="canvas" class="mw-100"></canvas>
                    <div class="container-fluid d-flex justify-content-evenly bg-dark p-2 rounded-4">
                        <div id="indicator-j1" class="btn btn-danger disabled">Joueur #1</div>
                        <div id="indicator-j2" class="btn btn-warning disabled">Joueur #2</div>
                    </div>
                </div>
                <div class="col-lg-5 col-12 d-flex flex-column">
                    <div
                        id="msg-area"
                        class="msg-area d-flex flex-column flex-grow-1 w-100 py-2 px-1 border border-3 border-black rounded-4 lh-sm"
                        data-msg-target=".msg-area-body"
                        data-msg-input="input.msg-input"
                        data-msg-template-info="#template-message-info"
                        data-msg-template-msg="#template-message-message"
                        data-msg-template-vote="#template-message-vote"
                    >
                        <div class="msg-area-body flex-grow-1 overflow-y-scroll" style="height: 400px"></div>
                        <input type="text" style="position: sticky; bottom: 0" class="msg-input form-control w-100" id="msg" placeholder="Message" />
                    </div>
                </div>
            </div>
        `;
        
        // Initialize the game after DOM is ready
        setTimeout(initializeGameLogic, 100); // Give DOM a moment to render
    }
}

function initializeGameLogic() {
    try {
        // Initialize the game components
        const gameComponents = initializeGame();
        console.log('Game initialized successfully', gameComponents);
    } catch (error) {
        console.error('Failed to initialize game:', error);
        const appContainer = document.getElementById('app');
        if (appContainer) {
            appContainer.innerHTML = `
                <div class="alert alert-danger">
                    Failed to initialize game: ${error instanceof Error ? error.message : 'Unknown error'}
                    <br>
                    <small>Please check the console for more details.</small>
                </div>
            `;
        }
    }
}