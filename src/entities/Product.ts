import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { ProductSituation } from "./ProductSituation";
import { ProductCategory } from "./ProductCategory";

@Entity("products")
export class Product {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255 })
    name!: string;

    @Column({ unique: true })
    slug!: string;

    @Column({ type: "int" })
    productSituationId!: number;

    @Column({ type: "int" })
    productCategoryId!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => ProductSituation, (productSituation) => productSituation.products)
    @JoinColumn({ name: "productSituationId" })
    productSituation!: ProductSituation;

    @ManyToOne(() => ProductCategory, (productCategory) => productCategory.products)
    @JoinColumn({ name: "productCategoryId" })
    productCategory!: ProductCategory;
}
