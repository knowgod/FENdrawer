function theBoard() {
    return {
        headRow: 'abcdefgh'.split(''),
        headCol: '87654321'.split(''),
        // fenContent: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0',
        // fenContent: '8/8/8/4p1KQ/2k1P3/8/8/8 b',
        fenContent: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
        fenConditions: {
            toMove: 'w',
            castle: 'KQkq',
            enPassant: '-',
            halfMoves: 0,
            fullMoves: 0,
        },
        pieceClasses: {
            'P': 'pawnWhite',
            'p': 'pawnBlack',
            'R': 'rookWhite',
            'r': 'rookBlack',
            'N': 'knightWhite',
            'n': 'knightBlack',
            'B': 'bishopWhite',
            'b': 'bishopBlack',
            'Q': 'queenWhite',
            'q': 'queenBlack',
            'K': 'kingWhite',
            'k': 'kingBlack',
        },
        piecesOnBoard: {
            a1: 'R',
            b1: 'N',
            c1: 'B',
            d1: 'Q',
            e1: 'K',
            f1: 'B',
            g1: 'N',
            h1: 'R',
            a2: 'P',
            b2: 'P',
            c2: 'P',
            d2: 'P',
            e2: 'P',
            f2: 'P',
            g2: 'P',
            h2: 'P',

            a8: 'r',
            b8: 'n',
            c8: 'b',
            d8: 'q',
            e8: 'k',
            f8: 'b',
            g8: 'n',
            h8: 'r',
            a7: 'p',
            b7: 'p',
            c7: 'p',
            d7: 'p',
            e7: 'p',
            f7: 'p',
            g7: 'p',
            h7: 'p',
        },
        update: function () {
            const fenRows = this.parseFenRecord(this.fenContent);
            this.updatePieces(fenRows);
        },
        parseFenRecord: function (fenString) {
            const fenSegments = fenString.match(/([PRBNQKprbnqk\/12345678]+)( ([wb]))?( ([KQkq]{1,4}))?( ([abcdefgh][12345678]))?( (\d{1,2}) (\d{1,2}))?/);
            const fenRows = fenSegments[0].split('/');
            const conditions = {
                toMove: fenSegments[3] || null,
                castle: fenSegments[5] || null,
                enPassant: fenSegments[7] || null,
                halfMoves: parseInt(fenSegments[9]) || null,
                fullMoves: parseInt(fenSegments[10]) || null,
            }
            this.fenConditions = mergeObjects(this.fenConditions, conditions);
            console.log([fenRows, this.fenConditions]);
            return fenRows;
        },
        updatePieces: function (fenRows) {
            let onBoard = {}, countKings = 0;
            for (const line in fenRows) {
                let rowNumber = 8 - line, colNumber = 0, cell = '';
                let fenRow = fenRows[line].split('');
                for (let symbol of fenRow) {
                    let number = parseInt(symbol);
                    if (number >= 1 && number <= 8) {
                        colNumber += number;
                        continue;
                    }
                    cell = this.headRow.at(colNumber) + rowNumber;
                    if (colNumber < 8) {
                        onBoard[cell] = symbol;
                        colNumber++;
                        if (symbol.match(/[kK]/)) {
                            countKings++;
                        }
                    }
                }
            }
            console.log(onBoard);
            if (countKings === 2) {
                this.piecesOnBoard = onBoard;
            }
        },
        getToMove: function () {
            if (this.fenConditions.toMove === 'w') return 'White';
            if (this.fenConditions.toMove === 'b') return 'Black';
            return 'Parse error';
        },
        getToCastle: function (color) {
            let sides = [];
            switch (color) {
                case 'w':
                    if (this.fenConditions.castle.match('K')) sides.push('King side');
                    if (this.fenConditions.castle.match('Q')) sides.push('Queen side');
                    break;
                case 'b':
                    if (this.fenConditions.castle.match('k')) sides.push('King side');
                    if (this.fenConditions.castle.match('q')) sides.push('Queen side');
                    break;
                default:
                    sides.push('No')
            }
            return sides.join(', ');
        },
        getColor: function (cell) {
            let result = false;
            const [col, row] = this.getColRow(cell);
            switch (col) {
                case 'a':
                case 'c':
                case 'e':
                case 'g':
                    result = !!(row % 2);
                    break;
                case 'b':
                case 'd':
                case 'f':
                case 'h':
                    result = !(row % 2);
                    break;
                default:
            }
            return result ? ' black' : ' white';
        },
        getPiece: function (cell) {
            return this.piecesOnBoard[cell];
        },
        getColRow(cell) {
            const parts = cell.match(/([abcdefgh])([12345678])/);
            return [parts[1], parts[2]];
        },
    };
}

const mergeObjects = (obj1, obj2) => {
    for (let attr in obj2) {
        obj1[attr] = obj2[attr] || obj1[attr];
    }
    return obj1;
}
