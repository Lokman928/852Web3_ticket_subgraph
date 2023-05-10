import {
    Address,
    BigInt,
    DataSourceContext,
    store,
    ethereum,
} from "@graphprotocol/graph-ts";
import {
    afterAll,
    afterEach,
    assert,
    beforeAll,
    clearStore,
    createMockedFunction,
    dataSourceMock,
    describe,
    log,
    logStore,
    test,
} from "matchstick-as";
import { handleTransferBatch, handleTransferSingle } from "../src/EventTicket";
import { createMockFunctionCall } from "./EventTicketHelper/utils";
import {
    createTransferBatchEvent,
    createTransferSingleEvent,
} from "./EventTicketHelper/events";
import { IRLEvent, Owner } from "../generated/schema";
import { stringArrayToValueArray } from "./utils";
import { getOrCreateIRLEventObj, getOrCreateOwnerObj } from "../src/utils";

export const firstOwner = Address.fromString(
    "0x0000000000000000000000000000000000000001"
);
export const secondOwner = Address.fromString(
    "0x0000000000000000000000000000000000000002"
);

export const contractAddress = Address.fromString(
    "0x679b2650bba1f38583d8e248a6c017d54225e6ba"
);

describe("EventTicket", () => {
    beforeAll(() => {
        let context = new DataSourceContext();
        dataSourceMock.setReturnValues(
            contractAddress.toHexString(),
            "local",
            context
        );
    });

    describe("Unit tests", () => {
        afterEach(() => {
            clearStore();
        });

        test("getOrCreateIRLEventObj: Can get IRLEvent detail and create IRLEvent object", () => {
            createMockFunctionCall("1");

            const obj = getOrCreateIRLEventObj(BigInt.fromString("1"));

            assert.entityCount("IRLEvent", 1);
            assert.bigIntEquals(obj.price, BigInt.fromString("45"));
            assert.bigIntEquals(obj.capacity, BigInt.fromString("10"));
        });

        test("getOrCreateOwnerObj: Can create Owner object", () => {
            const obj = getOrCreateOwnerObj(firstOwner);

            assert.entityCount("Owner", 1);
        });
    });

    describe("TransferSingle", () => {
        afterAll(() => {
            clearStore();
        });

        test("Can create Ticket and IRLEvent object if IRLEvent object not exist", () => {
            createMockFunctionCall("1");

            handleTransferSingle(
                createTransferSingleEvent(
                    firstOwner,
                    Address.zero(),
                    firstOwner,
                    BigInt.fromString("1"),
                    BigInt.zero()
                )
            );

            assert.entityCount("IRLEvent", 1);
            assert.fieldEquals("IRLEvent", "1", "price", "45");
            assert.fieldEquals("IRLEvent", "1", "capacity", "10");
            assert.fieldEquals("IRLEvent", "1", "numberOfTicketsSold", "1");

            assert.entityCount("Owner", 1);

            assert.entityCount("Ticket", 1);

            const firstTicketId = ethereum.Value.fromString(
                "1_" + firstOwner.toHexString()
            );

            let IRLEventObj = IRLEvent.load("1");
            if (IRLEventObj != null) {
                assert.arrayEquals(
                    stringArrayToValueArray(IRLEventObj.tickets),
                    [firstTicketId]
                );
            } else {
                assert.assertTrue(false);
            }

            let OwnerObj = Owner.load(firstOwner);
            if (OwnerObj != null) {
                assert.arrayEquals(stringArrayToValueArray(OwnerObj.tickets), [
                    firstTicketId,
                ]);
            } else {
                assert.assertTrue(false);
            }
        });

        test("Can create Ticket and IRLEvent object if IRLEvent object exist", () => {
            createMockFunctionCall("1");

            handleTransferSingle(
                createTransferSingleEvent(
                    firstOwner,
                    Address.zero(),
                    secondOwner,
                    BigInt.fromString("1"),
                    BigInt.zero()
                )
            );

            assert.entityCount("IRLEvent", 1);
            assert.fieldEquals("IRLEvent", "1", "price", "45");
            assert.fieldEquals("IRLEvent", "1", "capacity", "10");
            assert.fieldEquals("IRLEvent", "1", "numberOfTicketsSold", "2");

            assert.entityCount("Owner", 2);

            assert.entityCount("Ticket", 2);

            const firstTicketId = ethereum.Value.fromString(
                "1_" + firstOwner.toHexString()
            );
            const secondTicketId = ethereum.Value.fromString(
                "1_" + secondOwner.toHexString()
            );

            let IRLEventObj = IRLEvent.load("1");
            if (IRLEventObj != null) {
                assert.arrayEquals(
                    stringArrayToValueArray(IRLEventObj.tickets),
                    [firstTicketId, secondTicketId]
                );
            } else {
                assert.assertTrue(false);
            }

            let OwnerObj = Owner.load(secondOwner);
            if (OwnerObj != null) {
                assert.arrayEquals(stringArrayToValueArray(OwnerObj.tickets), [
                    secondTicketId,
                ]);
            } else {
                assert.assertTrue(false);
            }
        });
    });

    describe("TransferBatch", () => {
        afterAll(() => {
            clearStore();
        });

        test("Can create multi Ticket", () => {
            createMockFunctionCall("1");
            createMockFunctionCall("2");

            handleTransferBatch(
                createTransferBatchEvent(
                    firstOwner,
                    Address.zero(),
                    firstOwner,
                    [BigInt.fromString("1"), BigInt.fromString("2")],
                    BigInt.zero()
                )
            );

            assert.entityCount("IRLEvent", 2);
            assert.fieldEquals("IRLEvent", "1", "price", "45");
            assert.fieldEquals("IRLEvent", "1", "capacity", "10");

            assert.entityCount("Owner", 1);

            assert.entityCount("Ticket", 2);

            const firstTicketId = ethereum.Value.fromString(
                "1_" + firstOwner.toHexString()
            );
            const secondTicketId = ethereum.Value.fromString(
                "2_" + firstOwner.toHexString()
            );

            let IRLEventObj = IRLEvent.load("1");
            if (IRLEventObj != null) {
                assert.arrayEquals(
                    stringArrayToValueArray(IRLEventObj.tickets),
                    [firstTicketId]
                );
            } else {
                assert.assertTrue(false);
            }

            let OwnerObj = Owner.load(firstOwner);
            if (OwnerObj != null) {
                assert.arrayEquals(stringArrayToValueArray(OwnerObj.tickets), [
                    firstTicketId,
                    secondTicketId,
                ]);
            } else {
                assert.assertTrue(false);
            }
        });
    });
});

// For coverage test
export { handleTransferBatch, handleTransferSingle };
