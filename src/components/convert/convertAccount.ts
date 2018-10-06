import { IAccount, IAccountMapping } from "../interface"

export const AnonymousAccount: IAccount = {
    fullName: "Anornymous",
    id: "",
    avatarId: "",
}

export function convertAccount(account: mendix.lib.MxObject, accountMapping: IAccountMapping): IAccount {
    return {
        avatarId: "",
        id: account.getGuid(),
        fullName: account.get(accountMapping.fullName) as string,
    }
}