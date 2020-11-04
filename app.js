App = {
  web3Provider: null,
  contracts: {},
  account : "0x0",

  init: async function()
  {
    return await App.initWeb3();
  },

  initWeb3: async function()
  {
    if(typeof web3 != 'undefined')
    {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    }
    else
    {
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON("../eshop.json", function(eshop){
      App.contracts.eshop = TruffleContract(eshop);
      App.contracts.eshop.setProvider(App.web3Provider);
    }).done(function (){
      App.getPerson();

      return App.bindEvents();
    });

  },

  bindEvents: function() {

    web3.eth.getCoinbase(function(err, account){
      if(err==null){
        App.accounts = account;
      }
    });
  },

  addPerson: async function() {

    var _name = document.getElementById('pname').value;
    var _imgPath = document.getElementById('pimg').value;

    if( _name != "" && _imgPath != "" )
    {
      let instance = await App.contracts.eshop.deployed();
      instance.addPerson(_name, _imgPath,{from:App.accounts}).then(function(){
        App.getPerson();
      });
    }
    else
    {
      document.getElementById('alert').innerHTML = "<div class='alert alert-warning' role='alert'> Please fill out the form! </div>";
    }
  },

  getPerson: async function(){

    let instance = await App.contracts.eshop.deployed();
    var count = await instance.getCount();
    if(parseInt(count)==0)
    {
      document.getElementById('getData').innerHTML = "<td>N/A</td><td>N/A</td><td>N/A</td>";
      document.getElementById('alert').innerHTML = "<div class='alert alert-success' role='alert'> Sorry! No Added Persons! </div>";
    }
    else
    {
      for (var i = 0; i < parseInt(count); i++) {
        var personData = await instance.getPerson(i);
        document.getElementById('getData').innerHTML += "<td>" + personData[0] + "</td><td>" + personData[1] + "</td><td>" + personData[2]  + " <img src='"+personData[2]+"' width='50px' height='50px'></td>";
      }
    }


  },

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
