// db.js
const cassandra = require('cassandra-driver');
const { v4: uuidv4 } = require('uuid');

// Configurer le client Cassandra avec vos paramètres de cluster
const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1',
  keyspace: 'my_keyspace',
});

// Tester la connexion
client.connect()
  .then(() => console.log('Connexion à Cassandra réussie !'))
  .catch(err => console.error('Erreur de connexion à Cassandra:', err));

const crud = {

        create: function (timestamp, attaque, defense, victoire) {
      // Générer un UUID pour le player_id
      const player_id = uuidv4();  // UUID dynamique pour chaque joueur

      const query = 'INSERT INTO player_stat (player_id, timestamp, attaque, defense, victoire) VALUES (?, ?, ?, ?, ?)';

      // Exécuter la requête d'insertion
      return client.execute(query, [player_id, timestamp, attaque, defense, victoire], { prepare: true })
        .then(() => {
          // Retourner le player_id après l'insertion
          return { player_id };
        });
    },
  read: {
    all: function(player_id) {
      const query = 'SELECT * FROM player_stat WHERE player_id = ? ORDER BY timestamp DESC';
      return client.execute(query, [player_id], { prepare: true });
    },

    byId: function(player_id) {
      const query = 'SELECT * FROM player_stat WHERE player_id = ?';
      return client.execute(query, [player_id], { prepare: true });
    }
  },

 update: {
    attaque: function(player_id, attaque) {
      const query = 'UPDATE player_stat SET attaque = ? WHERE player_id = ? ';
      return client.execute(query, [attaque, player_id], { prepare: true });
    },

    defense: function(player_id, defense) {
      const query = 'UPDATE player_stat SET defense = ? WHERE player_id = ? ';
      return client.execute(query, [defense, player_id], { prepare: true });
    },

    victoire: function(player_id, victoire) {
      const query = 'UPDATE player_stat SET victoire = ? WHERE player_id = ? ';
      return client.execute(query, [victoire, player_id], { prepare: true });
    }
  },


  delete: function(player_id) {
    const query = 'DELETE FROM player_stat WHERE player_id = ?';
    return client.execute(query, [player_id], { prepare: true });
  }
};

// Test de création
crud.create()
  .then((result) => {
    console.log('Stat du joueur créé avec succès !', result);

    // Sauvegarder le player_id généré
    const player_id = result.player_id;

    // Vérifier les données du joueur
    return crud.read.byId(player_id);
  })
  .then((result) => {
    if (result.rows && result.rows.length > 0) {
      console.log('Stat du joueur récupérées:', result.rows);
    } else {
      console.error('Aucune stat joueur trouvé avec ce player_id');
    }
  })
  .catch((error) => {
    console.error('Erreur lors de la création ou lecture:', error);
  });

// Test de mise à jour
crud.create()
  .then((result) => {
    const player_id = result.player_id;
    console.log('Stat du joueur créé avec succès, player_id:', player_id);

    // Lire les données avant mise à jour
    return crud.read.byId(player_id);
  })
  .then((result) => {
    if (result.rows && result.rows.length > 0) {
      console.log('Stat avant mise à jour:', result.rows);

      // Mettre à jour la victoire
      return crud.update.victoire(result.rows[0].player_id, 100);
    } else {
      throw new Error('Aucune Stat joueur trouvé avant mise à jour');
    }
  })

// Test de suppression
crud.create()
  .then((result1) => {
    const player_id = result1.player_id;
    console.log('Stat du joueur créé, player_id:', player_id);

    // Supprimer le joueur après test
    return crud.delete(player_id);
  })
  .then(() => {
    console.log('Stat du joueur supprimé avec succès !');
  })
  .catch((error) => {
    console.error('Erreur lors de la suppression:', error);
  });











