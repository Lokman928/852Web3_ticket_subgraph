import { createMockedFunction } from "matchstick-as";
import { contractAddress } from "../EventTicket.test";
import { BigInt, ethereum } from "@graphprotocol/graph-ts";

export function createMockFunctionCall(tokenId: string): void {
    createMockedFunction(
        contractAddress,
        "ticketPrice",
        "ticketPrice(uint256):(uint256)"
    )
        .withArgs([ethereum.Value.fromUnsignedBigInt(BigInt.fromString(tokenId))])
        .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString("45"))]);

    createMockedFunction(
        contractAddress,
        "capacity",
        "capacity(uint256):(uint256)"
    )
        .withArgs([ethereum.Value.fromUnsignedBigInt(BigInt.fromString(tokenId))])
        .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString("10"))]);
}
