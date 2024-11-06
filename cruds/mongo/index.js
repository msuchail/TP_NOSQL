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
                    { $set: { nom: nom }
                    }
                )
            },
            soin: function (object_id, soin) {
                return db.collection("objets").updateOne(
                    { _id: object_id },
                    { $set: { soin: soin } }
                )
            },
            degats: function (object_id, degats) {
                return db.collection("objets").updateOne(
                    { _id: object_id },
                    { $set: {degats: degats} }
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
            return db.collection("competences").insertOne({
                nom: nom
            })
        },
        read: {
            all: function(){
                return db.collection("competences").find()
            },
            byId: function(competence_id){
                return db.collection("competences").find({ _id: competence_id })
            }
        },
        update: {
            name: function (competence_id, nom) {
                return db.collection("competences").updateOne(
                    { _id: competence_id },
                    { $set: { nom: nom } }
                )
            }
        },
        delete(competence_id){
            return db.collection("competences").deleteOne({ _id: competence_id })
        }
    },
//Gestion des classes
    classes: {
        create: function(nom){
            return db.collection("classes").insertOne({
                nom: nom
            })
        },
        read: {
            all: function(){
                return db.collection("classes").find()
            },
            byId: function(classe_id){
                return db.collection("classes").find({ _id: classe_id })
            }
        },
        update: {
            name: function (classe_id, nom) {
                return db.collection("classes").updateOne(
                    { _id: classe_id },
                    { $set: { nom: nom } }
                )
            }
        },
        delete(classe_id){
            return db.collection("classes").deleteOne({ _id: classe_id })
        }
    },
//Gestion des utilisateurs
    players: {
        create: function(pseudo, classe_id, niveau, derniere_connexion){
            return db.collection("players").insertOne({
                pseudo: pseudo,
                classe: classe_id,
                niveau: niveau,
                derniere_connexion: derniere_connexion,
                inventaire: [],
                competences: []
            })
        },
        read: {
            all: function(){
                return db.collection("players").find()
            },
            byId: function(id){
                return db.collection("players").find({ _id: id })
            },
            byPseudo: function(pseudo){
                return db.collection("players").find({ pseudo: pseudo })
            }
        },
        update: {
            derniereConnexion: function (player_id, date) {
                return db.collection("players").updateOne(
                    { _id: player_id },
                    { $set: { derniere_connexion: date } }
                )
            },
            incrementLevel: function(player_id){
                return db.collection("players").updateOne(
                    { _id: player_id },
                    { $inc: { niveau: 1 } }
                )
            },
            pseudo: function (player_id, pseudo) {
                return db.collection("players").updateOne(
                    { _id: player_id },
                    { $set: { pseudo: pseudo } }
                )
            },
            classe: function (player_id, classe_id) {
                return db.collection("players").updateOne(
                    { _id: player_id },
                    { $set: { classe: classe_id } }
                )
            },
            inventaire: {
                add: function (user_id, object_id) {
                    return db.collection("players").updateOne(
                        { _id: user_id },
                        { $push: { inventaire: { id: object_id, quantite: 1 } } }
                    )
                },
                incrementQuantity: function (player_id, object_id) {
                    return db.collection("players").updateOne(
                        { _id: player_id, "inventaire.id": object_id },
                        { $inc: { "inventaire.$.quantite": 1 } }
                    )
                },
                decrementQuantity: function (player_id, object_id) {
                    return db.collection("players").updateOne(
                        { _id: player_id, "inventaire.id": object_id },
                        { $inc: { "inventaire.$.quantite": -1 } }
                    )
                },
                remove: function (player_id, object_id) {
                    return db.collection("players").updateOne(
                        { _id: player_id },
                        { $pull: { inventaire: { id: object_id } } }
                    )
                },
            },
            competences: {
                add: function (player_id, competence_id) {
                    return db.collection("players").updateOne(
                        { _id: player_id },
                        { $push: { competences: {id: competence_id, niveau: 1} } }
                    )
                },
                levelUp: function (player_id, competence_id) {
                    return db.collection("players").updateOne(
                        { _id: player_id, "competences.id": competence_id },
                        { $inc: { "competences.$.niveau": 1 } }
                    )
                },
                remove: function (player_id, competence_id) {
                    return db.collection("players").updateOne(
                        { _id: player_id },
                        { $pull: { competences: {_id: competence_id} } }
                    )
                },
            },
        }
    },
}

// Essai du CRUD

// Création d'un objet
console.log("Création d'objets")
await crud.objects.create("Epee de glace", 0, 10)
await crud.objects.create("Potion de soin", 10, 0)
await crud.objects.create("Arc", 0, 15)

// Lecture de tous les objets
console.log("Récupération de tous les objets :")
const objects = await crud.objects.read.all().toArray()
console.log(objects)

// Lecture d'un objet par son id
console.log("Récupération d'un objet par id :")
console.log(await crud.objects.read.byId(objects[0]._id).toArray())

// Modification d'un objet
console.log("Modification de l'objet :")
console.log("avant :")
console.log(await crud.objects.read.byId(objects[0]._id).toArray())
console.log("après :")
await crud.objects.update.name(objects[0]._id, "Epee de feu")
console.log(await crud.objects.read.byId(objects[0]._id).toArray())

