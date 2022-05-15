//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// Deployed to Goerli at 0xA8dd7c3B2527706f134D4E2812a7BCf35a71AD27

contract BuyMeADrink {
    // Event to emit when memo is created
    event NewMemo (
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    // Structure of Memo
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // List of all memos
    Memo[] memos;

    // Adress of the contract deployer
    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    /**
     * @dev buy a drink for contract owner
     * @param _name name of the buyer
     * @param _message a message from buyer
     */
    function buydrink(string memory _name, string memory _message) public payable { 
        require(msg.value > 0, "you can't buy anything with 0 eth");

        // Add memo to memos array
        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        // Emit a log event when memo is created
        emit NewMemo (
            msg.sender,
            block.timestamp,
            _name,
            _message
        );
    }

    /**
     * @dev Send balance to contract owner
     */
    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }

    /**
     * @dev Retrive all the memos
     */
    function getMemos() public view returns(Memo[] memory) {
        return memos;
    }
}