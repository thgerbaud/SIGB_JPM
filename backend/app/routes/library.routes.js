module.exports = app => {
    const library = require("../controllers/library.controller.js");
    const { getTokenInfos } = require("../controllers/auth.controller.js");
  
    const router = require("express").Router();
  
    /**
     * Permet de créer une nouvelle bibliothèque.
     * @entree {name, [locations,] [categories]}
     * @sortie bibliothèque créée
     * @auth token necessaire
     * @status 201
     */
    router.post("/", getTokenInfos, library.create);
  
    /**
     * Permet de retrouver les informations de toutes les bibliothèques d'un utilisateur.
     * @sortie liste de bibliothèques
     * @auth token necessaire
     * @status 200
     */
    router.get("/", getTokenInfos, library.findAll);
  
    /**
     * Permet de retrouver les informations d'une bibliothèque.
     * @sortie bibliothèque correspondant à l'id
     * @auth token necessaire, admin ou invité
     * @status 200
     */
    router.get("/:id", getTokenInfos, library.findOne);

    /**
     * Permet de retrouver les livres d'une bibliothèque.
     * @sortie liste de livres
     * @auth token necessaire, admin ou invité
     * @status 200
     */
    router.get("/:id/books", getTokenInfos, library.getBooks);
  
    /**
     * Permet de mettre à jour les paramètres d'une bibliothèque.
     * @entree paramètres à mettre à jour (nom, emplacements, catégories)
     * @sortie bibliothèque (paramètres ?) mise à jour //?
     * @auth token necessaire, admin
     * @status 200
     */
    router.put("/:id/settings", getTokenInfos, library.updateSettings); // TODO

    /**
     * Permet d'ajouter un admin.
     * @entree {email}
     * @sortie [admins] //?
     * @auth token necessaire, admin //?
     * @status 200
     */
    router.post("/:id/admins", getTokenInfos, library.addAdmin);

    /**
     * Permet d'ajouter un utilisateur.
     * @entree {email}
     * @sortie [users] //?
     * @auth token necessaire, admin
     * @status 200
     */
    router.post("/:id/users", getTokenInfos, library.addUser);

    /**
     * Permet de supprimer un utilisateur.
     * @entree {email}
     * @sortie [users] //?
     * @auth token necessaire, admin
     * @status 200
     */
    router.delete("/:id/users", getTokenInfos, library.deleteUser);
  
    /**
     * Permet de supprimer une bibliothèque
     * @auth token necessaire, admin //? createur
     * @status 204
     */
    router.delete("/:id", getTokenInfos, library.delete);
  
    app.use('/api/libraries', router);
  };