import { newMockEvent } from "matchstick-as";
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts";
import {
    TransferBatch,
    TransferSingle,
} from "../../generated/EventTicket/EventTicket";

export function createTransferSingleEvent(
    operator: Address,
    from: Address,
    to: Address,
    id: BigInt,
    value: BigInt
): TransferSingle {
    let transferSingleEvent = changetype<TransferSingle>(newMockEvent());

    transferSingleEvent.parameters = new Array();

    transferSingleEvent.parameters.push(
        new ethereum.EventParam(
            "operator",
            ethereum.Value.fromAddress(operator)
        )
    );
    transferSingleEvent.parameters.push(
        new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
    );
    transferSingleEvent.parameters.push(
        new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
    );
    transferSingleEvent.parameters.push(
        new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
    );
    transferSingleEvent.parameters.push(
        new ethereum.EventParam(
            "value",
            ethereum.Value.fromUnsignedBigInt(value)
        )
    );

    return transferSingleEvent;
}

export function createTransferBatchEvent(
    operator: Address,
    from: Address,
    to: Address,
    ids: BigInt[],
    value: BigInt
): TransferBatch {
    let transferBatchEvent = changetype<TransferBatch>(newMockEvent());

    transferBatchEvent.parameters = new Array();

    transferBatchEvent.parameters.push(
        new ethereum.EventParam(
            "operator",
            ethereum.Value.fromAddress(operator)
        )
    );
    transferBatchEvent.parameters.push(
        new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
    );
    transferBatchEvent.parameters.push(
        new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
    );
    transferBatchEvent.parameters.push(
        new ethereum.EventParam("ids", ethereum.Value.fromUnsignedBigIntArray(ids))
    );
    transferBatchEvent.parameters.push(
        new ethereum.EventParam(
            "value",
            ethereum.Value.fromUnsignedBigInt(value)
        )
    );

    return transferBatchEvent;
}
