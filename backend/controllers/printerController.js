const snmp = require("snmp-native");
const Printer = require("../models/printer");
      // Dans printerController.js
const getPrinterUsage = (req, res) => {
     // Adresse IP de l'imprimante
     const ipAddress = req.params.adresse; // Remplacez par l'adresse IP de votre imprimante

     // SNMP communauté (par défaut "public" pour la plupart des imprimantes)
     const community = "public";
 
     const oids = [
         { name: "Nom_imprimante", oid: [1,3,6,1,2,1,1,5,0] },
         { name: 'Compteur_pages_imprimées', oid: [1,3,6,1,2,1,43,10,2,1,4,1,1] },
         { name: 'État_bac_papier', oid: [1,3,6,1,2,1,43,8,2,1,9,1,1] },
         { name: 'capacite_totale', oid: [1,3,6,1,2,1,43,11,1,1,8,1,1] },
         { name: 'État_bac_sortie', oid: [1,3,6,1,2,1,43,9,2,1,8,1,1] },
         { name: 'Pages_restant_Toner_Noir', oid: [1,3,6,1,2,1,43,11,1,1,9,1,1] },
         { name: 'Pages_restant_Toner_Jaune', oid: [1,3,6,1,2,1,43,11,1,1,9,1,2] },
         { name: 'Pages_restant_Toner_Magenta', oid: [1,3,6,1,2,1,43,11,1,1,9,1,3] },
         { name: 'Pages_restant_Toner_Cyan', oid: [1,3,6,1,2,1,43,11,1,1,9,1,4] },
         { name:'ertcy',oid:[1,3,6,1,2,1,1,1,0]},
         { name:'serie',oid:[1,3,6,1,2,1,43,5,1,1,17,1]}
     ];
 
     const session = new snmp.Session({ host: ipAddress, community });
 
     function getOIDValue(oidInfo) {
        return new Promise((resolve, reject) => {
            session.get({ oid: oidInfo.oid }, (err, varbinds) => {
                if (err) {
                    console.error(`Erreur lors de la récupération de ${oidInfo.name} :`, err);
                    reject(err);
                } else {
                    const value = varbinds[0].value.toString();
                    console.log(`${oidInfo.name} :`, value);
                    resolve({ [oidInfo.name]: value });
                }
            });
        });
    }

    // Utiliser Promise.all pour exécuter toutes les requêtes en parallèle
    Promise.all(oids.map(getOIDValue))
        .then(data => {
            const result = data.reduce((acc, obj) => ({ ...acc, ...obj }), {});
            console.log('Résultat final :', result);
            res.json(result); // Envoyer le résultat sous forme de JSON
        })
        .catch(err => {
            console.error('Erreur lors de la récupération des valeurs SNMP :', err);
            res.status(500).json({ error: 'Erreur lors de la récupération des valeurs SNMP.' });
        });
};

module.exports = {
    getPrinterUsage: getPrinterUsage
};


