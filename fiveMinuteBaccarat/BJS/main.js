"use strict";

const cWidth = 1200;
const cHeight = 800;

const BGCanvas = document.getElementById('BGCanvas');
const mainCanvas = document.getElementById('mainCanvas');
const BGctx = BGCanvas.getContext('2d');
const ctx = mainCanvas.getContext('2d');

const minBet = 0, maxBet = 5000;

ctx.globalCompositionOperation='destination-over';
BGctx.globalCompositionOperation='destination-over';

mainCanvas.style.position = 'absolute';
BGCanvas.style.position = 'absolute';
BGCanvas.style.zIndex = -1;

mainCanvas.width = BGCanvas.width = cWidth;
mainCanvas.height = BGCanvas.height = cHeight;

const setUp = (function(){
  const cardPicLoc = "./Images/Cards/";
  const picLoc = "./Images/MiscImages/";
  const cardImgMap = new Map();
  const miscImgMap = new Map();
  const pics = ['RedFeltTable.jpg','GoldCoin.png','FrameNarrow.png','bitcoin.png','CardBack.png','player.png','banker.png','tie.png','he.png','RedChip.png','BlueChip.png','BlackChip.png','DragonLeft.png','DragonRight.png'];

  const cardSuits = ['C','S','H','D'];
  const faceCards = ['J','Q','K','A'];

  const deckCards = [];
  cardSuits.forEach((suit)=>{
    let pic = '';
    for(let i = 2; i<=10; i++){
      deckCards.push(i.toString()+suit);
    }
    faceCards.forEach((face)=>{
      deckCards.push(face+suit);
    });
  });

  const deckPics = [];
  deckCards.forEach((card)=>{deckPics.push(card+'.png');})

  const promiseCardImgArr = asyncHelperFunctions.createPromImgArr(deckPics, cardImgMap, cardPicLoc);
  const promiseMiscPicArr = asyncHelperFunctions.createPromImgArr(pics, miscImgMap, picLoc);

  Promise.all(promiseCardImgArr.concat(promiseMiscPicArr)).then(()=>{
    drawBG();
  });

  function createShoe(numDecks){

    return [];
  }

  function drawBG(){
    let imgSize = Math.floor(cWidth/10);
    let xLocP = Math.floor(cWidth*0.25-imgSize/2);
    let xLocT = Math.floor(cWidth*0.5-imgSize/2);
    let xLocB = Math.floor(cWidth*0.75-imgSize/2);
    let yLoc = Math.floor(cHeight/4-imgSize/2);
    BGctx.drawImage(miscImgMap.get('RedFeltTable'),0,0,cWidth,cHeight);
    BGctx.drawImage(miscImgMap.get('DragonLeft'),0,0,cWidth/4,cHeight*0.75);
    BGctx.drawImage(miscImgMap.get('DragonRight'),cWidth*0.75,0,cWidth/4,cHeight*0.75);
    BGctx.drawImage(miscImgMap.get('player'),xLocP,yLoc-120,imgSize,imgSize);
    BGctx.drawImage(miscImgMap.get('he'),xLocT,yLoc-120,imgSize,imgSize);
    BGctx.drawImage(miscImgMap.get('banker'),xLocB,yLoc-120,imgSize,imgSize);
    BGctx.drawImage(miscImgMap.get('FrameNarrow'),0,cHeight*0.75,cWidth,cHeight*0.25);
  }

  return{
    cardImgMap:cardImgMap,
    miscImgMap:miscImgMap,
    createShoe:createShoe
  }

})()
