import "./css/index.css"
import IMask from "imask";

const ccBGColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const ccBGColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const ccIcon = document.querySelector(".cc-logo span:nth-child(1) img")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");

function setCardType(type){

  const colors = {
    visa: ["#2D57F2", "#436D99"],
    mastercard: ["#C69347", "#DF6F29"],
    nubank: ["#734399", "#902DF2"],
    elo: ["#790808", "#9D9F15"],
    alelo: ["#0E4513", "#639F15"],
    hipercard: ["#0E3145", "#63D5F9"],
    american_express: ["#85560F", "#63F99F"],
    maestro: ["#3A9BD9", "#CC2131"],
    default: ["black", "gray"],
  };

  if (type == "nubank")
    ccIcon.setAttribute("src", `cc-icon-${type}.svg`);
  else
    ccIcon.setAttribute("src", `cc-icon.svg`);

  ccBGColor01.setAttribute("fill", colors[type][0]);
  ccBGColor02.setAttribute("fill", colors[type][1]);
  ccLogo.setAttribute("src", `cc-${type}.svg`);
}

globalThis.setCardType = setCardType;

const securyCode = document.querySelector("#security-code");
const securyCodePattern = {
  mask: "0000"
}
const securityCodeMasked = IMask(securyCode, securyCodePattern);

const expirationDate = document.querySelector("#expiration-date");
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY:{
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2)
    },
    MM:{
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    }
  }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern);

const cardNumber = document.querySelector("#card-number");
const cardNumberPattner = {
  mask: [
    {
      mask: "0000 000000 00000",
      regex:
        /^((5067((0(7|8))|(1(5|9))))|(509((0((5[4-9])|(6[0-3])|84))|106)))\d{0,12}$/,
      cardtype: "alelo",
    },
    {
      mask: "0000 000000 00000",
      regex:
        /^((((636368)|(438935)|(504175)|(451416)|(636297))\d{0,10})|((5067)|(4576)|(4011))\d{0,12})$/,
      cardtype: "elo",
    },
    {
      mask: "0000 000000 00000",
      regex: /^(606282|637095|637599|637568)\d{0,10}|^3841\d{0,15}/,
      cardtype: "hipercard",
    },
    {
      mask: "0000 000000 00000",
      regex: /^3[47]\d{0,13}/,
      cardtype: "american_express",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(5((162(((2|3)0)|92))|23421|37678|50209|54865))\d{0,10}/,
      cardtype: "nubank",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/,
      cardtype: "maestro",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")

    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })
    return foundMask
  },
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattner);

const cardHolder = document.querySelector("#card-holder")
const cardHolderPattner = {
  mask: /^[^\s\d][a-z\s]{0,30}$/,
}

const cardHolderMasked = IMask(cardHolder, cardHolderPattner)

const addButton = document.querySelector("#add-card");
addButton.addEventListener("click", () => {
  if (
    (cardHolderMasked.value == "") |
    (cardNumberMasked.value == "") |
    (securityCodeMasked.value == "") |
    (expirationDateMasked.value == "")
  )
    alert("Ops! Complete todos os campos para poder adicionar o cartão!")
  else alert("Cartão adicionado!")
});

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
});

cardHolderMasked.on("accept", () => {
  updateCardHolde(cardHolderMasked.value);
});

function updateCardHolde(name){
  const ccHolder = document.querySelector(".cc-holder .value");
  ccHolder.innerText =
    name.length === 0 ? "FULANO DA SILVA" : name;
};

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
});

function updateSecurityCode(code){
  const ccSecurity = document.querySelector(".cc-security .value");
  ccSecurity.innerText =
    code.length === 0 ? "123" : code;
};

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype;
  setCardType(cardType);
  updateCardNumber(cardNumberMasked.value);
});

function updateCardNumber(number){
  const ccNumber = document.querySelector(".cc-number");
  ccNumber.innerText = number.length === 0  ? "1234 5678 9012 3456" : number;
};

expirationDateMasked.on("accept", () => {
  updateExpirantionDate(expirationDateMasked.value);
});

function updateExpirantionDate(date){
  const ccExpiration = document.querySelector(".cc-extra .value");
  ccExpiration.innerText = date.length === 0 ? "02/32" : date;
};