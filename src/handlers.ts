import { ContractTransaction, Contract } from "../generated/schema";

export function handleAllEvents(event: Event): void {
  let txId = event.address + "-" + event.transactionHash.toHex();
  let txEntity = ContractTransaction.load(txId);
  if (!txEntity) {
    txEntity = new ContractTransaction(txId);
    txEntity.contract = event.address;
    txEntity.transactionHash = event.transactionHash;
    txEntity.blockNumber = event.block.number;
    txEntity.timestamp = event.block.timestamp;
    txEntity.save();

    let contractId = event.address;
    let contractEntity = Contract.load(contractId);
    if (!contractEntity) {
      contractEntity = new Contract(contractId);
      contractEntity.address = contractId;
      contractEntity.transactionCount = BigInt.fromI32(1);
    } else {
      contractEntity.transactionCount = contractEntity.transactionCount.plus(BigInt.fromI32(1));
    }
    contractEntity.save();
  }
}