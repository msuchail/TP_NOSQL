import { MongoClient } from "mongodb";
// Replace the uri string with your connection string.
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);


await client.db('GameForge').dropDatabase()
const db= client.db('GameForge')
await db.createCollection("objets")
await db.createCollection("competences")
await db.createCollection("classes")
await db.createCollection("players")

const crud = {
//Gestion des objets
    objects: {
        create: function(nom, soin, degats){
            return db.collection("objets").insertOne({
                nom: nom,
                soin: soin,
                degats: degats
            })
        },
        read: {
            all: function(){
                return db.collection("objets").find()
            },
            byId: function(object_id){
                return db.collection("objets").find({ _id: object_id })
            }
        },
        update: {
            name: function (object_id, nom) {
                return db.collection("objets").updateOne(
                    { _id: object_id },
                    { nom: nom }
                )
            },
            soin: function (object_id, soin) {
                return db.collection("objets").updateOne(
                    { _id: object_id },
                    { soin: soin }
                )
            },
            degats: function (object_id, degats) {
                return db.collection("objets").updateOne(
                    { _id: object_id },
                    { degats: degats }
                )
            }
        },
        delete(object_id){
            return db.collection("objets").deleteOne({ _id: object_id })
        }
    },
//Gestion des compétences
    competences: {
        create: function(nom){
            return db.competences.insertOne({
                nom: nom
            })
        },
        read: {
            all: function(){
                return db.competences.find()
            },
            byId: function(competence_id){
                return db.competences.find({ _id: competence_id })
            }
        },
        update: {
            name: function (competence_id, nom) {
                return db.competences.updateOne(
                    { _id: competence_id },
                    { nom: nom }
                )
            }
        },
        delete(competence_id){
            return db.competences.deleteOne({ _id: competence_id })
        }
    },
//Gestion des classes
    classes: {
        create: function(nom){
            return db.classes.insertOne({
                nom: nom
            })
        },
        read: {
            all: function(){
                return db.classes.find()
            },
            byId: function(classe_id){
                return db.classes.find({ _id: classe_id })
            }
        },
        update: {
            name: function (classe_id, nom) {
                return db.classes.updateOne(
                    { _id: classe_id },
                    { nom: nom }
                )
            }
        },
        delete(classe_id){
            return db.classes.deleteOne({ _id: classe_id })
        }
    },
//Gestion des utilisateurs
    players: {
        create: function(pseudo, classe_id, niveau){
            return db.players.insertOne({
                pseudo: pseudo,
                classe: classe_id,
                niveau: niveau,
                inventaire: [],
                competences: []
            })
        },
        read: {
            all: function(){
                return db.players.find()
            },
            byId: function(id){
                return db.players.find({ _id: id })
            },
            byPseudo: function(pseudo){
                return db.players.find({ pseudo: pseudo })
            }
        },
        update: {
            incrementLevel: function(player_id){
                return db.players.updateOne(
                    { _id: player_id },
                    { $inc: { niveau: 1 } }
                )
            },
            pseudo: function (player_id, pseudo) {
                return db.players.updateOne(
                    { _id: player_id },
                    { pseudo: pseudo }
                )
            },
            classe: function (player_id, classe_id) {
                return db.players.updateOne(
                    { _id: player_id },
                    { classe: classe_id }
                )
            },
            inventaire: {
                add: function (user_id, object_id) {
                    return db.players.updateOne(
                        { _id: user_id },
                        { $push: { id: object_id, quantite: 1 } }
                    )
                },
                incrementQuantity: function (player_id, object_id) {
                    return db.players.updateOne(
                        { _id: player_id, "inventaire.id": object_id },
                        { $inc: { "inventaire.$.quantite": 1 } }
                    )
                },
                decrementQuantity: function (player_id, object_id) {
                    return db.players.updateOne(
                        { _id: player_id, "inventaire.id": object_id },
                        { $inc: { "inventaire.$.quantite": -1 } }
                    )
                },
                remove: function (player_id, object_id) {
                    return db.players.updateOne(
                        { _id: player_id },
                        { $pull: { id: object_id } }
                    )
                },
            },
            competences: {
                add: function (player_id, competence_id) {
                    return db.players.updateOne(
                        { _id: player_id },
                        { $push: { id: competence_id, niveau: 1 } }
                    )
                },
                levelUp: function (player_id, competence_id) {
                    return db.players.updateOne(
                        { _id: player_id, "competences.id": competence_id },
                        { $inc: { "competences.$.niveau": 1 } }
                    )
                },
                remove: function (player_id, competence_id) {
                    return db.players.updateOne(
                        { _id: player_id },
                        { $pull: { id: competence_id } }
                    )
                },
            },
        }
    },
}