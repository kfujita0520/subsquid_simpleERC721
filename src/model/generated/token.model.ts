import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {Contract} from "./contract.model"
import {TokenStandard} from "./_tokenStandard"
import {TokenBalance} from "./tokenBalance.model"
import {Transfer} from "./transfer.model"

@Entity_()
export class Token {
    constructor(props?: Partial<Token>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Contract, {nullable: true})
    contract!: Contract

    @Index_()
    @Column_("varchar", {length: 7, nullable: false})
    type!: TokenStandard

    @Index_()
    @BigIntColumn_({nullable: true})
    index!: bigint | undefined | null

    @BigIntColumn_({nullable: false})
    supply!: bigint

    @OneToMany_(() => TokenBalance, e => e.token)
    holders!: TokenBalance[]

    @OneToMany_(() => Transfer, e => e.token)
    transfers!: Transfer[]
}
