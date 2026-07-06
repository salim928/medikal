// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ConsentRegistry {
  struct ConsentGrant {
    address patient;
    address provider;
    uint256 grantedAt;
    uint256 expiresAt;
    string scope;
    bytes32 ipfsHash;
  }

  mapping(bytes32 => ConsentGrant) public consents;
  ConsentGrant[] public consentHistory;

  event ConsentGranted(
    address indexed patient,
    address indexed provider,
    string scope,
    uint256 expiresAt
  );

  event ConsentRevoked(
    address indexed patient,
    address indexed provider
  );

  function grantConsent(
    address provider,
    string memory scope,
    uint256 durationSeconds,
    bytes32 ipfsHash
  ) external {
    bytes32 id = keccak256(abi.encode(msg.sender, provider));

    ConsentGrant memory grant = ConsentGrant(
      msg.sender,
      provider,
      block.timestamp,
      block.timestamp + durationSeconds,
      scope,
      ipfsHash
    );

    consents[id] = grant;
    consentHistory.push(grant);

    emit ConsentGranted(msg.sender, provider, scope, grant.expiresAt);
  }

  function revokeConsent(address provider) external {
    bytes32 id = keccak256(abi.encode(msg.sender, provider));
    delete consents[id];
    emit ConsentRevoked(msg.sender, provider);
  }

  function isConsentValid(address patient, address provider)
    external
    view
    returns (bool)
  {
    bytes32 id = keccak256(abi.encode(patient, provider));
    return consents[id].expiresAt > block.timestamp;
  }

  function getConsentHistory() external view returns (ConsentGrant[] memory) {
    return consentHistory;
  }
}