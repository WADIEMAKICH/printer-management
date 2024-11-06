const snmp = require('snmp-native');

// Adresse IP de l'imprimante à interroger
//const printerIP = '172.16.13.165'; //Noir XEROX

const printerIP = '11.11.11.52'; // XEROX
//const printerIP = '172.16.13.141'; //X XEROX
//const printerIP = '172.16.13.131'; reverse //Develop ineo+ 308 KONIKA
//11.11.11.52 XEROX
// Créer un nouvel objet de session SNMP
const session = new snmp.Session({ host: printerIP, community: 'public' });

// Définition des OID à récupérer
const oids = [
    { name: " Nombre total d'impression HP1", oid: [1, 3, 6, 1, 2, 1, 43, 10, 2, 1, 4, 1, 1] },
    { name: "HP2", oid: [1, 3, 6, 1, 2, 1, 43, 11, 1, 1, 9, 1, 1] },
    { name: "HP3", oid: [1, 3, 6, 1, 2, 1, 43, 11, 1, 1, 9, 1, 2] },
    { name: "HP4", oid: [1, 3, 6, 1, 2, 1, 43, 8, 2, 1, 9, 1, 1] },
    { name: "HP5", oid: [1, 3, 6, 1, 2, 1, 25, 3, 5, 1, 1, 1] },
    { name: "le niveau de toner du toner magenta HP6", oid: [1, 3, 6, 1, 2, 1, 43, 11, 1, 1, 9, 1, 3] },
    { name: "le niveau de toner du toner jaune HP7", oid: [1, 3, 6, 1, 2, 1, 43, 11, 1, 1, 9, 1, 4] },
    { name: "Nom de l'imprimante", oid: [1, 3, 6, 1, 2, 1, 1, 5, 0] },
    { name: 'Compteur de pages imprimées', oid: [1, 3, 6, 1, 2, 1, 43, 10, 2, 1, 4, 1, 1] },
    { name: 'État du bac de papier', oid: [1, 3, 6, 1, 2, 1, 43, 8, 2, 1, 9, 1, 1] },
    { name: 'Température de l’imprimante', oid: [1, 3, 6, 1, 2, 1, 2, 2, 1, 10, 1] },
    { name: 'capacite totale', oid: [1, 3, 6, 1, 2, 1, 43, 11, 1, 1, 8, 1, 1] },
    { name: 'État du bac de sortie', oid: [1, 3, 6, 1, 2, 1, 43, 9, 2, 1, 8, 1, 1] },
    { name: 'Pages restant Toner Noir', oid: [1, 3, 6, 1, 2, 1, 43, 11, 1, 1, 9, 1, 1] },
    { name: 'Pages restant Toner Jaune', oid: [1, 3, 6, 1, 2, 1, 43, 11, 1, 1, 9, 1, 2] },
    { name: 'Pages restant Toner Magenta', oid: [1, 3, 6, 1, 2, 1, 43, 11, 1, 1, 9, 1, 3] },
    { name: 'Pages restant Toner Cyan', oid: [1, 3, 6, 1, 2, 1, 43, 11, 1, 1, 9, 1, 4] },
    { name: 'ertcy', oid: [1, 3, 6, 1, 2, 1, 1, 1, 0] }

];

// Fonction pour récupérer les valeurs pour chaque OID
function getOIDValue(oidInfo) {
    session.get({ oid: oidInfo.oid }, (err, varbinds) => {
        if (err) {
            console.error(`Erreur lors de la récupération de ${oidInfo.name} :`, err);
        } else {
            const value = varbinds[0].value.toString();
            console.log(`${oidInfo.name} :`, value);
        }
    });
}

// Récupération des valeurs pour chaque OID
oids.forEach(getOIDValue);

// Fermer la session SNMP après un délai de 5 secondes (pour laisser le temps de récupérer toutes les valeurs)
setTimeout(() => {
    session.close();
}, 5000);

