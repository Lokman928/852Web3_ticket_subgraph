import { Address, BigInt, Bytes, dataSource } from "@graphprotocol/graph-ts";
import { IRLEvent, Owner } from "../generated/schema";
import { EventTicket } from "../generated/EventTicket/EventTicket";
import { log } from "matchstick-as";

export function getOrCreateArray(
    arrayObj: Array<string> | null
): Array<string> {
    if (arrayObj == null) {
        return [];
    } else {
        return arrayObj;
    }
}

export function getOrCreateIRLEventObj(eventId: BigInt): IRLEvent {
    let eventObj = IRLEvent.load(eventId.toString());

    if (eventObj == null) {
        eventObj = new IRLEvent(eventId.toString());

        let contract = EventTicket.bind(dataSource.address());

        let priceResult = contract.try_ticketPrice(eventId);
        if (priceResult.reverted) {
            log.error("Fail to get IRLEvent {} ticket price", [
                eventId.toString(),
            ]);
            eventObj.price = BigInt.fromI32(-1);
        } else {
            eventObj.price = priceResult.value;
        }

        let capacityResult = contract.try_capacity(eventId);
        if (capacityResult.reverted) {
            log.error("Fail to get IRLEvent {} eventId", [eventId.toString()]);
            eventObj.capacity = BigInt.fromI32(-1);
        } else {
            eventObj.capacity = capacityResult.value;
        }

        eventObj.numberOfTicketsSold = BigInt.fromI32(0);

        eventObj.save();
    }

    return eventObj;
}

export function getOrCreateOwnerObj(owner: Address): Owner {
    let ownerObj = Owner.load(owner);

    if (ownerObj == null) {
        ownerObj = new Owner(owner);
        ownerObj.save();
    }

    return ownerObj;
}
