/**
 * In this file I implement the solution to problem 2. This problem is fairly straightforward.
 * I mostly just use text matching either directly or through regex, first to parse the line
 * and second to perform product matching.
 *
 * Assumptions:
 * - I assume that the input line format is <number of items> <item name> at <single item price>.
 * - I assume that the output line format is <number of items> <imported?> <item name>: <total item price>.
 * - Sales tax is applied on each item individually so: roundUp(n*p/100) * quantity.
 * - Both types of sales tax are rounded
 */

class LineItem {
    quantity: number;
    description: string;
    basePrice: number;
    taxes: number;
    imported: boolean;

    private static lineItemRe = /^(\d+)[ ]+(.*)[ ]+at[ ]+(\d+.\d{2})$/;

    constructor(
        quantity: number,
        description: string,
        price: number,
        imported: boolean,
    ) {
        this.quantity = quantity;
        this.description = description;
        this.basePrice = price;
        this.imported = imported;
        this.taxes = 0;
    }

    get price(): number {
        return this.basePrice + this.taxes;
    }

    private roundCents(n: number): number {
        return Math.ceil(n * 20) / 20
    }

    private formatMoney(n: number): string {
        return n.toFixed(2);
    }

    display(): string {
        return `${this.quantity} ${
            this.imported ? 'imported ' : ''
        }${this.description}: ${this.formatMoney(this.quantity * (this.basePrice + this.taxes))}`
    }

    applyTax(percentage: number): number {
        const tax = this.roundCents(this.basePrice * percentage);
        this.taxes += tax;
        return tax;
    }

    static parseLine(line: string): LineItem {
        const match = LineItem.lineItemRe.exec(line)

        const [_, qS, dS, bPS] = match;

        const importedIndex = dS.toLowerCase().split(' ').indexOf('imported');

        let description = dS;
        if (importedIndex >= 0) {
            const descriptionParts = dS.split(' ');
            descriptionParts.splice(importedIndex, 1);
            description = descriptionParts.join(' ');
        }

        return new LineItem(
            Number.parseInt(qS, 10),
            description,
            Number.parseFloat(bPS),
            importedIndex >= 0
        );
    }
}

class SalesManager {
    saleTaxExemptKeywords: Set<string>;
    salesTax: number;
    importTax: number;

    constructor(salesTax: number, importTax: number, saleTaxExemptKeywords: string[]) {
        this.saleTaxExemptKeywords = new Set(saleTaxExemptKeywords);
        this.salesTax = salesTax;
        this.importTax = importTax;
    }

    private itemIsSaleTaxable(item: LineItem): boolean {
        for (const keyword of this.saleTaxExemptKeywords) {
            if (item.description.toLowerCase().split(' ').includes(keyword)) {
                return false;
            }
        }
        return true;
    }

    generateReceipt(input: string): string {
        const lineItems = input.trimRight().split('\n').map((line) => {
            return LineItem.parseLine(line.trimRight());
        })

        let totalTax = 0;

        const outputLines = lineItems.map((item) => {
            if (item.imported) {
                totalTax += item.applyTax(this.importTax);
            }

            if (this.itemIsSaleTaxable(item)) {
                totalTax += item.applyTax(this.salesTax);
            }

            return item.display();
        })

        const totalPrice = lineItems.reduce((acc, item) => {
            return acc + item.price;
        }, 0);

        outputLines.push(`Sales Taxes: ${totalTax.toFixed(2)}`);
        outputLines.push(`Total: ${totalPrice.toFixed(2)}`);

        return outputLines.join('\n');
    }
}

export {
    SalesManager
};
