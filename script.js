// tady cekam az se nacte dokument, klasika jQuery
$(document).ready(function () {

    // doplnim aktualni rok do footeru
    var yearSpan = document.getElementById("yearSpan");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // -----------------------------------------
    // demo data pro score tabulky
    // -----------------------------------------

    var scores = [
        // TETRIS
        { game: "Tetris", player: "RetroKid", score: 18500, level: 14, length: null, flappyPipes: null, flappyStreak: null, date: "2024-11-01" },
        { game: "Tetris", player: "HighScoreCZ", score: 22100, level: 18, length: null, flappyPipes: null, flappyStreak: null, date: "2024-11-03" },
        { game: "Tetris", player: "PixelMaster", score: 19950, level: 16, length: null, flappyPipes: null, flappyStreak: null, date: "2024-10-25" },
        { game: "Tetris", player: "ArcadeWolf", score: 17300, level: 13, length: null, flappyPipes: null, flappyStreak: null, date: "2024-10-10" },
        { game: "Tetris", player: "Nostalgia99", score: 14200, level: 11, length: null, flappyPipes: null, flappyStreak: null, date: "2024-09-28" },

        // SNAKE
        { game: "Snake", player: "SnakeLord", score: 890, level: null, length: 42, flappyPipes: null, flappyStreak: null, date: "2024-11-02" },
        { game: "Snake", player: "RetroKid", score: 760, level: null, length: 36, flappyPipes: null, flappyStreak: null, date: "2024-10-18" },
        { game: "Snake", player: "BitRunner", score: 640, level: null, length: 31, flappyPipes: null, flappyStreak: null, date: "2024-10-12" },
        { game: "Snake", player: "ArcadeWolf", score: 520, level: null, length: 27, flappyPipes: null, flappyStreak: null, date: "2024-09-30" },
        { game: "Snake", player: "L33tPlayer", score: 430, level: null, length: 23, flappyPipes: null, flappyStreak: null, date: "2024-09-21" },

        // FLAPPY
        { game: "Flappy Bird", player: "RageQuitCZ", score: 135, level: null, length: null, flappyPipes: 135, flappyStreak: 45, date: "2024-11-05" },
        { game: "Flappy Bird", player: "ZenPilot", score: 118, level: null, length: null, flappyPipes: 118, flappyStreak: 39, date: "2024-10-29" },
        { game: "Flappy Bird", player: "RetroKid", score: 96, level: null, length: null, flappyPipes: 96, flappyStreak: 27, date: "2024-10-15" },
        { game: "Flappy Bird", player: "BitRunner", score: 80, level: null, length: null, flappyPipes: 80, flappyStreak: 21, date: "2024-09-26" },
        { game: "Flappy Bird", player: "PixelMaster", score: 60, level: null, length: null, flappyPipes: 60, flappyStreak: 16, date: "2024-09-12" }
    ];

    // chci mit trochu vic radku, tak si je proste naklonuju s malou zmenou
    var baseCopy = scores.slice(); // klasicka kopie pole
    for (var i = 0; i < 45; i++) {
        var origin = baseCopy[i % baseCopy.length];

        // male rozhozeni score at neni vse stejne
        var jitter = (Math.random() * 0.3 + 0.85); // 0.85 az 1.15

        var clone = {
            game: origin.game,
            player: origin.player,
            score: Math.round(origin.score * jitter),
            level: origin.level,
            length: origin.length,
            flappyPipes: origin.flappyPipes,
            flappyStreak: origin.flappyStreak,
            date: origin.date
        };

        // kdyz je delka nebo flappy hodnoty, tak je taky trochu rozhazeme
        if (clone.length != null) {
            clone.length = Math.round(clone.length * jitter);
        }
        if (clone.flappyPipes != null) {
            clone.flappyPipes = Math.round(clone.flappyPipes * jitter);
        }
        if (clone.flappyStreak != null) {
            clone.flappyStreak = Math.round(clone.flappyStreak * jitter);
        }

        scores.push(clone);
    }

    // jednoduchy helper co udela radek s kolecky obtiznosti
    function difficultyDots(game, score) {
        // default 3 puntiky z 5
        var dots = 3;

        if (game === "Tetris") {
            if (score >= 21000) dots = 5;
            else if (score >= 18000) dots = 4;
        } else if (game === "Snake") {
            if (score >= 800) dots = 5;
            else if (score >= 600) dots = 4;
        } else if (game === "Flappy Bird") {
            if (score >= 120) dots = 5;
            else if (score >= 90) dots = 4;
        }

        // ● nebo ○ - vypada to docela fajn, tka to tak necham
        var full = "●".repeat(dots);
        var empty = "○".repeat(5 - dots);
        return full + empty;
    }

    // funkce co nahazi data do vsech tabulek
    function fillTables() {
        // najdu tbody v kazde tabulce
        var allBody = $("#scoreAll tbody");
        var tetrisBody = $("#scoreTetris tbody");
        var snakeBody = $("#scoreSnake tbody");
        var flappyBody = $("#scoreFlappy tbody");

        // vycisteni
        allBody.empty();
        tetrisBody.empty();
        snakeBody.empty();
        flappyBody.empty();

        // seradim kopii score podle hodnoty
        var sorted = scores.slice().sort(function (a, b) {
            return b.score - a.score;
        });

        // poradova cisla do sloupce #
        var rowAll = 1;
        var rowT = 1;
        var rowS = 1;
        var rowF = 1;

        // projdu vsechny zaznamy a pripisu radky
        sorted.forEach(function (entry) {
            var diff = difficultyDots(entry.game, entry.score);
            var date = entry.date;

            // tabulka vsech her
            allBody.append(
                "<tr>" +
                "<td>" + (rowAll++) + "</td>" +
                "<td>" + entry.game + "</td>" +
                "<td>" + entry.player + "</td>" +
                "<td>" + entry.score + "</td>" +
                "<td>" + diff + "</td>" +
                "<td>" + date + "</td>" +
                "</tr>"
            );

            // tetris tabulka
            if (entry.game === "Tetris") {
                tetrisBody.append(
                    "<tr>" +
                    "<td>" + (rowT++) + "</td>" +
                    "<td>" + entry.player + "</td>" +
                    "<td>" + entry.score + "</td>" +
                    "<td>" + (entry.level != null ? entry.level : "-") + "</td>" +
                    "<td>" + date + "</td>" +
                    "</tr>"
                );
            }

            // snake tabulka
            if (entry.game === "Snake") {
                snakeBody.append(
                    "<tr>" +
                    "<td>" + (rowS++) + "</td>" +
                    "<td>" + entry.player + "</td>" +
                    "<td>" + (entry.length != null ? entry.length : "-") + "</td>" +
                    "<td>" + entry.score + "</td>" +
                    "<td>" + date + "</td>" +
                    "</tr>"
                );
            }

            // flappy tabulka
            if (entry.game === "Flappy Bird") {
                flappyBody.append(
                    "<tr>" +
                    "<td>" + (rowF++) + "</td>" +
                    "<td>" + entry.player + "</td>" +
                    "<td>" + (entry.flappyPipes != null ? entry.flappyPipes : "-") + "</td>" +
                    "<td>" + (entry.flappyStreak != null ? entry.flappyStreak : "-") + "</td>" +
                    "<td>" + date + "</td>" +
                    "</tr>"
                );
            }
        });
    }

    // prvni naplneni tabulek hned po nacteni
    fillTables();

    // nastaveni datatables – skoro stejne pro vsechny
    var dtCommon = {
        pageLength: 5,
        lengthChange: false,
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.8/i18n/cs.json"
        }
    };

    // inicializace vsech ctyr tabulek
    $("#scoreAll").DataTable($.extend({}, dtCommon, {
        order: [[3, "desc"]]
    }));

    $("#scoreTetris").DataTable($.extend({}, dtCommon, {
        order: [[2, "desc"]]
    }));

    $("#scoreSnake").DataTable($.extend({}, dtCommon, {
        order: [[3, "desc"]]
    }));

    $("#scoreFlappy").DataTable($.extend({}, dtCommon, {
        order: [[2, "desc"]]
    }));

    // tlacitko na skok nahoru
    $("#btnScrollTop").on("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // demo odeslani formulare – nechci reload stranky
    $(".pixel-form").on("submit", function (e) {
        e.preventDefault();
        // tady by v realu byla ajax nebo fetch logika, ale ted necham jen alert
        alert("Diky za odeslani! Tohle je jen ukazkova stranka, takze se nic neposlalo na server.");
    });
});
