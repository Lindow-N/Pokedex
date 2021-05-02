# Test de commandes Mongo

## Analyse des données

1. On s'assure que le serveur est lancé avec `sudo service mongod start`
2. on se connecte avec la commande `mongo` dans le terminal.
3. montrer l'ensemble des base présentes avec `show dbs`
4. afin de d'utiliser une base de donnée on utilise `use pokemon` (la BDD est créer si elle n'existe pas)
5. Afin de sortir du cliet Mongo on utilise `exit`
6. Afin d'importer des données dans la base "pokemon" on utilise la commande `mongorestore -d pokemon data/`
7. Dans le client mongo (`mongo`) on peut renommer la collection "samples_pokemon" en "pokedex" grâce à la commande `db.samples_collection.renameCollection("pokedex")`

Note : Une commande Mogno resemble trait pour trait a une instruction JavaScript. L'objet principal est la base de donnée courante (défini par `use <dbname>`, l'objet enfant est le nom de la collection, puis s'ensuit une méthode de traitement ou d'analyse)

## Quelques commandes de sélection

Attention : le filtrage sous Mongo est Case-sensitive

### Récupérer l'ensemble des données d'une collection

```javascript
db.pokedex.find()
```

### Compter les nombre de documents dans la collection pokedex

```javascript
db.pokedex.count()
```

### Ajouter une restriction à une méthode

On peut fournir en argument à la plupart des méthodes un objet JavaScript précisant le filtrage.

```javascript
db.pokedex.find({id: 150})`, `db.pokedex.count({id: 150})
```

On peut mettre plusieurs filtres dans l'objet envoyé à la méthode

```javascript
db.pokedex.find({id: 150, name: 'Mextwo'})
```

tous les filtres fourni doivent être vrais.

### Mise en forme lisible

C'est bien gentil tout ça mais la sortie n'est pas très lisible. On peut y remedier grâce à la méthode pretty()

```javascript
db.pokedex.find({id: 150}).pretty()
```

### Filtrer la sortie de sélection

Pour filtrer la sortie en mongo on appelle cela une "projection", dans un "find" cela est précisé en 2ème argument sous form d'objet ou l'on lliste les champs désirés. Par défaut il sortira toujours le champ "_id" il faut lui préciser explicitement que l'on ne le veut pas.

```javascript
db.pokedex.find({id: 150}, {name: 1, _id: 0})
```

En mongo le booléen au sens strict du terme n'existe pas (pas de true/false) il est remplacer par une valeur binaire (1/0) true = 1, false = 0.

### Recherche d'un élément d'un tableau

Mongo c'est que lorsque l'on cherche sur une propriété (champ) qui contient un tableau, il faut qu'il cherche la valeur donnée dans ce tableau.

```javascript
db.pokedex.find({type: "Psychic"})
```

Les valeurs contenu dans la propriété type est de type "tableau" il va rechercher tout les pokemons qui on au moins le type "psychic"

### Recherche dans un sous-document

Un sous-document mongo est un objet contenu dans une des propriété racine du document principal.

```javascript
db.pokedex.find({"prev_evolution.name": "Eevee"})
```

Attention il ne faut pas oublié de rajouter les guillemerts autour du nom de la propriété, car ici on utilise le `.`. C'est exactement comme en JS.

## Les modificateurs ou opérateur de comparaison

https://docs.mongodb.com/manual/reference/operator/query-comparison/

En Mongo comme en JS on ne peut pas modifier l'utilisation des `:`. On ne peut donc pas modifier l'opérateur de comparaison. Il faut utiliser une autre solution qui est bien plus souple au final qu'un popérateur standard.

à la place de la valeur "strict" on utilise un objet où on sopécifie le type de comparaison.
L'opérateur de comparaison (modificateur) commence toujours par un `$`

```javascript
db.pokedex.find({spawn_chance: {$gte: 2}})
```

```javascript
db.pokedex.find({type: {$in: ['Dragon', 'Ice']}})
```

## Les tris et limitations

### Tri

Pour trier des document on on le fait de la même façon qu'en JS.
Avec la méthode `.sort()` par contre l'argument ici est un tableau au lieu d'une fonction de callback.

Par ordre alphabétique (ascendant : 1) : 
```javascript
db.pokedex.find({type: {$in: ['Dragon', 'Ice']}}, {name: 1}).sort({name: 1})
```

Par ordre inverse : (descendant: -1)
```javascript
db.pokedex.find({type: {$in: ['Dragon', 'Ice']}}, {name: 1}).sort({name: -1})
```

## limitation

