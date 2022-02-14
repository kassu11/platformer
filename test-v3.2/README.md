# Testi v3.2
- Voi liikkua wasd
- Voi hyppiä ja maailmassa on painovoima
	- Tässä demossa on loputtomat hypyt
- Kamera seuraa pelaajaa loputtomasti
- Tukee tasojen hitboxeja
	- Voi olla mikä x, y tai w ja h
- Polygon muoto vaan testaa onko pelaaja sen sisällä

## Muutokset
- Optimoin miten polygon objectejen hitbox lasketaan
- Muutin myös niitten renderöintiä, että jos ne ei ole näytöllä niitä ei tarvitse piirtää
	- Muutosten ansiosta, tämä demo tukee 50 000 polygon objectia
	- Eli nytten on ladattu 50k objectia näytölle :D