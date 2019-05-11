const deckCards = ["2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C", "JC", "QC", "KC", "AC", "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "10S", "JS", "QS", "KS", "AS", "2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "10H", "JH", "QH", "KH", "AH", "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "10D", "JD", "QD", "KD", "AD"]
const createShoe = (numDecks) =>{
    //Inefficient and insecure
    let shoe = [];
    for(let i = 0; i<numDecks; i++){
        let tempDeck = deckCards.slice(0,52);
        for(let j = tempDeck.length; j>0; j--){
        //Replace with difference random number generator
        let r = Math.floor(Math.random()*j)
        shoe.push(...tempDeck.splice(r,1));
        }
    }
    return shoe;
}

module.exports = {
    createShoe:createShoe
}

