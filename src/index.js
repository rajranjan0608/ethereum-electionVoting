//App would contain all the necessary functions for interaction
var App = {
    loading: false,
    contracts: {},
  
    //Main function to be called first
    load: async () => {
      await App.loadWeb3();
      await App.loadAccount(); 
      await App.loadContract();
      await App.render();
    },
  
    //Loading web3 on the browser
    loadWeb3: async () => {
      if(typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
        App.web3Provider = web3.currentProvider;
      }else {
        window.alert("Please connect to Metamask");
      }
  
      if(window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
          await ethereum.enable();
        }catch (error) {
          console.log(error);
        }
      }else if(window.web3) {
        App.web3Provider = web3.currentProvider;
        window.web3 = new Web3(web3.currentProvider);
      }else{
        console.log('Non-Ethereum Browser detected');
      }
    },
  
    //This function would load account from Metamask to our dApp
    loadAccount: async() => {
      await web3.eth.getAccounts().then((result)=>{
        App.account = result[0];
        console.log(App.account);
      });
    },
  
    //This function would help in loading contract to App.election
    loadContract: async () => {
      //Static pre-deployed contracts should be handled like this
      const election = await $.getJSON('/electionJSON');
      App.contracts.election = TruffleContract(election);
      App.contracts.election.setProvider(App.web3Provider);
      App.election = await App.contracts.election.deployed();
    },
  
    //This function will be called after the browser is ready for blockchain interaction
    render: async() => {
      if(App.loading) {
        return;
      }
      App.setLoading(true);
      $('#account').html(App.account);
      App.renderCandidates();
      App.setLoading(false);
    },
  
    //This will render blockchain data to the frontend.
    renderCandidates: async() => {
      var candidatesCount = await App.election.candidatesCount();
  
      $("#candidateResults").html("");
      $("#candidatesSelect").html("");
        
      for(var i=1; i <= candidatesCount; i++) {
        const candidate = await App.election.candidates(i);
  
        const id = candidate[0];
        const name = candidate[1];
        const voteCount = candidate[2];
  
        var candidateTemplate1 = "<tr>"+
                                    "<td>" + id + "</td>" +
                                    "<td>" + name + "</td>" +
                                    "<td>" + voteCount + "</td>" +
                                "</tr>";      
        $("#candidateResults").append(candidateTemplate1);
  
        var hasVoted = await App.election.voters(App.account);
        if(!hasVoted) {
          $("form").show();
          $("#hasVoted").hide();
        }else {
          $("#hasVoted").show();
          $("form").hide();
        }
  
        var candidateTemplate2 = "<option value='"+i+"'>" + name + "</option>";
        $("#candidatesSelect").append(candidateTemplate2);
      }
    },
  
    //This function will call vote() on Fuji testnet
    castVote: async() => {
      const candidateID = $("#candidatesSelect").val();
      await App.election.vote(candidateID, { from: App.account });
      App.renderCandidates();
    },
  
    setLoading: (boolean) => {
      App.loading = boolean;
      const loader = $('#loader');
      const content = $('#content');
      if(boolean) {
        loader.show();
        content.hide();
      }else {
        loader.hide();
        content.show();
      }
    }
  };
  
  //Driver function to initiate the blockchain interaction
  $(() => {
    window.addEventListener('load', ()=>{
      App.load();
    });
  });
  
  window.App = App;