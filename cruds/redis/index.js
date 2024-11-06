import {Redis} from "ioredis";

// Initialiser la connexion Redis
const redis = new Redis({
    host: "127.0.0.1",
    port: 6379
});

// Structure CRUD pour Redis
const crud = {
    // Gestion des mouvements
    movements: {
        // Créer un mouvement pour un joueur avec TTL
        create: function (player_id, x, y, ttl = 10) {
            return redis.setex(`move:${player_id}`, ttl, `X:${x},Y:${y}`);
        },
        // Lire le mouvement d'un joueur
        read: function (player_id) {
            return redis.get(`move:${player_id}`);
        },
        // Mettre à jour le mouvement d'un joueur
        update: function (player_id, x, y, ttl = 10) {
            return redis.setex(`move:${player_id}`, ttl, `X:${x},Y:${y}`);
        },
        // Supprimer le mouvement d'un joueur
        delete: function (player_id) {
            return redis.del(`move:${player_id}`);
        }
    },

    // Gestion des attaques
    attacks: {
        // Créer une attaque entre deux joueurs avec TTL
        create: function (player_id, enemy_id, damage, ttl = 60) {
            const attackDetails = JSON.stringify({ damage: damage, timestamp: Date.now() });
            return redis.setex(`attack:${player_id}:${enemy_id}`, ttl, attackDetails);
        },
        // Lire les détails d'une attaque
        read: function (player_id, enemy_id) {
            return redis.get(`attack:${player_id}:${enemy_id}`);
        },
        // Mettre à jour les détails d'une attaque
        update: function (player_id, enemy_id, damage, ttl = 60) {
            const attackDetails = JSON.stringify({ damage: damage, timestamp: Date.now() });
            return redis.setex(`attack:${player_id}:${enemy_id}`, ttl, attackDetails);
        },
        // Supprimer une attaque
        delete: function (player_id, enemy_id) {
            return redis.del(`attack:${player_id}:${enemy_id}`);
        }
    },

    // Gestion des classements
    leaderboard: {
        // Ajouter ou mettre à jour le score d'un joueur
        addOrUpdate: function (player_id, score) {
            return redis.zadd("leaderboard", score, player_id);
        },
        // Récupérer les meilleurs joueurs (Top 10)
        getTopPlayers: function (count = 10) {
            return redis.zrevrange("leaderboard", 0, count - 1, "WITHSCORES");
        },
        // Incrémenter le score d'un joueur
        incrementScore: function (player_id, points) {
            return redis.zincrby("leaderboard", points, player_id);
        },
        // Supprimer un joueur du classement
        removePlayer: function (player_id) {
            return redis.zrem("leaderboard", player_id);
        },
        // Nettoyer les scores en dessous d'un certain seuil
        removeBelowScore: function (minScore) {
            return redis.zremrangebyscore("leaderboard", "-inf", minScore);
        }
    }
};

// Exemple d'utilisation
(async () => {
    // Mouvements
    await crud.movements.create("123", 50, 100);
    const movement = await crud.movements.read("123");
    console.log("Mouvement du joueur:", movement);

    // Attaques
    await crud.attacks.create("123", "456", 200);
    const attack = await crud.attacks.read("123", "456");
    console.log("Détails de l'attaque:", attack);

    // Classements
    await crud.leaderboard.addOrUpdate("123", 1000);
    const topPlayers = await crud.leaderboard.getTopPlayers();
    console.log("Classement des joueurs:", topPlayers);

    // Fermer la connexion Redis
    redis.quit();
})();
