// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract Ration{

modifier onlyGov() {
    require(msg.sender == gov);
    _;
}

modifier onlyEmp() {
    require(exists(msg.sender),"not authorized");
    _;
}

// poeple detailes
struct Person {
    string name;
    int phone;
    int adharNum;
    string[] family;
    uint lastPurchase;
    address id;
}

mapping(address => Person) public people;
mapping(address => Person) public peopleReq;
address[] public peop;
address[] public reqPeople;
address[] public peopDel;

//shop and distributer details
struct distributer {
    string name;
    uint phone;
    uint adharNum;  
    address id;
    string shopName;
}
mapping(address => distributer) public shop;
mapping(address => distributer) public shopReq;
address[] public emp;
address[] public empReq;
address[] public empDel; //for Delet request queuing



mapping(address => mapping(uint => Quant)) public bought;
struct Quant {
    uint rice;
    uint wheat;
    uint sugar;
    uint palm_oil;
    uint other;
}


Quant public govSet;

struct Sold {
    address cName;
    Quant soldQuant;
}

mapping(address => mapping(uint => mapping(uint => Sold[]))) public sellerLog;
address public gov;

//verified cusromers
function existsPeop(address x) private view returns (bool) {

    for (uint i = 0; i < peop.length; i++) {
        if (peop[i] == x) {
            return true;
        }
    }
    return false;
}


function existsPeopReq(address x) private view returns(bool){

    for (uint i = 0; i < reqPeople.length; i++) {
        if (reqPeople[i] == x) {
            return true;
        }
    }
    return false;
}


function existsEmpReq(address employee) private view returns (bool) {
    for (uint i = 0; i < empReq.length; i++) {
        if (empReq[i] == employee) {
            return true;
        }
    }
    return false;
}

function exists(address employee) private view returns (bool) {
    for (uint i = 0; i < emp.length; i++) {
        if (emp[i] == employee) {
            return true;
        }
    }
    return false;
}

constructor() {
    gov = msg.sender;
}
function setItems(uint r,uint w,uint s,uint p,uint o)public {
    require(msg.sender == gov,"Not authorized");

    govSet.rice = r;
    govSet.wheat = w;
    govSet.sugar = s;
    govSet.palm_oil = p;
    govSet.other = o;
}
function showitems() public view returns(Quant memory){
    return govSet;
}


function deleteItems()public{
    require(msg.sender == gov,"Not authorized");
    govSet.rice = 0;
    govSet.wheat = 0;
    govSet.sugar = 0;
    govSet.palm_oil = 0;
    govSet.other = 0;
}

function setEmp(address x,string memory _name,string memory _shopName,uint _phone,uint _adhar) public onlyGov {

    require(!exists(x),"Already registered");
    emp.push(x);
    distributer storage dis = shop[x];
    dis.name = _name;
    dis.phone = _phone;
    dis.adharNum = _adhar;
    dis.shopName = _shopName;
    dis.id=x;

}

function reqShop(string memory _name,string memory _shopName,uint _phone,uint _adhar) public{
    address x = msg.sender;

    require(!existsEmpReq(x),"Already registered");
    empReq.push(x);
    distributer storage dis = shopReq[x];
    dis.name = _name;
    dis.phone = _phone;
    dis.adharNum = _adhar;
    dis.shopName = _shopName;
    dis.id = x;
}

function next() public view onlyGov returns (distributer memory){

    address k = empReq[0];

    return shopReq[k];
}

function verify(address x,uint a) public{
    // a=1 means accept else reject
    require(msg.sender==gov,"Not authorized");
    if(a == 1){
    emp.push(x);
    shop[x] = shopReq[x];
    }

    for (uint i = 0; i < empReq.length; i++) {
        if (empReq[i] == x) {
          delete empReq[i];
       }
    }
        
    delete shopReq[x];
}

function removeEmp(address x,uint a) public{
    // a=1 means delete is requested by employee and need to be deleted from queue
    require(msg.sender==gov,"Not authorized");

    for (uint i = 0; i < emp.length; i++) {
        if (emp[i] == x) {
          delete emp[i];
       }
    }
    delete shop[x];
    if(a==1){
        for (uint i = 0; i < empDel.length; i++) {
        if (empDel[i] == x) {
          delete empDel[i];
       }
    }
    }
    
}


