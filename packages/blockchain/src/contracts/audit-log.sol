// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AuditLog {
  struct LogEntry {
    address user;
    string action;
    bytes32 resourceHash;
    uint256 timestamp;
  }

  LogEntry[] public logs;

  event LogCreated(address indexed user, string action, bytes32 indexed resourceHash);

  function log(string memory action, bytes32 resourceHash) external {
    logs.push(LogEntry(msg.sender, action, resourceHash, block.timestamp));
    emit LogCreated(msg.sender, action, resourceHash);
  }

  function getLogCount() external view returns (uint256) {
    return logs.length;
  }

  function getLog(uint256 index) external view returns (LogEntry memory) {
    require(index < logs.length, "Index out of bounds");
    return logs[index];
  }

  function getLogs(uint256 offset, uint256 limit)
    external
    view
    returns (LogEntry[] memory)
  {
    uint256 end = offset + limit > logs.length ? logs.length : offset + limit;
    LogEntry[] memory result = new LogEntry[](end - offset);

    for (uint256 i = offset; i < end; i++) {
      result[i - offset] = logs[i];
    }

    return result;
  }
}