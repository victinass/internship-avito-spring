import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../basePage";

export class StatisticsPage extends BasePage {
    protected pageName = "Статистика модератора";

    readonly statisticsPageHeader: Locator;
    readonly updateButton: Locator;
    readonly timerContainer: Locator;
    readonly statsLink: Locator;
    readonly autoUpdateToggle: Locator;
    readonly autoUpdateDisabledMessage: Locator;

    constructor(page: Page) {
        super(page);

        // Используем регулярку без emoji для надежности
        this.statisticsPageHeader = page.locator("h1", { hasText: /Статистика модератора/ });

        this.updateButton = page.getByRole("button", { name: "Обновить сейчас" });
        this.autoUpdateToggle = page.getByRole("button", { name: "Отключить автообновление" });
        this.autoUpdateDisabledMessage = page.locator("div._disabled_ir5wu_136 span", { hasText: "Автообновление выключено" });

        this.timerContainer = page.locator("div._time_ir5wu_61");
        this.statsLink = page.locator("a._link_14hw7_51[href=\"/stats\"]");
    }

    protected root(): Locator {
        return this.statisticsPageHeader;
    }

    async openStatisticsPage() {
        // Загружаем главную страницу
        await this.page.goto("https://cerulean-praline-8e5aa6.netlify.app/");

        // Кликаем по ссылке "Статистика" в меню
        await this.statsLink.click();

        // Ждем появления заголовка уже на странице статистики
        await this.waitForOpen();
    }

    async clickUpdateButton() {
        await this.updateButton.click();
    }

    async getTimerValue(): Promise<string | null> {
        if (!(await this.timerContainer.isVisible())) return null;

        const text = (await this.timerContainer.textContent())?.replace(/\s/g, "") ?? "";
        const match = text.match(/\d{1,2}:\d{2}/);
        return match ? match[0] : null;
    }

    async expectTimerReset() {
        const timer = await this.getTimerValue();
        expect(timer).not.toBeNull();
        expect(timer).toMatch(/\d{1,2}:\d{2}/);
    }

    async expectTimerDecreased(before: string) {
        const after = await this.getTimerValue();
        expect(after).not.toBeNull();
        expect(after).not.toBe(before);
    }

    async clickAutoUpdateToggleButton() {
        await this.autoUpdateToggle.click();
    }

    async expectAutoUpdateDisabled() {
        await expect(this.autoUpdateDisabledMessage).toBeVisible({ timeout: 5000 });
        const text = await this.autoUpdateDisabledMessage.textContent();
        expect(text?.trim()).toBe("Автообновление выключено");
    }

    async expectAutoUpdateEnabled() {
        await expect(this.timerContainer).toBeVisible({ timeout: 5000 });

        const text = await this.timerContainer.textContent();
        expect(text).toContain("Обновление через");
    }
}
