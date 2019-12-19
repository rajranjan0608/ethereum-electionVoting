pragma solidity >=0.4.21 <0.6.0;

contract Election {

    string public candidate;

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public voters;

    uint public candidatesCount;

    constructor () public {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    function addCandidate (string memory _name) private {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote (uint _candidate) public {
        require(!voters[msg.sender], "Voter has already Voted!");
        require(_candidate <= candidatesCount && _candidate >= 1, "Invalid candidate to Vote!");
        voters[msg.sender] = true;
        candidates[_candidate].voteCount++;
    }

}