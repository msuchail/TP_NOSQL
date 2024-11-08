# TP NOSQL

## Membres du groupe
- **VINCENT Lucas**
- **AKLI Lounes**
- **BEAL Anthony**
- **SUCHAIL Mathias**

## Contexte
Le but de ce TP est de modéliser et de développer un écosystème de bases de données non relationnelles pour un jeu de type MMORPG en ligne.
Cet écosysteme est composé de 3 bases de données :
- **MongoDB** : Base de données orientée document, pour les données des joueurs
- **Redis** : Base de données orientée clé-valeur, pour les interactions en temps réel
- **Cassandra** : Base de données orientée colonne, pour faire des statistiques,

## Installation
### Prérequis
- **Docker** : Pour lancer les bases de données
### Lancement et installation des dépendances node

```bash
docker-compose up -d && 
docker exec node npm --prefix mongo install &&
docker exec node npm --prefix redis install &&
docker exec node npm --prefix cassandra install
```

### Test des CRUDS
Les CRUDS sont disponibles dans le dossier cruds du repository.
Un service node.js est disponible pour tester les CRUDS, pour le lancer :

#### CRUD mongo
```bash
docker exec node node mongo/index.js
```
#### CRUD redis
```bash
docker exec node node redis/index.js
```
#### CRUD cassandra (Attention, la base de données prend un peu de temps à se lancer. Si vous avez une erreur, relancez la commande après une minute)
```bash
docker exec node node cassandra/index.js
```