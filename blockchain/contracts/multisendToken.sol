// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MultisendToken is Ownable{
    using SafeERC20 for IERC20;
    constructor()Ownable(msg.sender){}

    error SendLimit();
    error ZeroAddress();
	error NoTokenAvailable();
    event WithdrawToken(uint256 amount);
    function sendToken(
		IERC20 _token,
		address[] calldata _accounts,
		uint256[] calldata _amounts
	) external {
		if(_accounts.length >= 200) revert SendLimit();
		address sender = _msgSender();
		for (uint256 i; i < _accounts.length; ) {
			if(_accounts[i] == address(0)) revert ZeroAddress();
			_token.safeTransferFrom(sender, _accounts[i], _amounts[i]);

			unchecked {
				++i;
			}
		}
	}

	function withdrawTokenBalance(IERC20 _token, uint256 amount) external onlyOwner {
       _token.safeTransfer(msg.sender, amount);
	   emit WithdrawToken(amount);
   }
}