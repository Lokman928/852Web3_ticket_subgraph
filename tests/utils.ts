import { ethereum } from "@graphprotocol/graph-ts";

export function stringArrayToValueArray(s: string[] | null): ethereum.Value[] {
    if (s == null) {
        return [];
    }
    return s.map<ethereum.Value>((s) => ethereum.Value.fromString(s));
}