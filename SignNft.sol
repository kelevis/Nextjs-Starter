// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SignNft is ERC721, ERC721Enumerable, ERC721URIStorage {
    address immutable public signer; // 签名地址
    uint256 public maxSupply;
    mapping(uint256=>bool) public isMinted;

  // 构造函数，初始化NFT合集的名称、代号、总发行量、签名地址
    constructor(string memory _name, string memory _symbol, uint256 _maxSupply, address _signer)
    ERC721(_name, _symbol)
    {
        signer = _signer;
        maxSupply=_maxSupply;
    }

    function safeMint(uint256 _tokenId, string memory _uri, bytes memory _signature) public {
        address _to = msg.sender;
        bytes32 _msgHash = getMessageHash(_to,_tokenId);
        bytes32 _ethSignedMessageHash = toEthSignedMessageHash(_msgHash); // 计算以太坊签名消息
        require(verify(_ethSignedMessageHash, _signature,signer), "Invalid signature"); // ECDSA检验通过
        require(_tokenId<maxSupply,"Reach max supply!");
        require(!isMinted[_tokenId],"Reach max supply!");
        _safeMint(_to, _tokenId);
        _setTokenURI(_tokenId, _uri);
    }

    // The following functions are overrides required by Solidity.
    function _update(address _to, uint256 _tokenId, address _auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(_to, _tokenId, _auth);
    }

    function _increaseBalance(address _account, uint128 _value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(_account, _value);
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(_tokenId);
    }

    function supportsInterface(bytes4 _interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(_interfaceId);
    }



    function getMessageHash(address _account,uint256 _tokenId) public pure returns(bytes32){
        return keccak256(abi.encodePacked(_account,_tokenId));
    }

    function toEthSignedMessageHash(bytes32 _hash) internal pure returns (bytes32) {
        // 哈希的长度为32
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _hash));
    }

    function verify(bytes32 _msgHash, bytes memory _signature, address _signer) internal pure returns (bool) {
        return recoverSigner(_msgHash, _signature) == _signer;
    }
    
    function recoverSigner(bytes32 _msgHash, bytes memory _signature) internal pure returns (address){
        // 检查签名长度，65是标准r,s,v签名的长度
        require(_signature.length == 65, "invalid signature length");
        bytes32 r;
        bytes32 s;
        uint8 v;
        // 目前只能用assembly (内联汇编)来从签名中获得r,s,v的值
        assembly {
            /*
            前32 bytes存储签名的长度 (动态数组存储规则)
            add(sig, 32) = sig的指针 + 32
            等效为略过signature的前32 bytes
            mload(p) 载入从内存地址p起始的接下来32 bytes数据
            */
            // 读取长度数据后的32 bytes
            r := mload(add(_signature, 0x20))
            // 读取之后的32 bytes
            s := mload(add(_signature, 0x40))
            // 读取最后一个byte
            v := byte(0, mload(add(_signature, 0x60)))
        }
        // 使用ecrecover(全局函数)：利用 msgHash 和 r,s,v 恢复 signer 地址
        return ecrecover(_msgHash, v, r, s);
    }
}