//use same function to delete and reject value of a other then 1
function verifyCustomer(address x,uint a) public {

    require(exists(x),"Not authorized");
    if(a==1){
    
    people[x] = peopleReq[x];
    peop.push(x);
    }
    for (uint i = 0; i < reqPeople.length; i++) {
        if (reqPeople[i] == x) {
          delete reqPeople[i];
          delete peopleReq[x];
       }
    }
}



//next customer to verify
function nextCustomer() public view returns(Person memory){
    address k = reqPeople[0];
    
    return peopleReq[k];
}

//next customer to delete
function nextCustomerDel() public view returns(Person memory){
    address k = peopDel[0];
    
    return people[k];
}


function delCust(address x,uint a) public{
        // a=1 means delete is requested by customer and need to be deleted from queue
    require(exists(x),"Not authorized");

    for (uint i = 0; i < peop.length; i++) {
        if (peop[i] == x) {
          delete peop[i];
       }
    }
    delete people[x];
    if(a==1){
        for (uint i = 0; i < peopDel.length; i++) {
        if (peopDel[i] == x) {
          delete peopDel[i];
       }
    }
    }
}


function distribute(address y) onlyEmp public returns (Quant memory) {
    uint256 year = ((block.timestamp - 946684800) / 31536000) + 2000;
    uint month = ((block.timestamp / 60 / 60 / 24 / 30) % 12) - 8;

    // y represents Customer address
    require(month >= people[y].lastPurchase + 1, "Can only purchase once a month");
    require(existsPeop(y),"Not Registered");
    address x= msg.sender; //seller address
    Quant memory outputQuant = cal(y);
    
    Sold memory sale = Sold({
        cName: y,
        soldQuant: outputQuant
    });
    sellerLog[x][year][month].push(sale);

    bought[x][year] = outputQuant;
    people[x].lastPurchase = month;

    return outputQuant;
}
function cal(address x) public view returns (Quant memory) {
    uint constantFactor = people[x].family.length + 1;

    Quant memory outputQuant = Quant({
    rice: govSet.rice * constantFactor,
    wheat: govSet.wheat * constantFactor,
    sugar: govSet.sugar * constantFactor,
    palm_oil: govSet.palm_oil * constantFactor,
    other: govSet.other * constantFactor
    });
    return outputQuant;
}

function getMon() public view returns(uint, uint256){
    uint256 year = ((block.timestamp - 946684800) / 31536000) + 2000;
    uint month = ((block.timestamp / 60 / 60 / 24 / 30) % 12) - 8;
    return (year,month);
}

function getPhone(address x) public view returns (int) {
    return people[x].phone;
}


function getLogs(address e, uint y, uint m) public view returns (Sold[] memory) {
    return sellerLog[e][y][m];
}


//  Customer

function register(address x,string memory _name, int _phone, int _adhar, string[] memory _fam) public {

    require(!existsPeopReq(x),"Already Applied");
    Person storage member = peopleReq[x];
    member.id = x;
    member.name = _name;
    member.adharNum = _adhar;
    member.phone = _phone;
    member.family = _fam;
    reqPeople.push(x);
}

//a=0 delete shop
function delReq(address x,uint a) public{
   if(a==0){
       empDel.push(x);
   }
   if(a==1){
       peopDel.push(x);
   }
}


function getFam(address a) public view returns(Person memory){
    //uint y = ((block.timestamp - 946684800) / 31536000) + 2000;
    
    return (people[a]);
}


function addFamilyMem(address id, string memory familyMember) public {
    people[id].family.push(familyMember);
}

function deleteFamily(address id, string memory familyMember) public {

    for (uint i = 0; i < people[id].family.length; i++) {
        if (keccak256(bytes(people[id].family[i])) == keccak256(bytes(familyMember))) {
            
            people[id].family[i] = people[id].family[people[id].family.length - 1];
            
            people[id].family.pop();
            return;
        }
    }
   
    revert("Family member not found");
}

}
 