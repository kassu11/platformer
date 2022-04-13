# Testi v3.2
- Voi liikkua wasd
- Voi hyppiä ja maailmassa on painovoima
	- Tässä demossa on loputtomat hypyt
- Kamera seuraa pelaajaa loputtomasti
- Tukee nelikulmio tasoja, joissa on hitboxit
	- Voi olla mikä x, y tai w ja h
- Polygon muoto vaan testaa onko pelaaja sen sisällä

## Muutokset
- Optimoin miten polygon objektien hitbox lasketaan
- Muutin myös niitten renderöintiä
	- Jos ei ole näytöllä niitä ei tarvitse piirtää
	- Muutosten ansiosta, tämä demo tukee 50 000 polygon objectia
	- Eli nytten on ladattu 50k objectia näytölle :D

## Linkit

- [Testaa projektia selaimessa](https://kassu11.github.io/platformer/test-v3.2/)
- `Edellinen:` test-v3.1 [dokumentaatio](https://github.com/kassu11/platformer/tree/main/test-v3.1#readme) ja [pelattava demo](https://kassu11.github.io/platformer/test-v3.1/)!
- `Seuraava:` test-v4.0 [dokumentaatio](https://github.com/kassu11/platformer/tree/main/test-v4.0#readme) ja [pelattava demo](https://kassu11.github.io/platformer/test-v4.0/)!
- `Koti:` näytä [kaikki versiot](https://github.com/kassu11/platformer#readme)