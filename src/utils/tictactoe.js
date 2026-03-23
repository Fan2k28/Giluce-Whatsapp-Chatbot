/**
 * TicTacToe Game Logic
 */

class TicTacToe {
    constructor(playerX, playerO) {
        this.playerX = playerX;
        this.playerO = playerO;
        this.currentTurn = playerX;
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.winner = null;
        this.turns = 0;
    }

    turn(playerO, position) {
        const currentPlayer = playerO ? this.playerO : this.playerX;
        
        // Check if it's the correct player's turn
        if (currentPlayer !== this.currentTurn) return false;
        
        // Check if position is valid
        if (position < 0 || position > 8 || this.board[position] !== '') return false;
        
        // Make the move
        this.board[position] = playerO ? 'O' : 'X';
        this.turns++;
        
        // Check for winner
        this.checkWinner();
        
        // Switch turn if no winner
        if (!this.winner) {
            this.currentTurn = playerO ? this.playerX : this.playerO;
        }
        
        return true;
    }

    checkWinner() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (const combo of winningCombinations) {
            const [a, b, c] = combo;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                this.winner = this.board[a] === 'X' ? this.playerX : this.playerO;
                return;
            }
        }
    }

    render() {
        return this.board;
    }
}

module.exports = TicTacToe;
