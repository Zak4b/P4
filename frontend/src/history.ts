// History page functionality
import { apiClient } from './api.js';

export function showHistory() {
    const appContainer = document.getElementById('app');
    if (appContainer) {
        appContainer.innerHTML = `
            <div class="row">
                <div class="col-12">
                    <h2>Game History</h2>
                    <div id="historyContainer">
                        <div class="text-center">
                            <div class="spinner-border" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        loadHistory();
    }
}

async function loadHistory() {
    try {
        const [history, scores] = await Promise.all([
            apiClient.getHistory(),
            apiClient.getScore()
        ]);
        
        const historyContainer = document.getElementById('historyContainer');
        if (historyContainer) {
            historyContainer.innerHTML = `
                <div class="row">
                    <div class="col-lg-8">
                        <h4>Recent Games</h4>
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Player 1</th>
                                        <th>Player 2</th>
                                        <th>Winner</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${history.map(game => `
                                        <tr>
                                            <td>${new Date(game.time).toLocaleString()}</td>
                                            <td>${game.name_1}</td>
                                            <td>${game.name_2}</td>
                                            <td>
                                                ${game.result === 1 ? 
                                                    `<span class="badge bg-success">${game.name_1}</span>` : 
                                                    `<span class="badge bg-success">${game.name_2}</span>`
                                                }
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <h4>Player Scores</h4>
                        <div class="list-group">
                            ${scores.map((score, index) => `
                                <div class="list-group-item d-flex justify-content-between align-items-center">
                                    <span>${score.p || 'Player ' + score.p}</span>
                                    <span class="badge bg-primary rounded-pill">${score['count(*)']}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        const historyContainer = document.getElementById('historyContainer');
        if (historyContainer) {
            historyContainer.innerHTML = `
                <div class="alert alert-danger">
                    Failed to load history: ${error instanceof Error ? error.message : 'Unknown error'}
                </div>
            `;
        }
    }
}