import { Locator, Page, expect } from "@playwright/test";
import {BasePage} from "../basePage";

export class ListAdsPage extends BasePage {
    protected pageName = "Модерация объявлений";

    readonly listAdsPageHeader: Locator;
    readonly inputFrom: Locator;
    readonly inputUntil: Locator;
    readonly cardPrice: Locator;
    readonly selectFiltersSort: Locator;
    readonly selectFiltersOrder: Locator;
    readonly selectFiltersCategory: Locator;
    readonly valueCategory: Locator;
    readonly urgentToggle: Locator;

    constructor(page: Page) {
        super(page);
        this.listAdsPageHeader = page.locator("h1", { hasText: "Модерация объявлений" });
        this.inputFrom = page.locator("input[placeholder=\"От\"]");
        this.inputUntil = page.locator("input[placeholder=\"До\"]");
        this.cardPrice = page.locator("[class*=\"_card__price_\"]");
        this.selectFiltersSort = page.locator("//*[@id=\"root\"]/div/div[1]/div[2]/div/div[1]/select"); //понимаю, что такой путь нестабилен, но дата-маркеров не было удобных, а верстка сама тоже составлена.. не очень) понять и простить
        this.selectFiltersOrder = page.locator("//*[@id=\"root\"]/div/div[1]/div[2]/div/div[2]/select");
        this.selectFiltersCategory = page.locator("//*[@id=\"root\"]/div/div[2]/aside/div[2]/div[2]/select");
        this.valueCategory = page.locator("[class*=\"_card__category_\"]");
        this.urgentToggle = page.locator("[class*=\"urgentToggle__slider\"]");
    }

    protected root(): Locator {
        return this.listAdsPageHeader;
    }

    async openAdsPage() {
        await this.page.goto("https://cerulean-praline-8e5aa6.netlify.app");
        await this.waitForOpen();
    }

    async inputPriceRange(minValue?: number, maxValue?: number) {
        if (minValue !== undefined) {
            await this.inputFrom.fill("");
            await this.inputFrom.fill(minValue.toString());
        }

        if (maxValue !== undefined) {
            await this.inputUntil.fill("");
            await this.inputUntil.fill(maxValue.toString());
        }
    }

    async checkPriceRange(minValue?: number, maxValue?: number) {
        const prices = await this.cardPrice.all();

        for (const price of prices) {
            const text = await price.textContent();
            const value = parseInt(text!.replace(/\D/g, ""));

            if (minValue !== undefined) {
                expect(value).toBeGreaterThanOrEqual(minValue);
            }

            if (maxValue !== undefined) {
                expect(value).toBeLessThanOrEqual(maxValue);
            }
        }
    }

    async adsNotFound() {
        await expect(this.page.getByText("📭 Объявления не найдены")).toBeVisible();
    }

    async selectFilterPrice() {
        await this.selectFiltersSort.selectOption({value: "price"});
    }

    async selectFilterAscending() {
        await this.selectFiltersOrder.selectOption({value: "asc"});
    }

    async cardsSortedByPriceAsc() {
        const pricesText = await this.cardPrice.allTextContents();
        const prices = pricesText.map(p => parseInt(p.replace(/\D/g, "")));
        const sortedPrices = [...prices].sort((a, b) => a - b);

        expect(prices).toEqual(sortedPrices);
    }

    async selectFilterDescending() {
        await this.selectFiltersOrder.selectOption({value: "desc"});
    }

    async cardsSortedByPriceDesc() {
        const pricesText = await this.cardPrice.allTextContents();
        const prices = pricesText.map(p => parseInt(p.replace(/\D/g, "")));
        const sortedPrices = [...prices].sort((a, b) => b - a);

        expect(prices).toEqual(sortedPrices);
    }

    async selectFilterCategory(category: string) {
        await this.selectFiltersCategory.selectOption({value: category});
    }

    async getAllValueCategories(expectedCategory: string) {
        const categoriesText = await this.valueCategory.allTextContents();
        for (const text of categoriesText) {
            expect(text.trim(), `Ожидалась категория "${expectedCategory}", но нашли "${text}"`)
                .toBe(expectedCategory);
        }
    }

    async multipleCategories() {
        await expect(this.valueCategory.first()).toBeVisible();

        const categoriesText = await this.valueCategory.allTextContents();
        const uniqueCategories = new Set(categoriesText.map(t => t.trim()));

        expect(uniqueCategories.size).toBeGreaterThan(1);
    }

    async selectOnlyUrgent() {
        await this.urgentToggle.click();
    }

    async allCardsHavePriority(expectedText: string) {
        const cards = this.page.locator("[class*=\"_card__\"]");
        const count = await cards.count();

        for (let i = 0; i < count; i++) {
            const card = cards.nth(i);

            const priority = card.locator("[class*=\"_card__priority_\"]");

            await expect(priority, `У карточки №${i + 1} нет приоритета`).toBeVisible();

            await expect(priority, `У карточки №${i + 1} текст приоритета отличается`)
                .toHaveText(expectedText);
        }
    }
}