// Suppression d'un objet
console.log("Suppression de l'objet :")
console.log("avant :")
console.log(await crud.objects.read.all().toArray())
await crud.objects.delete(objects[0]._id)
console.log("après :")
console.log(await crud.objects.read.all().toArray())


// Création d'une compétence
console.log("Création de compétences")
await crud.competences.create("Coup critique")
await crud.competences.create("Soin")
await crud.competences.create("Tir rapide")

// Lecture de toutes les compétences
console.log("Récupération de toutes les compétences :")
const competences = await crud.competences.read.all().toArray()
console.log("Récupération d'une compétence par id :")
console.log(await crud.competences.read.byId(competences[0]._id).toArray())

// Modification d'une compétence
console.log("Modification de la compétence :")
console.log("avant :")
console.log(await crud.competences.read.byId(competences[0]._id).toArray())
console.log("après :")
await crud.competences.update.name(competences[0]._id, "Coup critique amélioré")
console.log(await crud.competences.read.byId(competences[0]._id).toArray())


// Suppression d'une compétence
console.log("Suppression de la compétence :")
console.log("avant :")
console.log(await crud.competences.read.all().toArray())
await crud.competences.delete(competences[0]._id)
console.log("après :")
console.log(await crud.competences.read.all().toArray())


// Création d'une classe
console.log("Création de classes")
await crud.classes.create("Guerrier")
await crud.classes.create("Mage")
await crud.classes.create("Archer")

// Lecture de toutes les classes
console.log("Récupération de toutes les classes :")
const classes = await crud.classes.read.all().toArray()
console.log("Récupération d'une classe par id :")
console.log(await crud.classes.read.byId(classes[0]._id).toArray())

// Modification d'une classe
console.log("Modification de la classe :")
console.log("avant :")
console.log(await crud.classes.read.byId(classes[0]._id).toArray())
console.log("après :")
await crud.classes.update.name(classes[0]._id, "Guerrier amélioré")
console.log(await crud.classes.read.byId(classes[0]._id).toArray())

// Suppression d'une classe
console.log("Suppression de la classe :")
console.log("avant :")
console.log(await crud.classes.read.all().toArray())
await crud.classes.delete(classes[0]._id)
console.log("après :")
console.log(await crud.classes.read.all().toArray())


// Création d'un joueur
console.log("Création de joueurs")
await crud.players.create("Jean", classes[0]._id, 1, new Date())
await crud.players.create("Paul", classes[1]._id, 1, new Date())
await crud.players.create("Jacques", classes[2]._id, 1, new Date())

// Lecture de tous les joueurs
console.log("Récupération de tous les joueurs :")
const players = await crud.players.read.all().toArray()
console.log("Récupération d'un joueur par id :")
console.log(await crud.players.read.byId(players[0]._id).toArray())
console.log("Récupération d'un joueur par pseudo :")
console.log(await crud.players.read.byPseudo("Paul").toArray())

// Modification d'un joueur
console.log("Modification du joueur :")
console.log("avant :")
console.log(await crud.players.read.byId(players[0]._id).toArray())
console.log("après :")
await crud.players.update.derniereConnexion(players[0]._id, new Date())
console.log(await crud.players.read.byId(players[0]._id).toArray())

// Modification de l'inventaire d'un joueur
console.log("Ajout d'un objet à l'inventaire :")
console.log("avant :")
console.log(await crud.players.read.byId(players[0]._id).toArray())
console.log("après :")
await crud.players.update.inventaire.add(players[0]._id, objects[0]._id)
console.log(await crud.players.read.byId(players[0]._id).toArray())

console.log("Incrémentation de la quantité d'un objet dans l'inventaire :")
console.log("avant :")
console.log(await crud.players.read.byId(players[0]._id).toArray())
console.log("après :")
await crud.players.update.inventaire.incrementQuantity(players[0]._id, objects[0]._id)

// Suppression d'un objet de l'inventaire
console.log("Suppression d'un objet de l'inventaire :")
console.log("avant :")
console.log(await crud.players.read.byId(players[0]._id).toArray())
console.log("après :")
await crud.players.update.inventaire.remove(players[0]._id, objects[0]._id)
console.log(await crud.players.read.byId(players[0]._id).toArray())

// Ajout d'une compétence à un joueur
console.log("Ajout d'une compétence à un joueur :")
console.log("avant :")
console.log(await crud.players.read.byId(players[0]._id).toArray())
console.log("après :")
await crud.players.update.competences.add(players[0]._id, competences[0]._id)
console.log(await crud.players.read.byId(players[0]._id).toArray())

// Level up d'une compétence
console.log("Level up d'une compétence :")
console.log("avant :")
console.log(await crud.players.read.byId(players[0]._id).toArray())
console.log("après :")
await crud.players.update.competences.levelUp(players[0]._id, competences[0]._id)
console.log(await crud.players.read.byId(players[0]._id).toArray())

// Suppression d'une compétence
console.log("Suppression d'une compétence :")
console.log("avant :")
console.log(await crud.players.read.byId(players[0]._id).toArray())
console.log("après :")
await crud.players.update.competences.remove(players[0]._id, competences[0]._id)
console.log(await crud.players.read.byId(players[0]._id).toArray())
