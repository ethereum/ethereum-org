
function showBalance(acc){
  if(acc) alert(numeral(acc.balance).divide(1e18).format("0,0.00")+ " ETH");
}

(function(){

  var accounts = null;
  var $checkForm = $("#ether-checker");

  $checkForm.submit(function(e){
    e.preventDefault();
    var addr = $checkForm.find("input[name=address]").val();
    if(!addr) return;
    if (addr.slice(0,2) == "0x"){
      addr = addr.slice(2)
    }
    addr = addr.toLowerCase();
    if (accounts == null){
      $.getJSON( "/images/mainnet.json", function( data ) {
        accounts = data.alloc;
        showBalance(accounts[addr]);
      });
    }else{
      showBalance(accounts[addr]);
    }

  });
})()
