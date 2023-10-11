module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true,
        "node": true
    },
    'extends': 'eslint:recommended',
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
        'indent': [
            'error',
            2
        ],
        'linebreak-style': [
            'error',
            'windows'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'never'
        ],
        'eqeqeq': 'error', // varoittaa, jos yhtä suuruutta verrataan jotenkin muuten kuin '==='
        'no-trailing-spaces': 'error', // estetään rivien lopussa olevat turhat välilyönnit
        'object-curly-spacing': [   // aaltosulkeiden edessä ja jälkeen pitää olla aina välilyönti
            'error', 'always'
        ],
        'arrow-spacing': [  // nuolifunktioiden parametrien suhteen oikea välilyöntien käyttö
            'error', { 'before': true, 'after': true }
        ],
        'no-console': 0, // console.log -komennoista varoittava sääntö pois päältä
    },
}