pour limiter le nombre de documents en sorti il y a aussi une méthode à laquelle on passe un entier.

```javascript
db.pokedex.find({}, {name: 1}).limit(10)
```

Petit tips : Ici pour pouvoir faire une projection sans faire de filtre, on peut passer un objet vide en premier argument.

## Insertion de documents

Grâce à la méthode insert sur la collection, oin peut ajouter un document. Pour cela on lui fourni un objet BSON contenant les différentes informations le concernant.

```javascript
db.pokedex.insert({nom: 'Yann'})
```

En retour Mongo nous répond, si tout c'est bien passé. Le nombre d'enregistrement insérés.

`WriteResult({ "nInserted" : 1 })`

On peut vérifier l'existance de ce document en refaisant une sélection de celui-ci.

```javascript
db.pokedex.find({nom: 'Yann'})
```

On remarquera que Mongo à ajouté la propriété "_id"

## Modifications de documents

https://docs.mongodb.com/manual/reference/command/update/index.html

Pour effectuer une modifcation, quelle que soit le type de BDD, on a toujours besoin d'un filtre et des valeurs à mettre à jour.

Pour mongo on lui fourni dans la méthode "update" en premier argument le filtre et en deuxième les valeurs à mettre à jour et comment les mettre à jour.

```javascript
db.pokedex.update({nom: 'Yann'}, {$set: {nom: 'Yann Guilloux'}})
```

Il retourne également le résultat de l'opération : 
`WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })`

Mais il existe d'autres opérateurs bien pratiques :
https://docs.mongodb.com/manual/reference/operator/update/index.html

Par exemple si l'on veut incremeneter un score ou un nombre de visites, on peut utiliser la commande suivante : 

```javascript
db.pokedex.update({nom: 'Yann Guilloux'}, {$inc: {score: 1}})
```

Si on veut mettre à jour plusieurs documents, on peut utiliser la méthode `updateMany()` à la place de `update()`. ou rajouter en 3ème argument un oibjet d'option avec la propriété `multi: 1`

## Suppressions de documents

https://docs.mongodb.com/manual/reference/delete-methods/index.html

cela fonctionne comme `find` mais avec un remove à la place.

```javascript
db.pokedex.remove({nom: 'Yann Guilloux'})
```

Comme après une insertion il nous répond le nombre de documents effacés :
`WriteResult({ "nRemoved" : 1 })`

## Agrégations

Version simple identique à `db.pokedex.find({type: 'Fire'}, {name: 1, _id: 0})`

```javascript
db.pokedex.aggregate([
    // Permière étape : le filtre
    {
        $match: {
            type: 'Fire'
        }
    },
    // 2ème étape : on limite les données en sortie
    {
        $project: {
            name: 1
        }
    },
    // mais je peux y rajouter aussi un tri

    {
        $sort: {
            name: 1
        }
    },

    // Et une limitation

    {
        $limit: 10
    }

]);
```

Mais le vrai intérêt des agrégations c'est la statistiques, donc on va utiliser l'opérateur de'étape "$group".

Le but de l'agrégation suivante va être compter le nombre de pokemon par type, et d'y référencer les noms des pokémons de ce type.

```javascript

db.pokedex.aggregate([
    // Avant le groupe il va falloir décomposer les types ds pokemons
    // On va dupliquer les documents par autant de document qu'il a de type, pour cela on va "dérouler" (unwind) les document par rapport au tableau présent dans le type
    {
        $unwind: "$type"
    },
    {
        $group: {
            // pour grouper on défini d'abord les propriétés qui seront utilisé pour grouper dans une propriété qui s'appelera toujours "_id"
            // par contre afin qu'il comprenne qu'on lui fourni une des propriété du document, on doit rajouter le signe "$" devant le nom de la propriété
            _id: "$type",
            total: {
                // Pour chaque document on ajoute un (1) dans la propriété total
                $sum: 1
            },
            // Afin de stocker les noms des pokemons ayant le type courant du groupe, je créer une nouvelle propriété qui accueillera un tableau contenant la liste des pokemons
            list: {
                $push: "$name"
            }
        }
    },
    // On peut en plsu à la fin classé par total pour avoir un top
    // dans chaque nouvelle étape on a accès et SEULEMENT accès au propriété présente en sortie de la dernière étape
    {
        $sort: {
            total: -1
        }
    }

]);

```

Le signe "$" s'il est placé sur le nom de la propriété cela correspond à un "opérateur" (modificateur) et s'il est placé au niveau de la valeur cela précise que la valeur fait référence à une propriété du document courant.
