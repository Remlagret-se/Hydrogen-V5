// Lokaliserad kollektionssida som hanterar market prefixes
// Denna fil gör att samma collection-sida fungerar för både:
// - /collections/vinkelkontaktlager (svenska)
// - /en/collections/angular-contact-bearings (engelska)
// - /de/collections/schrägkugellager (tyska)
// osv.

// Exportera samma loader och komponent som huvudroute
export {loader, default} from '~/routes/collections.$collectionHandle'; 