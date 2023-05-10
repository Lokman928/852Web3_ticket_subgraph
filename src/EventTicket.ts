import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Ticket } from "../generated/schema";
import {
    TransferBatch as TransferBatchEvent,
    TransferSingle as TransferSingleEvent,
} from "../generated/EventTicket/EventTicket";
import {
    getOrCreateArray,
    getOrCreateIRLEventObj,
    getOrCreateOwnerObj,
} from "./utils";

function _handleMint(tokenId: BigInt, from: Address, to: Address): void {
    let IRLEventObj = getOrCreateIRLEventObj(tokenId);
    let ownerObj = getOrCreateOwnerObj(to);

    let ticketObj = new Ticket(tokenId.toString() + "_" + to.toHexString());

    let IRLEvent_ticketArray = getOrCreateArray(IRLEventObj.tickets);
    IRLEvent_ticketArray.push(ticketObj.id);
    IRLEventObj.tickets = IRLEvent_ticketArray;

    let owner_ticketsArray = getOrCreateArray(ownerObj.tickets);
    owner_ticketsArray.push(ticketObj.id);
    ownerObj.tickets = owner_ticketsArray;

    IRLEventObj.numberOfTicketsSold = IRLEventObj.numberOfTicketsSold.plus(BigInt.fromString('1'));

    IRLEventObj.save();
    ownerObj.save();
    ticketObj.save();
}

export function handleTransferSingle(e: TransferSingleEvent): void {
    const tokenId = e.params.id;
    const from = e.params.from;
    const to = e.params.to;

    if (
        from.equals(
            Address.fromHexString("0x0000000000000000000000000000000000000000")
        ) &&
        to.notEqual(
            Address.fromHexString("0x0000000000000000000000000000000000000000")
        )
    ) {
        // Mint a new ticket
        _handleMint(tokenId, from, to);
    }
}

export function handleTransferBatch(e: TransferBatchEvent): void {
    const tokenIds = e.params.ids;
    const from = e.params.from;
    const to = e.params.to;

    if (
        from.equals(
            Address.fromHexString("0x0000000000000000000000000000000000000000")
        ) &&
        to.notEqual(
            Address.fromHexString("0x0000000000000000000000000000000000000000")
        )
    ) {
        // Mint a new ticket
        for (let i = 0; i < tokenIds.length; i++) {
            _handleMint(tokenIds[i], from, to);
        }
    }
}
