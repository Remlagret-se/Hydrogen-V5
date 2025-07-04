// Lokaliserad startsida som hanterar market prefixes
export {loader, default} from '~/routes/_index';

// Denna fil gör att samma startsida fungerar för både:
// - remlagret.se (ingen prefix)
// - remlagret.se/en
// - remlagret.se/de
// osv. 