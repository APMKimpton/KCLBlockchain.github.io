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

const contractAddress = '0xdD8b0d01dfE18138d3A8b165711b50b492b8d6B7';
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

            //Hardcoded in this example to avoid asynchronous calls - wrong ordering - need to fix
            $("#resultsText").text("");
            contract.totalVotesFor.call(0, {gas: 200000 }, function (error, result){
                $("#resultsText").append("<p>The total number of votes for Cubana is: " + result.c[0] + "</p>");
                contract.totalVotesFor.call(1, {gas: 200000 }, function (error, result){
                    $("#resultsText").append("<p>The total number of votes for Knight's Templar is: " + result.c[0] + "</p>");
                    contract.totalVotesFor.call(2, {gas: 200000 }, function (error, result){
                        $("#resultsText").append("<p>The total number of votes for Edgar Wallace is: " + result.c[0] + "</p>");
                        contract.totalVotesFor.call(3, {gas: 200000 }, function (error, result){
                            $("#resultsText").append("<p>The total number of votes for Lyceum's Templar is: " + result.c[0] + "</p>");
                        });
                    });
                });
            });
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
