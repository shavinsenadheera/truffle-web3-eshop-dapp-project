pragma solidity ^0.5.16;

contract eshop
{
    uint count;
    address owner;
    mapping (uint => Person) person;

    struct Person
    {
        uint index;
        string name;
        string image;
    }

    constructor() public
    {
        owner = msg.sender;
        count = 0;
    }

    modifier isowner()
    {
        require(msg.sender==owner);
        _;
    }

    function getCount() public view returns(uint)
    {
        return count;
    }

    function addPerson(string memory _name, string memory _imagePath) public isowner
    {
        uint _index = count * 1111111 + count;
        person[count] = Person(_index, _name, _imagePath);
        count++;
    }

    function getPerson(uint _id) public view returns(uint, string memory, string memory)
    {
        return (person[_id].index, person[_id].name, person[_id].image);
    }

    function deletePerson(uint _id) public
    {
        delete person[_id];
    }

}