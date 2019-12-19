App = {

    loading: false,
    contracts: {},

    load: async () => {
        await App.loadWeb3();
        await App.loadAccount(); 
        await App.loadContract();
        await App.render();
    },

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
                web3.eth.sendTransaction({ });
            }catch (error) {

            }
        }else if(window.web3) {
            App.web3Provider = web3.currentProvider;
            window.web3 = new Web3(web3.currentProvider);
            web3.eth.sendTransaction({});
        }else{
            console.log('Non-Ethereum Browser detected');
        }
    },

    loadAccount: async() => {
        await web3.eth.getAccounts().then((result)=>{
            App.account = result[0];
            console.log(App.account);
        });
    },

    loadContract: async () => {
        const election = await $.getJSON('/electionJSON');
        App.contracts.election = TruffleContract(election);
        App.contracts.election.setProvider(App.web3Provider);
        
        App.election = await App.contracts.election.deployed();
    },

    render: async() => {
        if(App.loading) {
            return;
        }

        App.setLoading(true);

        $('#account').html(App.account);

        App.renderTasks();

        App.setLoading(false);
    },

    renderTasks: async() => {
        var candidatesCount = await App.election.candidatesCount();
        
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
            }else {
                $("#hasVoted").show();
            }

            var candidateTemplate2 = "<option value='"+i+"'>" + name + "</option>";
            $("#candidatesSelect").append(candidateTemplate2);
        }

    },

    castVote: async() => {
        const candidateID = $("#candidatesSelect").val();
        await App.election.vote(candidateID, { from: App.account });
        window.location.reload();
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

$(() => {
    window.addEventListener('load', ()=>{
        App.load();
    })
});

