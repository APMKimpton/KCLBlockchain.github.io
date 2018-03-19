var Web3 = require('web3');
var web3 = window.web3;
var $ = require("jquery");

if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
    console.log("Using injected....");
} else {
    alert("web3 not defined - use the fields instead");
    console.log("You are not using MetaMask, ");
}

const abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_candidate",
				"type": "uint256"
			}
		],
		"name": "vote",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "winners",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_candidate",
				"type": "uint256"
			}
		],
		"name": "totalVotesFor",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "winner",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_voter",
				"type": "address"
			}
		],
		"name": "votedFor",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getMaxVotes",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "myCandidates",
				"type": "bytes32[]"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	}
]

const contractAddress = '0x1cFeDF36c3f79585248de893812f979B83305E9D'
var contract = web3.eth.contract(abi).at(contractAddress);


$(document).ready(function() {
    if($("#index_page")){
        $("#voteBtn").click(function(){
            if (!$("input[name=bars]:checked").val()) {
               alert('Make a selection!');
            }
            else {
                contract.vote.sendTransaction(parseInt($("input[name=bars]:checked").attr("id")), {
                    from: web3.eth.accounts[0],
                    gas: 4000000},
                    function (error, result){ //get callback from function which is your transaction key
                        if(!error){
                            console.log(result);
                        } else{
                            console.log(error);
                        }
                });
            }
        });
        $("#viewVote").click(function(){
            contract.votedFor.call(web3.eth.accounts[0], {gas: 200000}, function (error, result){
                $("#voteText").text("You have voted for: " + result);
            });
        });
        $("#viewBalanceBtn").click(function(){
            web3.eth.getBalance(web3.eth.accounts[0], function (error, result){
                $("#balanceText").text("The balance of " + web3.eth.accounts[0] + " is: " + result.c[0]/10000 + " ETH");

            });
        });
    }
    if($("#results_page")){
        $("#resultsBtn").click(function(){
            //Hardcoded in this example
            var voteCounts = [];
            for(var i = 0; i < 4; i++){
                contract.totalVotesFor.call(i, {gas: 200000 }, function (error, result){
                    voteCounts.push(result.c[0]);
                    setResultText(voteCounts); //This should be improved and not called multiple times - will fix later
                });
            }
        });
    }
});

function setResultText(voteCounts){
    $("#resultsText").html(
        "<p>The total number of votes for Cubana is: " + voteCounts[0] + "</p>" +
        "<p>The total number of votes for Knight's templar is: " + voteCounts[1] + "</p>" +
        "<p>The total number of votes for Edgar Wallace is: " + voteCounts[2] + "</p>" +
        "<p>The total number of votes for Lyceum is: " + voteCounts[3] + "</p>"
    );
}
