import { test } from "@playwright/test";
import { StatisticsPage } from "../../pages/statisticsPage/statisticsPage";

test("Применение кнопки Обновить", async ({ page }) => {
    //arange
    const statisticsPage = new StatisticsPage(page);
    const before = await statisticsPage.getTimerValue();

    //act
    await statisticsPage.openStatisticsPage();
    await statisticsPage.clickUpdateButton();

    //assert
    await statisticsPage.expectTimerReset();
    await statisticsPage.expectTimerDecreased(before!);
});

test("Остановка таймера со временем для отключения автообновления", async ({ page }) => {
    //arange
    const statisticsPage = new StatisticsPage(page);

    //act
    await statisticsPage.openStatisticsPage();
    await statisticsPage.clickAutoUpdateToggleButton();

    //assert
    await statisticsPage.expectAutoUpdateDisabled();
});

test("Включение таймера со временем для работы автообновления", async ({ page }) => {
    //arange
    const statisticsPage = new StatisticsPage(page);

    //act
    await statisticsPage.openStatisticsPage();
    await statisticsPage.clickAutoUpdateToggleButton();

    //assert
    await statisticsPage.expectAutoUpdateEnabled();
});
